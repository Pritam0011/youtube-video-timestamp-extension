import {
	Body,
	Column,
	Container,
	Head,
	Html,
	Link,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

export function Emailtemp({ param }) {
	const { arr, currentVideoId } = param;

	console.log(arr, currentVideoId);
	const getTime = (time) => {
		let date = new Date(0);
		date.setSeconds(Number(time));
		return date.toISOString().substr(11, 8);
	};

	return (
		<Tailwind>
			<Html>
				<Head />
				<Body className="flex items-center bg-white">
					<Container className="mt-10">
						<Section>
							<Row>
								<Column>
									<Text className="text-base">
										Youtube Video Timestamp Extension
									</Text>
								</Column>
							</Row>
						</Section>
						<Text className="text-blue-700 text-4xl font-normal my-8 mx-0 p-0 leading-10 font-serif">
							Youtube Video Bookmarks
						</Text>

						<Container>
							<Row>
								<Text className="text-lg ">Bookmarks -</Text>
							</Row>

							{arr.map((item) => (
								<Link
									key={item}
									href={`https://youtu.be/${currentVideoId}?t=${Number(
										item
									).toFixed(0)}`}
								>
									<button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
										<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
											Bookmark at {getTime(Number(item))}
										</span>
									</button>
								</Link>
							))}
						</Container>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}

export default Emailtemp;
