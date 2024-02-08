import { Client, Partials, GatewayIntentBits } from 'discord.js';

const client = new Client({
    
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent
    ],

    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ]

});

import main from '../client/main.js'
main(client);