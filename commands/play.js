const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require("discord-player")
const copies = require("../copies")

/** 
 * Play command: plays the track from url.
 * If another track is playing, adds to queue
*/

const playCopies = {
    name: "play",
    description: "▶️ Play a song/add to queue",
    urlOption: "url",
    urlOptionDesc: "url (youtube) of the track to play",
    response: (title) => `✅ | Added to queue: ${title}`
    //TODO: add playlist support
}


module.exports = {
    data: Object.assign(new SlashCommandBuilder()
        .setName(playCopies.name)
        .setDescription(playCopies.description)
        .addStringOption(option => option.setName(playCopies.urlOption).setDescription(playCopies.urlOptionDesc).setRequired(true)),
        { forVC: true }
    ),

    async execute (interaction) {

        player = useMainPlayer();
        const query = interaction.options.getString('url', true);

        await interaction.deferReply();
        try {
            const { track } = await player.play(interaction.member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction,
                },
            });
            return interaction.followUp(playCopies.response(track.cleanTitle));
        } catch(e) {
            console.log(`Failed to play error:\n\n${e}`);
            await interaction.editReply(copies.playError);
        }

    }
}