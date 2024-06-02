import { expect, test } from "bun:test";
import { merge } from "./list";
import type { EntryData } from "./types";

test("merge overwrite", () => {
	const oldData: EntryData[] = [
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2020-11-09",
			completion: 1,
		},
	];
	const newData: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2022-11-09",
			completion: 0,
		},
		{
			name: "Soul Eater",
			mal_id: 3588,
			start_date: "2021-01-21",
			completion: 2,
		},
	];
	const result: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2022-11-09",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Soul Eater",
			mal_id: 3588,
			start_date: "2021-01-21",
			completion: 2,
		},
	];
	expect(merge(oldData, newData)).toEqual(result);
});

test("merge no overwrite", () => {
	const oldData: EntryData[] = [
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2024-11-09",
			completion: 1,
		},
	];
	const newData: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2022-11-09",
			completion: 0,
		},
		{
			name: "Soul Eater",
			mal_id: 3588,
			start_date: "2021-01-21",
			completion: 2,
		},
	];
	const result: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2024-11-09",
			completion: 1,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Soul Eater",
			mal_id: 3588,
			start_date: "2021-01-21",
			completion: 2,
		},
	];
	expect(merge(oldData, newData)).toEqual(result);
});

test("merge by completion", () => {
	const oldData: EntryData[] = [
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2020-11-09",
			completion: 1,
		},
	];
	const newData: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "0000-00-00",
			completion: 0,
		},
	];
	const result: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "0000-00-00",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
	];
	expect(merge(oldData, newData)).toEqual(result);
});

test("merge identical", () => {
	const oldData: EntryData[] = [
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2020-11-09",
			completion: 1,
		},
	];
	const newData: EntryData[] = [
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2020-11-09",
			completion: 1,
		},
	];
	const result: EntryData[] = [
		{
			name: "Tokyo Mew Mew",
			mal_id: 687,
			start_date: "2020-11-09",
			completion: 1,
		},
		{
			name: "Gintama",
			mal_id: 918,
			start_date: "2021-10-29",
			completion: 0,
		},
		{
			name: "Death Note",
			mal_id: 1535,
			start_date: "2020-02-05",
			completion: 0,
		},
	];
	expect(merge(oldData, newData)).toEqual(result);
});
