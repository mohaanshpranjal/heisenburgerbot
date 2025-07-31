const { Client, GuildMember, IntentsBitField, Collection } = require("discord.js");
const { Player, GuildQueueEvent } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { BOT_TOKEN } = require("./config");
const { parseCommands, deployCommands } = require("./deploy");

const debugMode = false;

const client = new Client({
    intents: [IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent]
});
client.login(BOT_TOKEN);

client.once('ready', () => {
    client.commands = parseCommands(debugMode);
    console.log('Ready! Hello (again), World ::)');
});
   
client.on("error", console.error);
client.on("warn", console.warn);

const player = new Player(client, { skipFFmpeg: false });
player.extractors.register(YoutubeiExtractor, {});


// error handlers
player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});
player.on("playerError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

// player functions -- doesnt work rn

player.on("playerStart", (queue, track) => {
    //queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
    console.log("player event activated!")
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});


if(debugMode){
    player.events.on(GuildQueueEvent.PlayerPause, (queue, track) => {console.log("\n player pause!\n")})
    player.events.on(GuildQueueEvent.PlayerResume, (queue, track) => {console.log("\n player resumed!\n")})
    player.events.on("playerStart", (queue, track) => {console.log("\n player start!\n")})
    player.events.on("disconnect", (queue) => {console.log("\n disconnected!\n")})
    player.events.on("emptyQueue", (queue) => {console.log("\n empty queue!\n")})
    player.events.on("playerError", (queue) => {console.log("\n player error!\n")})
    player.events.on("error", (queue) => {console.log("\n error!\n")})
    
    player.on('debug', async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
    });
    player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});
}


// prefix commands - only for testing/deploymment
client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();
    if (message.content === "!bruh" && message.author.id === client.application?.owner?.id) {
        message.channel.sendTyping().then(() => {
            message.channel.send("jesse wut duuu heeeeee")
        });
        
    }

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await deployCommands(client, message, !debugMode); // debug mode only deploys in current guild

        message.channel.sendTyping().then(() => {
            message.channel.send("Deployed!")
        });
    }
});

// executing slash commands
client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    //console.log(command);
    if (command.data.forVC) {
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return void interaction.reply({ content: "You are not in a voice channel! 💀💀💀", ephemeral: true });
        }

        if (client.voice.channelId && interaction.member.voice.channelId !== client.voice.channelId) {
            return void interaction.reply({ content: "You are not in my voice channel! 💀💀💀", ephemeral: true });
        }
    }

    try {
        await player.context.provide({ guild: interaction.guild }, () => command.execute(interaction));
    }
    catch(error) {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command 💀💀💀"});
    }
});