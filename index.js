const { Client, GuildMember, IntentsBitField, Collection } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const fs = require('fs');
const path = require('path');
const commands = [];

const client = new Client({
    intents: [IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent]
});
client.login(config.token);

client.once('ready', () => {

    // List of all commands
    
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles)
    {
        if (file.endsWith('testcm.js') || file.endsWith('play.js')) {
        
        // extracting commands from the files
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // store commands collection in client
        client.commands.set(command.data?.name, command);

        // commands object to push to rest
        commands.push(command.data?.toJSON());
        
        }
    }

    console.log('Ready!');
});
   
client.on("error", console.error);
client.on("warn", console.warn);

const player = new Player(client);
//player.extractors.loadMulti(); // loads all default extractors (yt, spotify, soundcloud, etc.)


// error handlers
player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
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

// slash commands
client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();
    if (message.content === "!bruh" && message.author.id === client.application?.owner?.id) {
        message.channel.sendTyping().then(() => {
            message.channel.send("jesse wut duuu heeeeee")
        });
        
    }

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {

        //console.log(commands);
        // set guild commands
        await message.guild.commands.set(commands);

        // set global commands
        //await client.application.commands.set(slashcommands);

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
            return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        }

        if (client.voice.channelId && interaction.member.voice.channelId !== client.voice.channelId) {
            return void interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        }
    }

    try
    {
        await command.execute({player, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command 💀💀💀"});
    }
});