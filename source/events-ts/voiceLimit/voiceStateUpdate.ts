import { Client, VoiceState } from "discord.js";

export default {
    name: "voiceStateUpdate",
    run: async (client: Client, oldState: VoiceState, newState: VoiceState) => {
        if (!newState.channelId) return;

        // Get the voice limit data
        const voiceLimitData = client.data.get(`voicelimit_${newState.guild.id}_${newState.channelId}`);

        // If there is no limit data, ignore
        if (!voiceLimitData) return;

        // Count the number of users in the channel
        const memberCount = newState.channel?.members.size;

        if (!memberCount) return;
        
        // If the limit is exceeded, disconnect the user
        if (memberCount > voiceLimitData.limit) {
            try {
                await newState.setChannel(null)
            } catch (error) {
                console.error(`Failed to disconnect user: ${error}`);
            }
        }
    }
}