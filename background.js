let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.action.onClicked.addListener((tab) => {
  console.log(tab);
  
  if(!tab.url.includes("chrome://")) {
    console.log('been clicked!');
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: init
    });
  }
});