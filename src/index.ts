import { search } from "./search";
import { importFile } from "./parse";
import { exit } from "process";
import { addNewAnime } from "./list";
import { Options } from "./types";
import { readConfigFile } from "./config";

// === TODO ===
// * Add to own list by ID
// * Modify data on list
// * Pretty colored output
// * Save to remote database

// Index errors apparently don't exist ??
const cmdStr = Bun.argv[2];
const arg1 = Bun.argv[3];
// const arg2 = Bun.argv[4];
let cmd: Options;

const config = readConfigFile()!;

switch (cmdStr) {
	case "--help":
	case "--h":
		console.log("Haru: An Anime Tracker");
		console.log("Usage:");
		console.log("\t--help -> The message you're seeing right now");
		console.log("\t--search [title] -> Search MAL by title");
		console.log("\t--add [id] -> Add ID to list");
		console.log("\t--remove [id] -> Remove ID from list");
		console.log("\t--modifyCompletion [id] [completion] -> Add ID to list");
		console.log("\t--modifyStart [id] [date] -> Add ID to list");
		console.log("\t--importMal [file] -> Import your MAL data in xml format");
		console.log(
			"\t--importKitsu [file] -> Import your Kitsu data in xml format",
		);
		console.log(
			"\t--importHianime [file] -> Import your Hianime data in json format",
		);
		exit(0);
	case "--search":
	case "--s":
		cmd = Options.Search;
		break;
	case "--importMal":
	case "--iMal":
		cmd = Options.ImportMal;
		break;
	case "--importKitsu":
	case "--iKitsu":
		cmd = Options.ImportKitsu;
		break;
	case "--importHianime":
	case "--iHianime":
		cmd = Options.ImportHianime;
		break;
	case "--add":
	case "--a":
		cmd = Options.Add;
		break;
	case "--remove":
	case "--r":
		cmd = Options.Remove;
		break;
	case "--modifyCompletion":
	case "--modComp":
		cmd = Options.ModifyCompletion;
		break;
	case "--modifyStart":
	case "--modStart":
		cmd = Options.ModifyStart;
		break;
	default:
		console.error(`[Error] Invalid command given: ${cmdStr}`);
		console.error("Try running the --help command");
		exit(1);
}

switch (cmd) {
	case Options.Search:
		await search(arg1);
		break;
	case Options.Add:
		await addNewAnime(parseInt(arg1), config.list_location);
		break;
	case Options.Remove:
		break;
	case Options.ModifyCompletion:
		break;
	case Options.ModifyStart:
		break;
	case Options.ImportMal:
	case Options.ImportKitsu:
	case Options.ImportHianime:
		if (!arg1) {
			console.error("[Error] No file given");
			exit(1);
		}
		await importFile(arg1, cmd, config.list_location);
		break;
}
