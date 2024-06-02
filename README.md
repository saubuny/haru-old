# Haru - An Anime Tracker

Note: Not yet fully functional!

## Features

* Can import from multiple supported sites (kitsu, mal, etc.)
* Search MAL via Jikan API
* Can query/modify your list :)

Your list will be generated and stored in JSON format in the configurated location. Your config file lives in `.config/haru/config.json`.

## Usage/Examples

Install with the following command and then move to a location in your path
```bash
bun build src/index.ts --compile --outfile=haru
```

Importing data to your list:
```bash
haru --importMal mal.xml
```

Display info about an anime:
```bash
haru --searchMal Naruto
```

Add an anime via it's ID:
```bash
haru --add [id]
```

## Why

Because I've had data stored across different tracking websites for awhile, and i'd like to easily merge them together. Also, being able to manage stuff from the terminal is much more convenient for me than these big websites, which tend to be slow. 
