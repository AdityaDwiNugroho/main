export default defineEventHandler(async (event) => {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
  const DISCORD_USER_ID = process.env.DISCORD_USER_ID

  return {
    hasToken: !!DISCORD_TOKEN,
    hasUserId: !!DISCORD_USER_ID,
    tokenLength: DISCORD_TOKEN ? DISCORD_TOKEN.length : 0,
    userIdLength: DISCORD_USER_ID ? DISCORD_USER_ID.length : 0,
    tokenStart: DISCORD_TOKEN ? DISCORD_TOKEN.substring(0, 10) + '...' : 'missing',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }
})
