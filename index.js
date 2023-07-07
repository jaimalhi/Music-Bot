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
      client.commands.set(command.data.name, command);
   } else {
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

// basic error handlers
player.on("error", (queue, error) => {
   console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
   console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

// event listeners for song start, stop, skip, etc.
player.on("trackStart", (queue, track) => {
   queue.metadata.send(
      `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
   );
});

player.on("trackAdd", (queue, track) => {
   queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
   queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
   queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
   queue.metadata.send("✅ | Queue finished!");
});

// ===================================== launch bot =====================================
client.login(config.token);
