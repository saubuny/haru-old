import { parseArgs } from "util";
// import { exit } from "process";
import { search } from "./search";
import { importMal, importKitsu, importHianime } from "./parse";

const { values } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		search: {
			type: "string",
		},
		importMal: {
			type: "string",
		},
		importKitsu: {
			type: "string",
		},
		importHianime: {
			type: "string",
		},
	},
});

// TODO: Format and color output :)
if (values.search) search(values.search);
if (values.importMal) importMal(values.importMal);
if (values.importKitsu) await importKitsu(values.importKitsu);
if (values.importHianime) importHianime(values.importHianime);
