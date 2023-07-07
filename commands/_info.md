# Example ping command code
- placed inside module.exports so they can be read by other files; namely the command loader and command deployment scripts mentioned earlier
```
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```
- data property will provide the command definition shown above for registering to Discord.
- execute method will contain the functionality to run from our event handler when the command is uses
---
# Embed Builder
```
// embed creation
const embed = new EmbedBuilder()
.setColor('Green')
.setDescription(`:white_check_mark: Cleaned \`${amount}\` messages.`)

// set a timeout to delete message after 3 seconds
return interaction.reply({ embeds: [embed], ephemeral: true })
    .then(msg => {
        setTimeout(() => msg.delete(), 3000)
    })
    .catch(error => {
        console.error(error);
    });
```
