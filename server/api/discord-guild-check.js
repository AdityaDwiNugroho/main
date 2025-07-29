import { Client, GatewayIntentBits } from 'discord.js'

export default defineEventHandler(async (event) => {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
  const DISCORD_USER_ID = process.env.DISCORD_USER_ID

  if (!DISCORD_TOKEN || !DISCORD_USER_ID) {
    return {
      error: 'Missing Discord credentials',
      hasToken: !!DISCORD_TOKEN,
      hasUserId: !!DISCORD_USER_ID
    }
  }

  try {
    // Create a temporary client to check server status
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
      ]
    })

    await client.login(DISCORD_TOKEN)
    
    // Wait a moment for the client to be ready
    await new Promise(resolve => {
      if (client.isReady()) {
        resolve()
      } else {
        client.once('ready', resolve)
      }
    })

    // Fetch all members in each guild to ensure we can see everyone
    const guilds = []
    
    for (const guild of client.guilds.cache.values()) {
      try {
        // Try to fetch all members to make sure the cache is populated
        await guild.members.fetch()
        
        guilds.push({
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount,
          botHasPermissions: guild.members.me?.permissions.has(['ViewChannel', 'ReadMessageHistory']),
          canSeeMembers: guild.members.cache.size,
          userFound: guild.members.cache.has(DISCORD_USER_ID),
          allMemberIds: Array.from(guild.members.cache.keys()).slice(0, 5), // First 5 member IDs for debugging
          botPermissions: guild.members.me?.permissions.toArray() || []
        })
      } catch (error) {
        guilds.push({
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount,
          error: `Failed to fetch members: ${error.message}`,
          botPermissions: guild.members.me?.permissions.toArray() || []
        })
      }
    }

    // Try to find your user across all guilds
    let userFound = false
    let userPresence = null
    let debugInfo = {
      searchingForUserId: DISCORD_USER_ID,
      totalGuilds: guilds.length
    }
    
    for (const guild of client.guilds.cache.values()) {
      const member = guild.members.cache.get(DISCORD_USER_ID)
      if (member) {
        userFound = true
        userPresence = {
          status: member.presence?.status || 'offline',
          activities: member.presence?.activities?.map(a => a.name) || [],
          guildName: guild.name,
          userId: member.user.id,
          username: member.user.username,
          nickname: member.nickname,
          joinedAt: member.joinedAt
        }
        break
      }
    }

    await client.destroy()

    return {
      success: true,
      botUsername: client.user?.username,
      botId: client.user?.id,
      guildsCount: guilds.length,
      guilds: guilds,
      userFound: userFound,
      userPresence: userPresence,
      targetUserId: DISCORD_USER_ID,
      debugInfo: debugInfo,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
