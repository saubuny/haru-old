import { readFileSync, writeFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";
import { getNameById } from "./search";
import type { HiAnimeFormat, EntryData, MalFormat, MalAnime } from "./types";
import { Completion, Options } from "./types";
import { getList, merge } from "./list";

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
			start_date: anime.my_start_date ?? "0000-00-00",
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

		// HTTP req for each title is crazy
		newEntries.push({
			name: await getNameById(anime.series_animedb_id),
			mal_id: anime.series_animedb_id,
			start_date: anime.my_start_date ?? "0000-00-00",
			completion: malStatus,
		});
	}
	return newEntries;
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
			start_date: "0000-00-00", // :(
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

export async function importFile(file: string, cmd: Options, path: string) {
	console.log("[Info] Merging to List");
	let entries: EntryData[] = [];

	if (cmd == Options.ImportMal) entries = parseMal(file);
	if (cmd == Options.ImportKitsu) entries = await parseKitsu(file);
	if (cmd == Options.ImportHianime) entries = parseHianime(file);
	if (cmd == Options.ImportHaru) entries = getList(file);

	const list = getList(path);
	const newEntries = merge(list, entries);
	writeFileSync(path, JSON.stringify(newEntries, null, 2));
	console.log("[Info] Complete");
}
