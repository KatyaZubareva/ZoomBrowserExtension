chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL("hello.html");
    let tab = await chrome.tabs.create({ url });
});

function updateZoom(tabId, delta) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => document.body.style.zoom,
    }, (results) => {
      let currentZoom = parseFloat(results[0].result) || 1;
      let newZoom = currentZoom + delta;
      if (newZoom > 10) newZoom = 10; // максимальный масштаб 1000%
      if (newZoom < 0.01) newZoom = 0.01; // минимальный масштаб 1%
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (zoom) => { document.body.style.zoom = zoom; },
        args: [newZoom]
      });
    });
  }
  
  chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
        if (command === "zoom-in") {
          updateZoom(tabs[0].id, 0.1);
        } else if (command === "zoom-out") {
          updateZoom(tabs[0].id, -0.1);
        }
      }
    });
  });
  