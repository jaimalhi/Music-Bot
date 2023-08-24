const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("clean")
      .setDescription("clean/remove up to 99 messages.")
      .addIntegerOption((option) =>
         option.setName("amount").setDescription("Number of messages to clean").setRequired(true)
      ),
   async execute(interaction) {
      //    async execute(interaction) {
      const amount = interaction.options.getInteger("amount");

      // Deny clean command if user doesn't have permissions
      if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages)) {
         const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:no_entry_sign: You don't have permisson execute this command!`);

         return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (amount < 1 || amount > 99) {
         const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`:repeat: You need to input a number between 1 and 99.`);

         return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      await interaction.channel.bulkDelete(amount, true).catch((error) => {
         console.error(error);
         const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:bangbang: There was an error executing the command`);

         interaction.reply({ embeds: [embed], ephemeral: true });
      });

      // embed creation
      const embed = new EmbedBuilder()
         .setColor("Green")
         .setDescription(`:white_check_mark: Cleaned \`${amount}\` messages.`);

      // set a timeout to delete message after 3 seconds
      return interaction
         .reply({ embeds: [embed], ephemeral: true })
         .then((msg) => {
            setTimeout(() => msg.delete(), 3000);
         })
         .catch((error) => {
            console.error(error);
         });
   },
};
