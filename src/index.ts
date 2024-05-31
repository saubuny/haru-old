import { search } from "./search";
import { importFile } from "./parse";
import { exit } from "process";
import { addNewAnime } from "./list";
import { Options } from "./types";

// === TODO ===
// * Add to own list by ID
// * Modify data on list
// * Merge imported data into lost
// * Save to remote database

// Index errors apparently don't exist ??
const cmdStr = Bun.argv[2];
const arg1 = Bun.argv[3];
// const arg2 = Bun.argv[4];
let cmd: Options;

switch (cmdStr) {
	case "--help":
		console.log("Tsracker: An Anime Tracker");
		console.log("Usage:");
		console.log("\t--help -> The message you're seeing right now");
		console.log("\t--search [title] -> Search MAL by title");
		console.log("\t--add [id] -> Add ID to list");
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
		cmd = Options.Search;
		break;
	case "--importMal":
		cmd = Options.ImportMal;
		break;
	case "--importKitsu":
		cmd = Options.ImportKitsu;
		break;
	case "--importHianime":
		cmd = Options.ImportHianime;
		break;
	case "--add":
		cmd = Options.Add;
		break;
	case "--modifyCompletion":
		cmd = Options.ModifyCompletion;
		break;
	case "--modifyStart":
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
		await addNewAnime(parseInt(arg1));
		break;
	case Options.ModifyCompletion:
		break;
	case Options.ModifyStart:
		break;
	default:
		if (!arg1) {
			console.error("[Error] No file given");
			exit(1);
		}
		await importFile(arg1, cmd);
		break;
}
