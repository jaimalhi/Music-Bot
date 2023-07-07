const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require("discord.js");
const player = require("../index");
const { QueryType } = require("discord-player");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play a song")
      .addStringOption((option) =>
         option.setName("query").setDescription("The song you want to play").setRequired(true)
      ),
   async execute(interaction) {
      const songName = interaction.options.getString("query");

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

      //TODO: test command functionality
      await interaction.deferReply();
      const searchResult = await player
         .search(songName, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
         })
         .catch((error) => {
            console.error(error);
         });
      if (!searchResult || !searchResult.tracks.length)
         return interaction.followUp({
            content: `No results were found for ${songName}`,
            ephemeral: true,
         });

      // if song query was successful, add song to queue
      const queue = await player.createQueue(interaction.guild, {
         metadata: interaction.channel,
      });

      try {
         if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
         void player.deleteQueue(interaction.guildId);
         return interaction.followUp({
            content: "Could not join your voice channel!",
            ephemeral: true,
         });
      }

      // queueEmbed creation
      const queueEmbed = new EmbedBuilder()
         .setColor("Blue")
         .setDescription(
            `:stopwatch: | Loading your ${searchResult.playlist ? "playlist" : "track"}...`
         );
      await interaction.followUp({ embeds: [queueEmbed], ephemeral: true });
      searchResult.playlist
         ? queue.addTracks(searchResult.tracks)
         : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play(); // if queue isnt playing, play the queue

      // embed creation
      const embed = new EmbedBuilder()
         .setColor("Blue")
         .setDescription(`:notes: Playing ${songName}`);

      // followUp (the deferred reply) with songName & catch errors
      return interaction.followUp({ embeds: [embed], ephemeral: false }).catch((error) => {
         console.error(error);
      });
   },
};
