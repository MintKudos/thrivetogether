// import discord.js
import {Client, Events, GatewayIntentBits, VoiceState} from 'discord.js';

// create a new Client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});
  /// {intents: [GatewayIntentBits.Guilds]});

// listen for the client to be ready
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});


let t = 0;
// listen for a voice state update
client.on(Events.VoiceStateUpdate, (oldState: VoiceState, newState: VoiceState) => {
  // check if the user has joined the Lounge channel

  if (newState.channelId && newState.channel?.name === 'Lounge' && !oldState.channelId) {
    console.log(`${newState.member?.user.tag} has joined the Lounge channel.`);
    if(!t) setTimeout(() => trig(newState.member?.user.tag), 2000);
    t = 1;
  }
});

async function trig(userTag:any) {
  const guild = client.guilds.cache.first(); // replace with your guild ID if necessary

  // const userTag = 'isVoiceBased'; // replace with the user's tag
  const user = guild?.members.cache.find(member => member.user.tag === userTag);

  const sourceChannelName = 'Lounge';
  const targetChannelName = 'Games';

  const sourceChannel = guild?.channels.cache.find(channel => channel.name === sourceChannelName && channel.isVoiceBased);
  const targetChannel = guild?.channels.cache.find(channel => channel.name === targetChannelName && channel.isVoiceBased);

  if (user && sourceChannel && targetChannel && user.voice.channelId === sourceChannel.id) {
    await user.voice.setChannel(targetChannel.id);
    console.log(`Moved ${user.user.tag} from ${sourceChannel.name} to ${targetChannel.name}`);
  }
}

// login with the token from .env.local
client.login(process.env.DISCORD_TOKEN);

