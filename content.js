// Content script for Assistant to the Assistant
console.log("Assistant to the Assistant content script loaded.");

async function getBookingDetails(bookId) {
  const url = `https://booking.sjlibrary.org/admin/equipment/ajax/viewbooking/panel?bookId=${bookId}&groupType=2&from=calendar`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  const html = await res.text();
  return html;
}

// Example of posting the result to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getBookingDetails') {
    getBookingDetails(message.bookId).then(html => {
      sendResponse({ html });
    });
    return true; // Indicates async response
  }
});

async function fetchEventList(groupId, eventIds = [], startDate, endDate, daily = false) {
  const formData = new URLSearchParams();
  formData.append("lid", groupId);
//   formData.append("eids[]", "-1");
  formData.append("start", startDate);
  formData.append("end", endDate);
  formData.append("daily", daily.toString());

  console.log("Sending fetchEventList request with:", {
    groupId,
    eventIds,
    startDate,
    endDate,
    daily
  });

  const response = await fetch(`https://booking.sjlibrary.org/admin/spaces/confirmed/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: 'include',
  });

  console.log("Response from fetchEventList:", response);

  const data = await response.json();
  console.log("Parsed data from fetchEventList:", data);

  return data;
}

// Example of posting the result to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in content script:", message);

  if (message.type === 'fetchEventList') {
    const { groupId, eventIds, startDate, endDate, daily } = message;
    console.log("Calling fetchEventList with:", { groupId, eventIds, startDate, endDate, daily });

    fetchEventList(groupId, eventIds, startDate, endDate, daily).then(data => {
      console.log("Sending response back to popup:", data);
      sendResponse({ data });
    }).catch(error => {
      console.error("Error in fetchEventList:", error);
      sendResponse({ error: error.message });
    });

    return true; // Indicates async response
  }
});
