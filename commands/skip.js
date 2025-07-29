const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")
const copies = require("../copies")

/** 
 * Skip command: skip to next track.
 * If there are no more tracks, ends player
*/

const skipCopies = {
    name: "skip",
    description: "⏭️ Skip to next track",
    responseSkip: (title) => `⏭️ | Skipped to next track! Now playing: ${title}`,
    responseEmpty: "⏹️ | Skipped! End of queue, stopping player."
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(skipCopies.name)
        .setDescription(skipCopies.description),
        { forVC: true }
    ),

    async execute (interaction) {
        // Get the current queue
        const queue = useQueue();
        
        if (!queue) {
            return interaction.reply(copies.noSession);
        }
        
        if (!queue.isPlaying()) {
            return interaction.reply(copies.noCurrent);
        }

        const nextTrack = queue.tracks.toArray()[0] ?? null;

        queue.node.skip();

        if(queue.isEmpty()) {
            return interaction.reply(skipCopies.responseEmpty);
        }
        
        // Send a confirmation message if there is a next track
        return interaction.reply(skipCopies.responseSkip(nextTrack.cleanTitle));
    }
}