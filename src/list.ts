import { getNameById } from "./search";
import { writeFileSync } from "fs";
import { type EntryData, Completion } from "./types";

export async function addNewAnime(id: number, path: string) {
	const name = await getNameById(id);
	const newEntry: EntryData = {
		name,
		mal_id: id,
		completion: Completion.PlanToWatch,
		start_date: new Date().toISOString().split("T")[0],
	};

	writeFileSync(path, JSON.stringify(newEntry));
}

function compareDates(anime1: EntryData, anime2: EntryData): boolean {
	if (anime1.start_date === "0000-00-00" || anime2.start_date === "0000-00-00")
		return anime1.completion < anime2.completion;

	const d1 = new Date(anime1.start_date);
	const d2 = new Date(anime2.start_date);
	return d1 > d2;
}

export function merge(
	oldEntries: EntryData[],
	newEntries: EntryData[],
): EntryData[] {
	let combinedEntries: EntryData[] = [...oldEntries, ...newEntries];

	for (let i = 0; i < combinedEntries.length; i++) {
		for (let j = 0; j < combinedEntries.length; j++) {
			if (
				combinedEntries[i].mal_id === combinedEntries[j].mal_id &&
				compareDates(combinedEntries[i], combinedEntries[j])
			) {
				combinedEntries.splice(j, 1);
			}
		}
	}

	return combinedEntries.toSorted((a, b) => a.mal_id - b.mal_id);
}
