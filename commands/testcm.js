const { SlashCommandBuilder } = require("@discordjs/builders")

/** 
 * Test command: He is the one who tests
*/
module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName("testcm")
        .setDescription("test command fr"),
        { testCommand: true }
    ),

    async execute (interaction) {
        return interaction.reply("I am the one who tests 🗿🗿🗿");
    },
}