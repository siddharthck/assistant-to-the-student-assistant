// Background script for Assistant to the Assistant
chrome.runtime.onInstalled.addListener(() => {
  console.log("Assistant to the Assistant installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getBookingDetails') {
    // Find the active tab where the content script is running
    chrome.tabs.query({ url: "https://booking.sjlibrary.org/*" }, (tabs) => {
      if (tabs.length > 0) {
        // Forward the message to the content script
        chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
      } else {
        sendResponse({ error: "No active tab with the required URL found." });
      }
    });

    // Return true to indicate async response
    return true;
  }

  if (message.type === 'fetchEventList') {
    // Find the active tab where the content script is running
    chrome.tabs.query({ url: "https://booking.sjlibrary.org/*" }, (tabs) => {
      if (tabs.length > 0) {
        // Forward the message to the content script
        chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
      } else {
        sendResponse({ error: "No active tab with the required URL found." });
      }
    });

    // Return true to indicate async response
    return true;
  }
});
