const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: Object.assign(new SlashCommandBuilder()
		.setName("play")
		.setDescription("I'll play a song from the URL!")
        .addStringOption(option => option.setName("url").setDescription("the song's URL").setRequired(true)),
		{ forVC: true }),

	execute: async ({ player, interaction }) => {

        await interaction.deferReply();

        const query = interaction.options.get("url").value;
        try {
            const { track } = await player.play(interaction.member.voice.channelId, query);
            await interaction.editReply(`🎶 | Started playing: ${track.author} - ${track.title}`);
        } catch(e) {
            console.log(`Failed to play error oh no:\n\n${e}`);
            await interaction.editReply(`😭 Failed to play error, oh no 😭`);
        }

	},
}