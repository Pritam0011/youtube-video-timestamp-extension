import React from "react";
import pin from "../../assets/images/pin.png";
import { fetchBookmarks, getTime } from "./utils";
import "./content.css";

const ContentSlice = () => {
	let ylControl,
		yPlayer,
		currentVideoId = "",
		currentVideoBookmarks = [];

	async function bookmarkCurrentTime() {
		yPlayer = document.getElementsByClassName("video-stream")[0];
		const cTime = yPlayer.currentTime;

		const bookmark = {
			time: cTime,
			desc: "Bookmark at " + getTime(cTime),
		};
		currentVideoBookmarks = await fetchBookmarks(currentVideoId);
		if (currentVideoBookmarks.some((b) => b.time === bookmark.time)) return;
		chrome.storage.sync.set({
			[currentVideoId]: JSON.stringify(
				[...currentVideoBookmarks, bookmark].sort((a, b) => a.time - b.time)
			),
		});
		currentVideoBookmarks = [...currentVideoBookmarks, bookmark].sort(
			(a, b) => a.time - b.time
		);
	}

	const newVideoLoaded = async () => {
		const bookmarkBtnE = document.getElementsByClassName("bookmark-btn")[0];
		currentVideoBookmarks = await fetchBookmarks(currentVideoId);

		if (!bookmarkBtnE) {
			const bookmarkBtn = document.createElement("img");
			bookmarkBtn.src = chrome.runtime.getURL(pin);
			bookmarkBtn.className = "bookmark-btn ";
			bookmarkBtn.title = "Click to Bookmark the timestamp";
			bookmarkBtn.style.cursor = "pointer";

			ylControl = document.getElementsByClassName("ytp-left-controls")[0];
			yPlayer = document.getElementsByClassName("video-stream")[0];

			ylControl.appendChild(bookmarkBtn);
			bookmarkBtn.addEventListener("click", (e) => {
				e.target.classList.add("element");
				setTimeout(() => {
					e.target.classList.remove("element");
				}, 1000);
				bookmarkCurrentTime();
			});
		}
	};
	newVideoLoaded();

	chrome.runtime.onMessage.addListener((msgobj, sender, response) => {
		const { type, value, videoId } = msgobj;

		if (type === "NEW") {
			currentVideoId = videoId;
			newVideoLoaded();
		} else if (type === "PLAY") {
			yPlayer.currentTime = value;
		} else if (type === "DELETE" && value) {
			currentVideoBookmarks = currentVideoBookmarks.filter((b) => {
				return b.time != value;
			});
			chrome.storage.sync.set({
				[currentVideoId]: JSON.stringify(currentVideoBookmarks),
			});
			response(currentVideoBookmarks);
		}
	});

	return <></>;
};

export default ContentSlice;
