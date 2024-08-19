const zoomLevelDisplay = document.getElementById('zoomLevel');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');
const resetButton = document.getElementById('reset');

function updateZoomDisplay(zoomFactor) {
  const zoomPercent = Math.round(zoomFactor * 100);
  zoomLevelDisplay.textContent = `${zoomPercent}%`;
}

function getCurrentTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0]);
  });
}

function setZoom(zoomFactor) {
  getCurrentTab((tab) => {
    if (!tab.url.startsWith('chrome://')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (zoom) => { document.body.style.zoom = zoom; },
        args: [zoomFactor]
      });
      updateZoomDisplay(zoomFactor);
    }
  });
}

function changeZoom(delta) {
  getCurrentTab((tab) => {
    if (!tab.url.startsWith('chrome://')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.style.zoom,
      }, (results) => {
        let currentZoom = parseFloat(results[0].result) || 1;
        let newZoom = currentZoom + delta;
        if (newZoom > 10) newZoom = 10; // максимальный масштаб 1000%
        if (newZoom < 0.01) newZoom = 0.01; // минимальный масштаб 1%
        setZoom(newZoom);
      });
    }
  });
}

zoomInButton.addEventListener('click', () => changeZoom(0.1));
zoomOutButton.addEventListener('click', () => changeZoom(-0.1));
resetButton.addEventListener('click', () => setZoom(1));

getCurrentTab((tab) => {
  if (!tab.url.startsWith('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.style.zoom,
    }, (results) => {
      let currentZoom = parseFloat(results[0].result) || 1;
      updateZoomDisplay(currentZoom);
    });
  } else {
    updateZoomDisplay(1);
  }
});
