const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const player = require("../index");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("queue")
      .setDescription("Display the current queue of songs"),
   async execute(interaction) {
      const queue = player.queues.get();
      console.log(queue);

      // embed creation
      const embed = new EmbedBuilder().setColor("Blue").setDescription(`:link: Showing Queue`);

      // set a timeout to delete message after 3 seconds
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch((error) => {
         console.error(error);
      });
   },
};
