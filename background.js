// Shigang — toolbar icon handler. No popup is declared, so clicking the icon
// fires action.onClicked and the content script on that ChatGPT tab toggles
// the outline. tabs.sendMessage and tabs.create need no extra permission.
const CHATGPT_ORIGINS = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//;

chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'shigang:toggle' });
  } catch (_) {
    // tab.url is only exposed for hosts we have permission for; it is
    // undefined on other sites, which is exactly the case we care about.
    if (CHATGPT_ORIGINS.test(tab.url || '')) {
      // A ChatGPT page opened before install/update has no content script yet.
      // Do nothing destructive: the user refreshes when convenient.
      return;
    }
    chrome.tabs.create({ url: 'https://chatgpt.com/' });
  }
});
