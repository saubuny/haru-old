import { search } from "./search";
import { importFile } from "./parse";
import { exit } from "process";

export enum Options {
	Search,
	ImportMal,
	ImportKitsu,
	ImportHianime,
}

// Index errors apparently don't exist ??
const cmdStr = Bun.argv[2];
const arg = Bun.argv[3];
let cmd: Options;

switch (cmdStr) {
	case "--help":
		console.log("Tsracker: An Anime Tracker");
		console.log("Usage:");
		console.log("\t--help -> The message you're seeing right now");
		console.log("\t--search [title] -> Search MAL by title");
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
	default:
		console.error(`[Error] Invalid command given: ${cmdStr}`);
		console.error("Try running the --help command");
		exit(1);
}

switch (cmd) {
	case Options.Search:
		search(arg);
		break;
	default:
		if (!arg) {
			console.error("[Error] No file given");
			exit(1);
		}
		await importFile(arg, cmd);
		break;
}
