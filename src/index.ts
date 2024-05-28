import { parseArgs } from "util";
// import { exit } from "process";
import { search } from "./search";
import { importMal } from "./parse";

const { values } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		search: {
			type: "string",
		},
		importMal: {
			type: "string",
		},
	},
});

// TODO: Format and color output :)
if (values.search) search(values.search);
if (values.importMal) importMal(values.importMal);

