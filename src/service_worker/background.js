chrome.tabs.onUpdated.addListener((tabId, tab) => {
	if (tab.url && tab.url.includes("youtube.com/watch")) {
		const qpara = tab.url.split("?")[1];
		const urlparams = new URLSearchParams(qpara);

		chrome.tabs.sendMessage(tabId, {
			type: "NEW",
			videoId: urlparams.get("v"),
		});
	}
});
