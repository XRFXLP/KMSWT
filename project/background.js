chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("", message);
    // Forward message to popup script
    chrome.extension.getViews({ type: "popup" }).forEach(function(view) {
      view.postMessage(message, "*");
      console.log("", message);
    });

    if (message.action === 'openPopup') {
        chrome.browserAction.openPopup();
      }
  });
  
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    console.log("button clicked!");
  
    // Send a message to the tab that is open when button was clicked
    chrome.tabs.sendMessage(tab.id, {"message": "browser action"});
});
