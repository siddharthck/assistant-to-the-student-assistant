// Popup script for Assistant to the Assistant
document.getElementById("open-dashboard").addEventListener("click", () => {
  chrome.tabs.create({ url: "dashboard/index.html" });
});

document.getElementById("fetch-events").addEventListener("click", () => {
  const message = {
    type: 'fetchEventList',
    groupId: '10165', // Replace with actual groupId
    eventIds: [], // Replace with actual event IDs if needed
    startDate: '2025-05-13', // Replace with actual start date
    endDate: '2025-05-14', // Replace with actual end date
    daily: false, // Replace with actual value
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      console.log('Response from content script:', response);
    });
  });
});
