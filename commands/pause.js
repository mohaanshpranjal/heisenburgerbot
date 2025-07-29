const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue, useTimeline, GuildQueueEvent } = require("discord-player")
const copies = require("../copies")

/** 
 * Pause command: pause the current track.
*/

const pauseCopies = {
    name: "pause",
    description: "⏯️ Pause/resume track",
    responsePause: "⏸️ | Player paused!",
    responseResume: (title) => `▶️ | Resumed track: ${title}`
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(pauseCopies.name)
        .setDescription(pauseCopies.description),
        { forVC: true }
    ),

    async execute (interaction) {
        const timeline = useTimeline();

        if (!timeline) {
            return interaction.reply(copies.noSession);
        }
        
        timeline.paused ? timeline.resume() : timeline.pause();

        const queue = useQueue();
        const currentTrack = queue.currentTrack;
        
        return interaction.reply(
            timeline.paused ? pauseCopies.responsePause : pauseCopies.responseResume(currentTrack.cleanTitle),
        );

    }
}