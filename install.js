/* Opens the options page in a new tab. */
function openOptions() {
  chrome.tabs.create({url: '/options/options.html'});
}

/* Creates and displays a notification with title notifTitle. */
function showNotification(notifTitle) {
  chrome.notifications.create(
    'retwit-installed', {
        type: 'basic',
        title: notifTitle,
        message: 'Click here to open ReTwit options.',
        iconUrl: '/img/iconnotif.png',
        isClickable: true
      },
      function(notificationId) { return notificationId }
  );

  chrome.notifications.onClicked.addListener(openOptions);
}

/* Checks for new install vs update. */
var currVersion = chrome.app.getDetails().version;
var prevVersion = localStorage['version'];

if (currVersion != prevVersion) {
  if (typeof prevVersion == 'undefined') {
    showNotification('ReTwit has been installed!');
  } else {
    showNotification('ReTwit is up to date!');
  }
  localStorage['version'] = currVersion;
}

/* Page action to open ReTwit options */
function checkForValidUrl(tabId, changeInfo, tab) {
	if (changeInfo.status === 'loading')
		if (tab.url.indexOf('twitter.com') > -1)
			chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(openOptions);
