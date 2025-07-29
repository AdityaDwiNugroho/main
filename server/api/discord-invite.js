export default defineEventHandler(async (event) => {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || process.env.DISCORD_BOT_TOKEN?.split('.')[0]
  
  if (!DISCORD_CLIENT_ID) {
    return {
      error: 'Discord Client ID not found. Please add DISCORD_CLIENT_ID to your .env file',
      instructions: 'Go to https://discord.com/developers/applications, select your bot, and copy the Application ID'
    }
  }

  // Required permissions for presence monitoring
  const permissions = [
    'ViewChannel',     // View channels
    'ReadMessageHistory', // Read message history (basic bot functionality)
  ]

  const permissionValue = '67584' // Basic permissions for presence monitoring

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${permissionValue}&scope=bot`

  return {
    inviteUrl,
    clientId: DISCORD_CLIENT_ID,
    permissions: permissions,
    instructions: [
      '1. Click the invite URL below',
      '2. Select the Discord server you want to add the bot to',
      '3. Make sure you have "Manage Server" permission on that server',
      '4. Click "Authorize" to add the bot',
      '5. The bot will then be able to see your presence in that server'
    ]
  }
})
