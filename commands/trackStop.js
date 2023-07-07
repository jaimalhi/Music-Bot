const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const player = require("../index");

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

      // If the user is not in a voice channel, don't allow command
      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
         return interaction.reply({
            content: "You are not in a voice channel!",
            ephemeral: true,
         });
      }
      if (
         interaction.guild.me.voice.channelId &&
         interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
      ) {
         return interaction.reply({
            content: "You are not in my voice channel!",
            ephemeral: true,
         });
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
