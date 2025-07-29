import { Client, GatewayIntentBits } from 'discord.js'

export default defineEventHandler(async (event) => {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
  const DISCORD_USER_ID = process.env.DISCORD_USER_ID

  try {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
      ]
    })

    await client.login(DISCORD_TOKEN)
    
    await new Promise(resolve => {
      if (client.isReady()) {
        resolve()
      } else {
        client.once('ready', resolve)
      }
    })

    const guild = client.guilds.cache.first()
    if (!guild) {
      return { error: 'No guilds found' }
    }

    console.log(`🔍 Checking guild: ${guild.name}`)
    console.log(`👥 Guild member count: ${guild.memberCount}`)
    console.log(`💾 Cached members: ${guild.members.cache.size}`)
    
    // Try to fetch all members
    try {
      await guild.members.fetch()
      console.log(`✅ Fetched all members. New cache size: ${guild.members.cache.size}`)
    } catch (error) {
      console.log(`❌ Failed to fetch members: ${error.message}`)
    }

    // Check if user exists
    const member = guild.members.cache.get(DISCORD_USER_ID)
    const userExists = !!member
    
    console.log(`🔎 Looking for user ID: ${DISCORD_USER_ID}`)
    console.log(`👤 User found: ${userExists}`)
    
    if (member) {
      console.log(`✅ User details:`)
      console.log(`   - Username: ${member.user.username}`)
      console.log(`   - Status: ${member.presence?.status || 'No presence data'}`)
      console.log(`   - Activities: ${member.presence?.activities?.length || 0}`)
    }

    // Check bot permissions
    const botMember = guild.members.me
    const hasPresenceIntent = botMember?.permissions.has('ViewChannel')
    
    await client.destroy()

    return {
      guildName: guild.name,
      guildId: guild.id,
      memberCount: guild.memberCount,
      cachedMembers: guild.members.cache.size,
      userExists: userExists,
      userStatus: member?.presence?.status || 'not-found',
      botPermissions: botMember?.permissions.toArray().slice(0, 10) || [],
      targetUserId: DISCORD_USER_ID,
      botCanSeePresence: hasPresenceIntent
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message)
    return { error: error.message }
  }
})
