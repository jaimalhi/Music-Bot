const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const player = require("../index");
const { isInVoiceChannel } = require("../utils/inVoiceChannel");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("stop")
      .setDescription("Stop the song currently playing"),
   async execute(interaction) {
      // Deny clean command if user doesn't have permissions
      if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages)) {
         const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:no_entry_sign: You don't have permisson execute this command!`);

         return await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      const inVoiceChannel = isInVoiceChannel(interaction);
      if (!inVoiceChannel) {
         return;
      }

      //TODO: add command functionality
      await interaction.deferReply();
      const queue = player.getQueue(interaction.guildId);
      // failEmbed creation
      const failEmbed = new EmbedBuilder()
         .setColor("Red")
         .setDescription(`:x: | No music is being played!`);
      if (!queue || !queue.playing)
         return interaction.followUp({ embeds: [failEmbed], ephemeral: true });
      queue.destroy();

      // embed creation
      const embed = new EmbedBuilder()
         .setColor("Blue")
         .setDescription(`:stop_button: Stopping Song`);

      // set a timeout to delete message after 3 seconds
      return interaction
         .followUp({ embeds: [embed], ephemeral: true })
         .then((msg) => {
            setTimeout(() => msg.delete(), 3000);
         })
         .catch((error) => {
            console.error(error);
         });
   },
};
