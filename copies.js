module.exports = {
    play: {
        name: "play",
        description: "Play a song/add to queue",
        urlOption: "url",
        urlOptionDesc: "url (youtube) of the track to play",
        response: (title) => `✅ | Added to queue: ${title}`
    },
    skip: {
        name: "skip",
        description: "⏭️ Skip to next track",
        responseSkip: "⏭️ | Skipped to next track!",
        responseEmpty: "No more tracks in the queue!"
    },
    pause: {
        name: "pause",
        description: "⏯️ Pause/resume track",
        responsePause: "⏸️ | Player paused!",
        responseResume: (title) => `▶️ | Resumed track: ${title}`
    },
    shuffle: {
        name: "shuffle",
        description: "🔀 Shuffle Queue",
        response: (length) => `🔀 | ${length} tracks shuffled!`
    },
    loop: {
        name: "loop",
        description: "", // TODO: loop current track or whole queue? 🔁
    },
    stop: {
        name: "stop",
        description: "⏹️ Stop playing music",
        response: "⏹️ | Player stopped! Have a good day"
    },
    playError: "❌ Failed to play, oh no 😭",
    playResponse: (title) => `🎶 | Now Playing: ${title}`,
    finished: "⏹️ | Reached end of queue! Stopping player...",
    alone: "Chat where y'all at 😭 Im gonna disconnect if you leave me alone for 10 minutes... 💀"
    //TODO: add playlist support
}

// emoji store -->   ⏭️  🔁  ▶️  🔀  ⏯️  ⏸️  ⏹️
// 😭 🎶 ✅ ❌ 💀