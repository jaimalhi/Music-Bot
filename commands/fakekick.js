const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Select a member and kick them (but not really).")
      .addUserOption((option) =>
         option.setName("target").setDescription("The member to kick").setRequired(true)
      ),
   async execute(interaction) {
      const member = interaction.options.getMember("target");
      const embed = new EmbedBuilder()
         .setColor("Blue")
         .setDescription(`:open_mouth: You tried to kick: ${member.user.username}`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
   },
};
