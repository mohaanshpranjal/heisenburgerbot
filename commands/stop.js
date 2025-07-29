const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")
const copies = require("../copies")

/** 
 * Stop command: stop the player. (deletes the queue)
*/

const stopCopies = {
    name: "stop",
    description: "⏹️ Stop playing music",
    response: "⏹️ | Player stopped. Have a good day!"
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(stopCopies.name)
        .setDescription(stopCopies.description),
        { forVC: true }
    ),

    async execute (interaction) {
        // Get the current queue
        const queue = useQueue();
        
        if (!queue) {
            return interaction.reply(copies.noSession);
        }

        queue.delete();
        return interaction.reply(stopCopies.response);
    }
}