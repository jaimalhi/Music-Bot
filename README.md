# Music-Bot
- Will use **+** as the indentifier

## Features
- *clean* feature to delete messages from chat
- *help* command that shows all other commands
- Play, stop, skip, and queue music through youtube
- Auto timeout, ie. leave channel by itself after a set time of no music playing
- Play through Soundcloud

## Resources
- using [Node.js](https://nodejs.org/en?ref=gabrieltanner.org) version 18.16.0 LTS
- using [discord.js](https://discord.js.org/) version 14
- using [FFmpeg](https://www.ffmpeg.org/?ref=gabrieltanner.org) for converting video/audio for streaming
    - installation guide [here](https://www.youtube.com/watch?v=5xgegeBL0kw&ab_channel=CodingSensei)

## General Info
- *events* folder contains:
    - `ready.js` which pings server when the bot is live
    - `interactionCreate.js` which is initalizes the bot to receive user interactions
- the *events* folder allows for new events to be easily created and registered whenever the bot is restarted
- all commands have a 3 second cooldown implemented through `interactionCreate.js`


## Running info
- `node deploy-commands.js` must be run to new register commands to the bot
- `node index.js` can be run to deploy bot through the terminal