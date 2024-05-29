import { sleep } from "bun";

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

export async function search(animeName: string) {
	console.log("[Info] Searching...");
	const res = await fetch(
		`https://api.jikan.moe/v4/anime?q=${animeName}&limit=10`,
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

export interface AnimeResult {
	data: {
		title: string;
	};
}

export async function getNameById(animeId: number): Promise<string> {
	try {
		console.log(`[Info] Searching for id ${animeId}...`);
		await sleep(800); // Rate limiting
		const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
		const json: AnimeResult = await res.json();
		return json.data.title;
	} catch {
		console.log(`[Error] No MAL entry for id ${animeId}`);
		return "N/A";
	}
}
