const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { isInVoiceChannel } = require("../utils/inVoiceChannel");
const player = require("../index");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Display the current queue of songs"),
   async execute(interaction) {
      const inVoiceChannel = isInVoiceChannel(interaction);
      if (!inVoiceChannel) {
         return;
      }

      //TODO: test command functionality
      const queue = useQueue(interaction.guild.id);
      if (typeof queue != "undefined") {
         const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
         // embed creation
         const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
               trimString(
                  `The Current song playing is 🎶 | **${queue.currentTrack.title}**! \n 🎶 | ${queue}! `,
                  4095
               )
            );
         return interaction.reply({ embeds: [embed], ephemeral: false });
      } else {
         return interaction.reply({
            content: "There is no song in the queue!",
         });
      }
   },
};
