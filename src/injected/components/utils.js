export const getTime = (time) => {
	let date = new Date(0);
	date.setSeconds(time);
	return date.toISOString().substr(11, 8);
};

export const fetchBookmarks = (currentVideoId) => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get([currentVideoId], (obj) => {
			const bookmarks = obj[currentVideoId]
				? JSON.parse(obj[currentVideoId])
				: [];
			resolve(bookmarks);
		});
	});
};
