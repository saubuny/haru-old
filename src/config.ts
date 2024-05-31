import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import type { Config } from "./types";

export function readConfigFile(): Config | undefined {
	try {
		const config = readFileSync(
			`${homedir()}/.config/haru/config.json`,
		).toString();
		return JSON.parse(config);
	} catch (err: any) {
		if (err.code === "ENOENT") {
			createConfigFile();
			readConfigFile();
		} else {
			console.error(err.message);
		}
	}
}

function createConfigFile(): void {
	const default_config: Config = {
		list_location: `${homedir()}/.config/haru/list.json`,
		colors: true,
	};
	mkdirSync(`${homedir()}/.config/haru`, { recursive: true });
	writeFileSync(
		`${homedir()}/.config/haru/config.json`,
		JSON.stringify(default_config, null, 2),
	);
}
