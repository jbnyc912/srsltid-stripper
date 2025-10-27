async function isEnabled() {
  const result = await chrome.storage.sync.get(['enabled']);
  return result.enabled !== false;
}

function cleanUrl(url) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('srsltid');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

async function cleanAllLinks() {
  if (!await isEnabled()) return;
  document.querySelectorAll('a[href*="srsltid="]').forEach(link => {
    link.href = cleanUrl(link.href);
  });
}

cleanAllLinks();

const observer = new MutationObserver(async () => {
  if (await isEnabled()) {
    cleanAllLinks();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

document.addEventListener('copy', async (e) => {
  if (!await isEnabled()) return;
  const selection = window.getSelection().toString();
  if (selection.includes('srsltid=')) {
    e.clipboardData.setData('text/plain', cleanUrl(selection));
    e.preventDefault();
  }
});

document.addEventListener('contextmenu', async (e) => {
  if (!await isEnabled()) return;
  if (e.target.tagName === 'A' && e.target.href && e.target.href.includes('srsltid=')) {
    const cleaned = cleanUrl(e.target.href);
    e.target.setAttribute('data-original-href', e.target.href);
    e.target.href = cleaned;
    setTimeout(() => {
      const original = e.target.getAttribute('data-original-href');
      if (original) e.target.href = original;
    }, 200);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled && changes.enabled.newValue) {
    cleanAllLinks();
  }
});