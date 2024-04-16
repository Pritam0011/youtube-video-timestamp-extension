import toast, { Toaster } from "react-hot-toast";
import sad from "./assets/images/sad.png";
import Newbookmark from "./components/Newbookmark/Newbookmark";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { render } from "@react-email/render";
import { Emailtemp } from "./templates/Emailtemp.jsx";
import axios from "axios";

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
const displayBookmarks = (bookmarks = [], activeTab) => {
	const bookMarkEle = document.getElementsByClassName("bookmarks")[0];
	const shareButton = document.getElementById("share-button");
	bookMarkEle.innerHTML = "";
	if (bookmarks.length > 0) {
		shareButton.disabled = false;
		const qparams = activeTab.url.split("?")[1];
		const urlParams = new URLSearchParams(qparams);
		const currentVideoId = urlParams.get("v");
		bookmarks.forEach((bookmark) => {
			const d = document.createElement("div");
			d.id = Number(bookmark.time);
			d.setAttribute("currentVideoId", currentVideoId);
			bookMarkEle.appendChild(d);
			const domNode = document.getElementById(d.id);
			const root = createRoot(domNode);
			root.render(<Newbookmark param={bookmark} />);
		});
	} else {
		if (shareButton.classList.contains("hidden")) {
			shareButton.nextElementSibling.classList.add("hidden");
			shareButton.classList.remove("hidden");
		}
		shareButton.disabled = true;
		bookMarkEle.innerHTML = `<div style="margin-bottom: 0.6rem"><i>No bookmarks found for this video.</i></div>`;
	}
};

const changes = () => {
	getCurrentTab().then((activeTab) => {
		const qparams = activeTab.url.split("?")[1];
		const urlParams = new URLSearchParams(qparams);
		const currentVideoId = urlParams.get("v");
		if (activeTab.url.includes("youtube.com/watch") && currentVideoId) {
			chrome.storage.sync.get([currentVideoId], (obj) => {
				const bookmarks = obj[currentVideoId]
					? JSON.parse(obj[currentVideoId])
					: [];
				displayBookmarks(bookmarks, activeTab);
			});
		}
	});
};
function App() {
	const [isYt, setIsYt] = useState(false);

	getCurrentTab().then((activeTab) => {
		const qparams = activeTab.url.split("?")[1];
		const urlParams = new URLSearchParams(qparams);
		const currentVideoId = urlParams.get("v");
		if (activeTab.url.includes("youtube.com/watch") && currentVideoId) {
			setIsYt(true);
		} else {
			setIsYt(false);
		}
	});
	changes();

	const share = (e) => {
		e.target.classList.add("hidden");
		e.target.nextElementSibling.classList.remove("hidden");
	};

	const emailsubmit = (e) => {
		e.preventDefault();
		let arr = [];
		let bookmarkEle = document.getElementsByClassName("bookmarks")[0];
		let n = bookmarkEle.childElementCount;
		for (let i = 0; i < n; i++) {
			arr.push(bookmarkEle.childNodes[i].id);
		}
		let oneEle = bookmarkEle.childNodes[0];
		let currentVideoId = oneEle.getAttribute("currentVideoId");
		let email = document.getElementById("email-address-icon");
		let param = { arr, currentVideoId };
		if (email && email.value) {
			const emailHtml = render(<Emailtemp param={param} />, {
				pretty: true,
			});
			toast.promise(
				axios({
					method: "post",
					url: import.meta.env.VITE_BACK_URL,
					data: {
						to: email.value,
						emailHtml: emailHtml,
					},
				}),
				{
					loading: "Sending Email...",
					success: (data) =>
						data.status === 200 ? "Email Send Successfully." : data.data.msg,
					error: (err) =>
						err.response.status === 400
							? err.response.data.msg
							: "Email not sent. Please try again later.",
				},
				{
					style: {
						fontWeight: "normal",
						fontSize: "12px",
						fontFamily: "monospace",
						userSelect: "none",
					},
				}
			);
		}
		email.value = "";
	};

	return (
		<>
			<div id="con" className="con">
				{isYt ? (
					<>
						<Toaster position="top-center" />
						<div>
							<h2 className="title flex items-center text-xl font-extrabold mb-4 dark:text-white">
								Video Bookmarks
								<span className="bg-red-600 text-white text-xs font-semibold me-2 px-1.5 py-0.5 rounded dark:bg-red-600 dark:text-white ms-2">
									YOUTUBE
								</span>
							</h2>
							<div className="bookmarks"></div>
							<button
								onClick={share}
								id="share-button"
								className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-600 to-purple-600 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 opacity-85 hover:opacity-100 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 pointer-events-none font-normal text-xs">
									Share
								</span>
							</button>
							<div className="mt-5 hidden">
								<form className="max-w-sm mx-auto" onSubmit={emailsubmit}>
									<div className="relative">
										<div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
											<svg
												className="w-4 h-4 text-gray-500 dark:text-gray-400"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="currentColor"
												viewBox="0 0 20 16"
											>
												<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
												<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
											</svg>
										</div>
										<input
											type="email"
											id="email-address-icon"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="abc@gmail.com"
										/>
									</div>
								</form>
							</div>
						</div>
					</>
				) : (
					<>
						<h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
							Not a{" "}
							<span className="text-blue-600 dark:text-blue-500">
								Youtube Video
							</span>{" "}
							Page
						</h1>
						<img
							src={sad}
							alt="Not a Youtube Video"
							className="mx-auto mb-4"
							width="50px"
						/>
					</>
				)}
			</div>
		</>
	);
}

export default App;

export const onPlay = (e) => {
	const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
	getCurrentTab().then((activeTab) => {
		chrome.tabs.sendMessage(activeTab.id, {
			type: "PLAY",
			value: bookmarkTime,
		});
	});
	toast.success("Playing the bookmarked timestamp", {
		style: {
			color: "green",
			fontWeight: "normal",
			fontSize: "12px",
			fontFamily: "monospace",
			userSelect: "none",
		},
	});
};
export const onDelete = (e) => {
	const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
	getCurrentTab().then((activeTab) => {
		chrome.tabs.sendMessage(
			activeTab.id,
			{
				type: "DELETE",
				value: bookmarkTime,
			},
			(res) => {
				displayBookmarks(res, activeTab);
			}
		);
	});
	toast.success("Timestamp Deleted.", {
		style: {
			color: "red",
			fontWeight: "normal",
			fontSize: "12px",
			fontFamily: "monospace",
			userSelect: "none",
		},
	});
};
