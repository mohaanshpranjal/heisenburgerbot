const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { useMainPlayer } = require("discord-player")

module.exports = {
	data: Object.assign(new SlashCommandBuilder()
		.setName("play")
		.setDescription("I'll play a song from the URL!")
        .addStringOption(option => option.setName("url").setDescription("the song's URL").setRequired(true)),
		{ forVC: true }),

	execute: async (interaction) => {

        player = useMainPlayer();
        const query = interaction.options.getString('url', true);

        await interaction.deferReply();
        try {
            const { track } = await player.play(interaction.member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction,
                },
            });
            //console.log(track);
            return interaction.followUp(`🎶 | Added to queue: ${track.cleanTitle}`);
        } catch(e) {
            console.log(`Failed to play error oh no:\n\n${e}`);
            await interaction.editReply(`😭 Failed to play error, oh no 😭`);
        }

	},
}