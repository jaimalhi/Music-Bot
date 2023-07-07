const { Events, EmbedBuilder } = require("discord.js");

var timeout = [];

module.exports = {
   name: Events.InteractionCreate,
   async execute(interaction) {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
         console.error(`No command matching ${interaction.commandName} was found.`);
         return;
      }

      // embed creation
      const embed = new EmbedBuilder()
         .setColor("Red")
         .setDescription(`:no_entry_sign: Wait 3 seconds!`);

      if (timeout.includes(interaction.user.id)) {
         // set a timeout to delete message after 3 seconds
         return interaction
            .reply({ embeds: [embed], ephemeral: true })
            .then((msg) => {
               setTimeout(() => msg.delete(), 3000);
            })
            .catch((error) => {
               console.error(error);
            });
      }

      try {
         await command.execute(interaction);

         timeout.push(interaction.user.id);
         setTimeout(() => {
            timeout.shift();
         }, 3000);
      } catch (error) {
         console.error(`Error executing ${interaction.commandName}`);
         console.error(error);
      }
   },
};
