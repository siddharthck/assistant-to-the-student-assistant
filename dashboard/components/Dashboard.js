import React, { useEffect, useState } from "react";
// import { fetchEventList, fetchEventDetails } from "../../utils/api";
import rooms from '../../rooms.json';
import { extractEventMetadata } from '../../utils/parser';

function Dashboard({ timeRange }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Dashboard component mounted with timeRange:", timeRange);

  useEffect(() => {
    async function loadEvents() {
      console.log("Loading events for timeRange:", timeRange);
      setLoading(true);
      try {
        // Fetch event list for all groups
        const roomsData = require("../../rooms.json");
        console.log("Rooms data loaded:", roomsData);

        const eventPromises = Object.values(roomsData).flatMap((group) => {
          if (group.group_id) {
            console.log("Fetching events for group_id:", group.group_id);
            return fetchEventList(group.group_id, timeRange);
          }
          return [];
        });

        const eventLists = await Promise.all(eventPromises);
        console.log("Event lists fetched:", eventLists);

        const allEvents = eventLists.flatMap((list) => {
          if (Array.isArray(list)) {
            return list;
          } else {
            console.warn("Unexpected response format:", list);
            return [];
          }
        });
        console.log("All events after flattening:", allEvents);

        // Fetch detailed event data
        const detailedEventPromises = allEvents.map((event) => {
          console.log("Fetching details for event:", event);
          return fetchEventDetails(event.bookId);
        });

        const detailedEvents = await Promise.all(detailedEventPromises);
        console.log("Detailed events fetched:", detailedEvents);

        setEvents(detailedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
        console.log("Event loading complete.");
      }
    }

    loadEvents();
  }, [timeRange]);

  useEffect(() => {
    async function fetchAndProcessEvents() {
      const today = new Date().toISOString().split('T')[0];
      const userShifts = getUserShiftsForToday(); // Replace with actual function to get user shifts
      const roomGroups = getUserRoomGroups(); // Replace with actual function to get user room groups

      let allEvents = [];

      for (const groupId of roomGroups) {
        const message = {
          type: 'fetchEventList',
          groupId,
          eventIds: [],
          startDate: today,
          endDate: today,
          daily: false,
        };

        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage(message, resolve);
        });

        if (response && response.data) {
          allEvents = allEvents.concat(response.data);
        }
      }

      // Filter events based on shift timings
      const filteredEvents = allEvents.filter(event => {
        return userShifts.some(shift => {
          const shiftStart = new Date(`${today}T${shift.start}`);
          const shiftEnd = new Date(`${today}T${shift.end}`);

          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);

          return (
            (eventStart >= shiftStart && eventStart <= shiftEnd) ||
            (eventEnd >= shiftStart && eventEnd <= shiftEnd) ||
            (eventStart <= shiftStart && eventEnd >= shiftEnd)
          );
        });
      });

      // Map events to rooms
      const eventsWithRooms = filteredEvents.map(event => {
        const room = rooms.find(r => r.item === event.item);
        return { ...event, room: room ? room.name : 'Unknown Room' };
      });

      // Fetch event details and enrich events
      const enrichedEvents = await Promise.all(eventsWithRooms.map(async event => {
        const detailResponse = await fetchEventDetails(event.bookId);
        const parsedFields = extractEventMetadata(detailResponse);

        return {
          ...event,
          rawHtml: detailResponse,
          parsedFields,
          derivedFlags: {
            isHybrid: parsedFields.isHybrid,
            hasMediaNotes: parsedFields.hasMediaNotes,
            hasInternalNotes: parsedFields.hasInternalNotes,
            isSJSU: parsedFields.isSJSU,
          },
        };
      }));

      setEvents(enrichedEvents);
    }

    fetchAndProcessEvents();
  }, []);

  if (loading) {
    console.log("Dashboard is loading...");
    return <div>Loading events...</div>;
  }

  console.log("Rendering dashboard with events:", events);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="event-tiles">
        {events.map((event, index) => (
          <div key={index} className="event-tile">
            <h3>{event.nickname || "Unnamed Event"}</h3>
            <p>Room: {event.room}</p>
            <p>Start: {event.start}</p>
            <p>End: {event.end}</p>
            <p>Category: {event.event_category || "N/A"}</p>
            {event.internal_notes && <p>Notes: {event.internal_notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

// Helper functions
function getUserShiftsForToday() {
  // Replace with logic to fetch user shifts for the current day
  return [
    { start: '08:00:00', end: '12:00:00' },
    { start: '13:00:00', end: '17:00:00' },
  ];
}

function getUserRoomGroups() {
  // Replace with logic to fetch user room groups
  return ['10165'];
}

async function fetchEventDetails(bookId) {
  const response = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'getBookingDetails', bookId }, resolve);
  });

  if (response.error) {
    console.error("Error fetching booking details:", response.error);
    throw new Error(response.error);
  }

  return response.html;
}
