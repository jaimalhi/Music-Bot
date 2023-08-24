const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");
const { isInVoiceChannel } = require("../../utils/inVoiceChannel");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play a song")
      .addStringOption((option) =>
         option.setName("query").setDescription("The song you want to play").setRequired(true)
      ),
   async execute(interaction) {
      try {
         const inVoiceChannel = isInVoiceChannel(interaction);
         if (!inVoiceChannel) {
            return;
         }

         await interaction.deferReply();

         const player = useMainPlayer();
         const query = interaction.options.getString("query");
         const searchResult = await player.search(query);
         if (!searchResult.hasTracks())
            return void interaction.followUp({ content: "No results were found!" });

         try {
            const res = await player.play(interaction.member.voice.channel.id, searchResult, {
               nodeOptions: {
                  metadata: {
                     channel: interaction.channel,
                     client: interaction.guild?.members.me,
                     requestedBy: interaction.user.username,
                  },
                  leaveOnEmptyCooldown: 300000,
                  leaveOnEmpty: true,
                  leaveOnEnd: false,
                  bufferingTimeout: 0,
                  volume: 10,
                  //defaultFFmpegFilters: ['lofi', 'bassboost', 'normalizer']
               },
            });

            await interaction.followUp({
               content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...`,
            });
         } catch (error) {
            await interaction.editReply({
               content: "An error has occurred!",
            });
            return console.log(error);
         }
      } catch (error) {
         await interaction.reply({
            content: "There was an error trying to execute that command: " + error.message,
         });
      }
   },
};
