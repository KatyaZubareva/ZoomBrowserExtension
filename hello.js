document.getElementById('okButton').addEventListener('click', () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
});
  