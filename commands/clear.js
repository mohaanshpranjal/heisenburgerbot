const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")
const copies = require("../copies")

/** 
 * Clear command: clear the queue.
*/

const clearCopies = {
    name: "clear",
    description: "Clear the queue",
    response: "Cleared the current queue!"
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(clearCopies.name)
        .setDescription(clearCopies.description),
        { forVC: true }
    ),

    async execute (interaction) {
        // Get the current queue
        const queue = useQueue();
        
        if (!queue) {
            return interaction.reply(copies.noSession);
        }

        queue.clear();
        return interaction.reply(clearCopies.response);
    }
}