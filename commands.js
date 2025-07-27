const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMainPlayer } = require("discord-player")
const copies = require("./copies")

module.exports = {

    /** 
     * Test command: He is the one who tests
    */
    test: {
        data: new SlashCommandBuilder()
		.setName("testcm")
		.setDescription("test command fr"),

        execute: async (interaction) => {

            // Make sure the user is inside a voice channel
            return interaction.reply("I am the one who tests 🗿🗿🗿");

        },
    },

    /** 
     * Play command: plays the track from url.
     * If another track is playing, adds to queue
    */
	play: {
        data: Object.assign(new SlashCommandBuilder()
            .setName(copies.play.name)
            .setDescription(copies.play.description)
            .addStringOption(option => option.setName(copies.play.urlOption).setDescription(copies.play.urlOptionDesc).setRequired(true)),
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
                return interaction.followUp(copies.play.response(track.cleanTitle));
            } catch(e) {
                console.log(`Failed to play error:\n\n${e}`);
                await interaction.editReply(copies.playError);
            }

        }
    },

    /** 
     * Skip command: skips current track.
     * If there are no more tracks, ends player.
    
    skip: {
        data: Object.assign(new SlashCommandBuilder()
            .setName(copies.skip.name)
            .setDescription(copies.skip.description),
            { forVC: true }),

        execute : async (interaction) => {

        }
    }*/
}