import React from "react";
import deletei from "../../assets/images/delete.png";
import { onDelete, onPlay } from "../../App";

const Newbookmark = ({ param }) => {
	return (
		<div
			className="bookmark-time relative group"
			id={`Bookmark-${param.time}`}
			timestamp={param.time}
		>
			<div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

			<button className="relative px-7 py-2  bg-black rounded-lg leading-none flex items-center w-full divide-x divide-gray-600 justify-between">
				<div className="bookmark-title py-1 px-3" onClick={onPlay} title="play">
					{param.desc}
				</div>
				<div
					className="flex items-center justify-between"
					title="delete"
					onClick={onDelete}
				>
					<div className="px-3"></div>
					<img
						src={chrome.runtime.getURL(deletei)}
						alt="delete"
						title="delete"
						width={20}
						className="mr-3 pointer-events-none"
					/>
				</div>
			</button>
		</div>
	);
};

export default Newbookmark;
