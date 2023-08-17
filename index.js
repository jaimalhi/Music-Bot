const fs = require("node:fs"); // fs is used to read the commands directory and identify our command files
const path = require("node:path"); // path helps construct paths to access files and directories
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

// Create a new client instance
const client = new Client({
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
   ],
});

// ===================================== Bot status display =====================================
client.on("ready", () => {
   client.user.setActivity({
      name: "MuSiC | +help",
      type: ActivityType.Playing,
   });
});
client.on("error", console.error);
client.on("warn", console.warn);

// ===================================== Adding slash commands =====================================
client.commands = new Collection(); // collection of commands

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// getting command files
for (const file of commandFiles) {
   const filePath = path.join(commandsPath, file);
   const command = require(filePath);
   // Set a new item in the Collection with the key as the command name and the value as the exported module
   if ("data" in command && "execute" in command) {
      console.log(command.data.name);
      client.commands.set(command.data.name, command);
   } else {
      console.log(command);
      console.log("=== index ===");
      console.log(
         `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
   }
}

// ===================================== Reading event files =====================================
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
   const filePath = path.join(eventsPath, file);
   const event = require(filePath);
   if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
   } else {
      client.on(event.name, (...args) => event.execute(...args));
   }
}

// ===================================== Creating discord player =====================================
const player = new Player(client);
//export the player object
module.exports = player;

// event listeners for song start, stop, skip, etc.
player.events.on("audioTrackAdd", (queue, song) => {
   queue.metadata.channel.send(`🎶 | Song **${song.title}** added to the queue!`);
});

player.events.on("playerStart", (queue, track) => {
   queue.metadata.channel.send(`▶ | Started playing: **${track.title}**!`);
});

player.events.on("audioTracksAdd", (queue) => {
   queue.metadata.channel.send(`🎶 | Tracks have been queued!`);
});

player.events.on("disconnect", (queue) => {
   queue.metadata.channel.send("❌ | Disconnected from the voice channel, clearing queue!");
});

player.events.on("emptyChannel", (queue) => {
   queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
});

player.events.on("emptyQueue", (queue) => {
   queue.metadata.channel.send("✅ | Queue finished!");
});

player.events.on("error", (queue, error) => {
   console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

// ===================================== launch bot =====================================
client.login(config.token);
