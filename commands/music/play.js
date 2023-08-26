const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { isInVoiceChannel } = require("../../utils/inVoiceChannel");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play a song")
      .addStringOption((option) =>
         option.setName("query").setDescription("The song you want to play").setRequired(true)
      ),
   async execute(interaction) {
      //TODO: test command functionality
      try {
         const inVoiceChannel = isInVoiceChannel(interaction);
         if (!inVoiceChannel) {
            return;
         }

         const player = useMainPlayer();
         const songName = interaction.options.getString("query");
         const searchResult = await player.search(songName);

         await interaction.deferReply();

         if (!searchResult.hasTracks())
            return interaction.followUp({
               content: `No results were found for ${songName}`,
               ephemeral: true,
            });

         try {
            const res = await player.play(interaction.member.voice.channel.id, searchResult, {
               nodeOptions: {
                  metadata: {
                     channel: interaction.channel,
                     client: interaction.guild?.members.me,
                     requestedBy: interaction.user.username,
                  },
                  leaveOnEmptyCooldown: 200000, // 200000ms | 200s
                  leaveOnEmpty: true,
                  leaveOnEnd: false,
                  bufferingTimeout: 0,
                  volume: 50,
                  //defaultFFmpegFilters: ['lofi', 'bassboost', 'normalizer']
               },
            });

            // // if song query was successful, add song to queue
            // const queue = await player.createQueue(interaction.guild, {
            //    metadata: interaction.channel,
            // });
            // searchResult.playlist
            //    ? queue.addTracks(searchResult.tracks)
            //    : queue.addTrack(searchResult.tracks[0]);
            // if (!queue.playing) await queue.play(); // if queue isnt playing, play the queue

            // embed creation
            const queueEmbed = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(
                  `:stopwatch: | Loading your ${searchResult.playlist ? "playlist" : "track"}...`
               );

            await interaction.followUp({ embeds: [queueEmbed], ephemeral: true });
         } catch (error) {
            await interaction.editReply({
               content: "An error has occurred!",
            });
            return console.log(error);
         }
      } catch (error) {
         await interaction.followUp({
            content: "There was an error trying to execute that command",
         });
         return console.log(error);
      }
   },
};
