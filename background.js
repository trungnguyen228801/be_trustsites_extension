
// chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
//     const { action, data } = obj;
//     if (action == "reloadPopup") {
//         chrome.browserAction.closePopup();
//         setTimeout(() => {
//             chrome.browserAction.openPopup();
//         }, 2000)
//     }
// });