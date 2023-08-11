const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js");
const player = require("../index");
const { QueryType, useMainPlayer } = require("discord-player");
const { isInVoiceChannel } = require("../utils/inVoiceChannel");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play a song")
      .addStringOption((option) =>
         option.setName("query").setDescription("The song you want to play").setRequired(true)
      ),
   async execute(interaction) {
      //TODO: test command functionality
      await interaction.reply({ content: "Play!", ephemeral: false });
   },
};
