const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")
const { EmbedBuilder } = require('discord.js');
const copies = require("../copies")

/** 
 * Help command: display all available commands.
*/

const helpCopies = {
    name: "help",
    description: "❔ See all commands",
    embedTitle: 'List of commands',
    embedDesc: "Type '/' to enter commands. Only youtube links are supported currently",
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(helpCopies.name)
        .setDescription(helpCopies.description),
    ),

    async execute (interaction) {
        // Get the commands
        const commandlist = interaction.client.commands.map(cmd => cmd.data.toJSON());

        // inside a command, event listener, etc.
        const helpEmbed = new EmbedBuilder()
            .setColor(0xf0bd5d)
            .setTitle(helpCopies.embedTitle)
            .setDescription(helpCopies.embedDesc)
            .setTimestamp();

            for(command of commandlist) {
                helpEmbed.addFields({ name: command.name, value: command.description});
            }
            helpEmbed.setTimestamp();

        
        
        interaction.reply({ embeds: [helpEmbed] });
    }
}