// Utility functions for scraping HTML content
export function parseEventDetails(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // Extract relevant details from the HTML document
  const eventDetails = {
    reservationStart: doc.querySelector("#reservation-start").textContent,
    reservationEnd: doc.querySelector("#reservation-end").textContent,
    eventStart: doc.querySelector("#event-start").textContent,
    eventEnd: doc.querySelector("#event-end").textContent,
    hybrid: doc.querySelector("#hybrid").textContent === "Yes",
    notes: doc.querySelector("#notes").textContent,
  };
  return eventDetails;
}
