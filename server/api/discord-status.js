import { Client, GatewayIntentBits } from 'discord.js'

let discordClient = null
let currentStatus = 'offline'
let lastActivity = null
let clientReady = false
let connectionAttempts = 0
let lastConnectionAttempt = null

// Your Discord bot token and user ID from environment
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_USER_ID = process.env.DISCORD_USER_ID

// Initialize Discord client with better error handling
const initializeDiscordClient = async () => {
  if (!DISCORD_TOKEN || !DISCORD_USER_ID) {
    console.log('❌ Discord credentials not found in environment variables')
    return false
  }

  if (discordClient && clientReady) {
    return true
  }

  // Limit connection attempts to avoid spam
  const now = Date.now()
  if (lastConnectionAttempt && (now - lastConnectionAttempt) < 30000) { // 30 seconds cooldown
    return false
  }

  try {
    connectionAttempts++
    lastConnectionAttempt = now
    
    console.log(`🔄 Attempting Discord connection (attempt ${connectionAttempts})...`)

    discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
      ]
    })

    // Set a connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!clientReady) {
        console.log('⏰ Discord connection timeout after 10 seconds')
        discordClient?.destroy()
        clientReady = false
      }
    }, 10000)

    discordClient.once('ready', async () => {
      clearTimeout(connectionTimeout)
      console.log(`✅ Discord bot logged in as ${discordClient.user.tag}`)
      clientReady = true
      connectionAttempts = 0 // Reset on success
      
      // Try to find the user in any guild
      await updateUserStatus()
    })

    discordClient.on('presenceUpdate', (oldPresence, newPresence) => {
      if (newPresence && newPresence.userId === DISCORD_USER_ID) {
        console.log(`📱 Discord status updated: ${newPresence.status}`)
        updateUserStatus(newPresence)
      }
    })

    discordClient.on('error', (error) => {
      clearTimeout(connectionTimeout)
      console.error('❌ Discord client error:', error.message)
      clientReady = false
    })

    discordClient.on('disconnect', () => {
      console.log('🔌 Discord client disconnected')
      clientReady = false
    })

    await discordClient.login(DISCORD_TOKEN)
    return true

  } catch (error) {
    console.error(`❌ Failed to initialize Discord client: ${error.message}`)
    clientReady = false
    
    // Don't spam connection attempts
    if (connectionAttempts >= 3) {
      console.log('🛑 Max Discord connection attempts reached, will retry later')
    }
    
    return false
  }
}

const updateUserStatus = async (presence = null) => {
  if (!discordClient || !clientReady) return

  try {
    // If no presence provided, try to find user in guilds
    if (!presence) {
      for (const guild of discordClient.guilds.cache.values()) {
        try {
          // Fetch all members to ensure cache is up to date
          await guild.members.fetch()
          const member = guild.members.cache.get(DISCORD_USER_ID)
          if (member) {
            presence = member.presence
            console.log(`👤 Found user in ${guild.name}: ${member.presence?.status || 'no presence'}`)
            break
          }
        } catch (error) {
          console.log(`❌ Failed to fetch members from ${guild.name}: ${error.message}`)
        }
      }
    }

    if (presence) {
      currentStatus = presence.status || 'offline'
      lastActivity = new Date().toISOString()
      
      console.log(`📊 Updated Discord status: ${currentStatus}`)
    } else {
      console.log(`❌ No presence data found for user ${DISCORD_USER_ID}`)
    }
  } catch (error) {
    console.error('❌ Error updating user status:', error.message)
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Only try to initialize if we haven't exceeded connection attempts
    if (!clientReady && connectionAttempts < 3) {
      await initializeDiscordClient()
    }

    // If still not ready, return appropriate status
    if (!clientReady) {
      const errorMessage = connectionAttempts >= 3 
        ? 'Discord connection failed after 3 attempts' 
        : 'Discord bot is connecting...'
        
      return {
        status: 'offline',
        lastActivity: null,
        timestamp: new Date().toISOString(),
        source: 'discord-connection-failed',
        error: errorMessage,
        connectionAttempts: connectionAttempts
      }
    }

    return {
      status: currentStatus,
      lastActivity: lastActivity,
      timestamp: new Date().toISOString(),
      source: 'discord-bot-real',
      botReady: clientReady,
      guilds: discordClient ? discordClient.guilds.cache.size : 0,
      connectionAttempts: connectionAttempts
    }

  } catch (error) {
    console.error('❌ Discord Status Error:', error)
    
    return {
      status: 'offline',
      lastActivity: null,
      timestamp: new Date().toISOString(),
      source: 'discord-error',
      error: error.message
    }
  }
})
