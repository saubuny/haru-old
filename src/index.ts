import { parseArgs } from "util";
// import { exit } from "process";

const { values } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		search: {
			type: "string",
		},
	},
});

interface SearchData {
	mal_id: number;
	title: string;
	title_japanese: string;
	score: number;
	episodes: number;
	year: number;
	aired: {
		string: string;
	};
}

interface SearchResult {
	data: SearchData[];
}

if (values.search) {
	console.log("[Info] Searching...");
	const res = await fetch(
		`https://api.jikan.moe/v4/anime?q=${values.search}&limit=10`,
	);
	const json: SearchResult = await res.json();
	for (let anime of json.data) {
		console.log(`${anime.title} | ${anime.title_japanese}`);
		console.log(`MAL ID: ${anime.mal_id}`);
		console.log(`${anime.year ?? anime.aired.string}`);
		console.log(`Episodes: ${anime.episodes}`);
		console.log(`MAL Score: ${anime.score}`);
		console.log("");
	}
}

