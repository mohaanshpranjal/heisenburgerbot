const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")
const copies = require("../copies")

/** 
 * Shuffle command: shuffles the queue if there are 2 or more tracks
*/

const shuffleCopies = {
    name: "shuffle",
    description: "🔀 | Shuffle the queue",
    responseOne: "There's not enough tracks to shuffle 🤨",
    responseShuffled: (size) => `🔀 | Shuffled ${size} tracks!`
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(shuffleCopies.name)
        .setDescription(shuffleCopies.description),
        { forVC: true }
    ),

    async execute (interaction) {
        // Get the current queue
        const queue = useQueue();
        
        if (!queue) {
            return interaction.reply(copies.noSession);
        }

        const size = queue.size;
        if (size < 2) {
            return interaction.reply(shuffleCopies.responseOne);
        }

        queue.tracks.shuffle();

        return interaction.reply(shuffleCopies.responseShuffled(size));
    }
}