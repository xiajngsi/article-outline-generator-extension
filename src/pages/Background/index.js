console.log('This is the background page.');
console.log('Put the background scripts here.');
let domains = [
    'https://developer.chrome.com/docs/*',
    'https://github.com/*/*'
];
// let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// const list = await chrome.storage.sync.get("domains")
// console.log(`Current domain white list is ${list}`,tab);

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ domains });
//   console.log(`Default domain white list set to ${domains}`);
// });

// chrome.action.onClicked.addListener((tab) => {
// console.log('action clicked',tab);
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['../Content/index.js']
//   });
// });