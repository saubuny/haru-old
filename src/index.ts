import { search } from "./search";
import { importFile } from "./parse";
import { exit } from "process";
import { addNewAnime, getList, removeAnime, searchList } from "./list";
import { Options } from "./types";
import { readConfigFile } from "./config";

// === TODO ===
// * Modify data on list
// * Query data on list
//     * [x] Get by completion
//     * [ ] Search by name
//     * [ ] Search by id
// * Pretty-printed colored output

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
		console.log("\t--searchMal [title] -> Search MAL by title");
		console.log("\t--searchList [title] -> Search list by title");
		console.log("\t--add [id] -> Add ID to list");
		console.log("\t--remove [id] -> Remove ID from list");
		console.log(
			"\t--getList <completion> -> Fetch list contents, completion is an integer 0-4",
		);
		console.log("\t--modifyCompletion [id] [completion] -> Add ID to list");
		console.log("\t--modifyStart [id] [date] -> Add ID to list");
		console.log("\t--importMal [file] -> Import your MAL data in xml format");
		console.log(
			"\t--importKitsu [file] -> Import your Kitsu data in xml format",
		);
		console.log(
			"\t--importHianime [file] -> Import your Hianime data in json format, separated by folders",
		);
		exit(0);
	case "--searchMal":
	case "--sm":
		cmd = Options.SearchMal;
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
	case "--getList":
	case "--gl":
		cmd = Options.GetList;
		break;
	case "--searchList":
	case "--sl":
		cmd = Options.SearchList;
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
	case Options.SearchMal:
		await search(arg1);
		break;
	case Options.Add:
		await addNewAnime(parseInt(arg1), config.list_location);
		break;
	case Options.Remove:
		await removeAnime(parseInt(arg1), config.list_location);
		break;
	case Options.GetList:
		const list = getList(config.list_location);
		if (!arg1) {
			console.log(list);
			break;
		}
		const comp = Number(arg1);
		if (comp < 0 || comp > 4 || isNaN(comp)) {
			console.error("[Error] Completion number invalid or out of range");
			exit(1);
		}
		const filteredList = list.filter((entry) => entry.completion === comp);
		console.log(filteredList);
		break;
	case Options.SearchList:
		if (!arg1) {
			console.error("[Error] No search term given");
			exit(1);
		}
		searchList(arg1, config.list_location);
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
