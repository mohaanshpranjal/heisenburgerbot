const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("testcm")
		.setDescription("test command fr"),

	execute: async ({ client, interaction }) => {

        // Make sure the user is inside a voice channel
		return interaction.reply("I am the one who tests.");

	},
}