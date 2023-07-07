const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("server")
      .setDescription("Display info about this server."),
   async execute(interaction) {
      const embed = new EmbedBuilder()
         .setColor("Blue")
         .setDescription(
            `:shield: Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
         );

      return interaction.reply({ embeds: [embed], ephemeral: true });
   },
};
