chrome.storage.sync.get(['enabled'], (result) => {
  const enabled = result.enabled !== false;
  document.getElementById('enableToggle').checked = enabled;
  updateStatus(enabled);
});

document.getElementById('enableToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.sync.set({ enabled: enabled }, () => {
    updateStatus(enabled);
  });
});

function updateStatus(enabled) {
  const statusDiv = document.getElementById('status');
  if (enabled) {
    statusDiv.textContent = '✓ Stripping is ON';
    statusDiv.className = 'status enabled';
  } else {
    statusDiv.textContent = '✗ Stripping is OFF';
    statusDiv.className = 'status disabled';
  }
}