# Haru - An Anime Tracker

Note: Not yet fully functional!

## Features

* Store in json format (soon to be changed to a database)
* Can import from multiple supported sites (kitsu, mal, etc.)
* Search MAL via Jikan API
* Can query/modify your list :)

## Usage/Examples

Importing data to your list:
```bash
haru --importMal mal.xml
```

Display info about an anime:
```bash
haru --search Naruto
```

Add an anime via it's ID:
```bash
haru --add [id]
```

## Why

Because I've had data stored across different tracking websites for awhile, and i'd like to easily merge them together. Also, being able to manage stuff from the terminal is much more convenient for me than these big websites, which tend to be slow. 
