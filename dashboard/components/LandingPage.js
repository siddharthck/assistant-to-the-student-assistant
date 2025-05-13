import React, { useState, useEffect } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "../../utils/storage";
import rooms from "../../rooms.json";

function LandingPage({ navigateToDashboard }) {
  const [userSettings, setUserSettings] = useState({
    name: "",
    email: "",
    description: "",
    shifts: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    preferred_spaces: [],
  });
  const [roomsOfConcern, setRoomsOfConcern] = useState([]);

  useEffect(() => {
    const savedSettings = getFromLocalStorage("user_settings");
    if (savedSettings) {
      setUserSettings(savedSettings);
      setRoomsOfConcern(savedSettings.preferred_spaces || []);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (roomId) => {
    setRoomsOfConcern((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSubmit = () => {
    const updatedSettings = { ...userSettings, preferred_spaces: roomsOfConcern };
    saveToLocalStorage("user_settings", updatedSettings);
    alert("Settings saved successfully!");
  };

  const handleDashboardNavigation = () => {
    const currentTime = new Date();
    const day = currentTime.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const shifts = userSettings.shifts[day] || [];
    const timeRange = shifts.length > 0 ? shifts[0] : "00:00-23:59";
    navigateToDashboard(timeRange);
  };

  return (
    <div>
      <h1>Landing Page</h1>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userSettings.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userSettings.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={userSettings.description}
            onChange={handleInputChange}
          />
        </label>

        <h3>Rooms of Concern</h3>
        {Object.entries(rooms || {}).map(([category, data]) => (
          <div key={category}>
            <h4>{category}</h4>
            {(data.rooms || []).map((room) => (
              <label key={room.id}>
                <input
                  type="checkbox"
                  checked={roomsOfConcern.includes(room.id)}
                  onChange={() => handleRoomChange(room.id)}
                />
                {room.name}
              </label>
            ))}
          </div>
        ))}

        <h3>Shifts</h3>
        {Object.keys(userSettings.shifts).map((day) => (
          <div key={day}>
            <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
            {(userSettings.shifts[day] || []).map((shift, index) => (
              <div key={index}>
                <label>
                  From:
                  <input
                    type="time"
                    value={shift.split("-")[0]}
                    onChange={(e) => {
                      const updatedShifts = { ...userSettings.shifts };
                      updatedShifts[day][index] = `${e.target.value}-${shift.split("-")[1]}`;
                      setUserSettings((prev) => ({ ...prev, shifts: updatedShifts }));
                    }}
                  />
                </label>
                <label>
                  To:
                  <input
                    type="time"
                    value={shift.split("-")[1]}
                    onChange={(e) => {
                      const updatedShifts = { ...userSettings.shifts };
                      updatedShifts[day][index] = `${shift.split("-")[0]}-${e.target.value}`;
                      setUserSettings((prev) => ({ ...prev, shifts: updatedShifts }));
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const updatedShifts = { ...userSettings.shifts };
                    updatedShifts[day].splice(index, 1);
                    setUserSettings((prev) => ({ ...prev, shifts: updatedShifts }));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const updatedShifts = { ...userSettings.shifts };
                if (!updatedShifts[day]) updatedShifts[day] = [];
                updatedShifts[day].push("00:00-00:00");
                setUserSettings((prev) => ({ ...prev, shifts: updatedShifts }));
              }}
            >
              Add Shift
            </button>
          </div>
        ))}

        <button type="button" onClick={handleSubmit}>
          Save Settings
        </button>
      </form>

      <button onClick={handleDashboardNavigation}>Take me to the Dashboard</button>
    </div>
  );
}

export default LandingPage;
