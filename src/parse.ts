import { readFileSync, writeFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";
import { getNameById } from "./search";
import { Options } from ".";

enum Completion {
	Completed,
	Watching,
	Dropped,
	PlanToWatch,
	OnHold,
}

// All other data fetched by API requests by id
interface EntryData {
	name: string;
	mal_id: number;
	completion: Completion;
	start_date: string;
}

interface MalAnime {
	series_animedb_id: number;
	series_title: string;
	my_start_date: string;
	my_status: string;
}

interface MalFormat {
	myanimelist: {
		anime: MalAnime[];
	};
}

function parseMal(file: string): EntryData[] {
	console.log("[Info] Parsing XML");
	const contents = readFileSync(file);
	const json: MalFormat = new XMLParser().parse(contents);
	const animeList: MalAnime[] = json.myanimelist.anime;
	const newEntries: EntryData[] = [];
	for (let anime of animeList) {
		let malStatus = Completion.PlanToWatch;

		switch (anime.my_status) {
			case "Completed":
				malStatus = Completion.Completed;
				break;
			case "Plan To Watch":
				malStatus = Completion.PlanToWatch;
				break;
			case "On-Hold":
				malStatus = Completion.OnHold;
				break;
			case "Dropped":
				malStatus = Completion.Dropped;
				break;
			case "Watching":
				malStatus = Completion.Watching;
				break;
		}

		newEntries.push({
			name: anime.series_title,
			mal_id: anime.series_animedb_id,
			start_date: anime.my_start_date,
			completion: malStatus,
		});
	}
	return newEntries;
}

// Kitsu format is identical to MAL but w/ no name, so we have to fetch it manually
async function parseKitsu(file: string): Promise<EntryData[]> {
	console.log("[Info] Parsing XML");
	const contents = readFileSync(file);
	const json: MalFormat = new XMLParser().parse(contents);
	const animeList: MalAnime[] = json.myanimelist.anime;
	const newEntries: EntryData[] = [];
	for (let anime of animeList) {
		let malStatus = Completion.PlanToWatch;

		// Tiny tiny discrepancies in the formatting of labels >:(
		switch (anime.my_status) {
			case "Completed":
				malStatus = Completion.Completed;
				break;
			case "Plan to Watch":
				malStatus = Completion.PlanToWatch;
				break;
			case "On Hold":
				malStatus = Completion.OnHold;
				break;
			case "Dropped":
				malStatus = Completion.Dropped;
				break;
			case "Watching":
				malStatus = Completion.Watching;
				break;
		}

		// We r really gonna have to make a network request for each title... wow...
		// Now i have to color all my functions >:(
		newEntries.push({
			name: await getNameById(anime.series_animedb_id),
			mal_id: anime.series_animedb_id,
			start_date: anime.my_start_date,
			completion: malStatus,
		});
	}
	return newEntries;
}

interface HiAnimeData {
	link: string;
	name: string;
}

interface HiAnimeFormat {
	[key: string]: HiAnimeData[];
}

function newEntriesFromCompletionType(
	json: HiAnimeFormat,
	completion: Completion,
): EntryData[] {
	const newEntries: EntryData[] = [];

	let compStr = "";
	switch (completion) {
		case Completion.OnHold:
			compStr = "On-Hold";
			break;
		case Completion.Completed:
			compStr = "Completed";
			break;
		case Completion.Watching:
			compStr = "Watching";
			break;
		case Completion.PlanToWatch:
			compStr = "Plan to watch";
			break;
		case Completion.Dropped:
			compStr = "Dropped";
			break;
	}

	for (let anime of json[compStr]) {
		newEntries.push({
			name: anime.name,
			mal_id: parseInt(anime.link.split("https://myanimelist.net/anime/")[1]),
			start_date: "N/A", // :(
			completion: completion,
		});
	}
	return newEntries;
}

// This one is a wittle different
function parseHianime(file: string): EntryData[] {
	console.log("[Info] Parsing JSON");
	const contents = readFileSync(file).toString();
	const json: HiAnimeFormat = JSON.parse(contents);
	let newEntries: EntryData[] = [];

	// TS Enums r weird
	const keys = Object.keys(Completion).filter((v) => isNaN(Number(v)));
	keys.forEach((_, index) => {
		newEntries = [...newEntries, ...newEntriesFromCompletionType(json, index)];
	});

	return newEntries;
}

export async function importFile(file: string, cmd: Options) {
	console.log("[Info] Writing to JSON");
	let entries: EntryData[] = [];
	if (cmd == Options.ImportMal) entries = parseMal(file);
	else if (cmd == Options.ImportKitsu) entries = await parseKitsu(file);
	else if (cmd == Options.ImportHianime) entries = parseHianime(file);
	writeFileSync("anime.json", JSON.stringify(entries, null, 2));
	console.log("[Info] Complete");
}
