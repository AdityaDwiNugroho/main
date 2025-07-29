# Portfolio with Real-time GitHub Status

This portfolio application displays real-time GitHub activity status alongside Discord status, providing a comprehensive view of your development activity.

## Features

### GitHub Integration
- **Real-time Activity Tracking**: Shows your current GitHub activity status (online, idle, away, offline)
- **Repository Information**: Displays the repository you're currently working on
- **Activity Timeline**: Shows when you were last active with relative timestamps
- **Repository Stats**: Displays public repositories, followers, and other stats
- **Recent Projects**: Shows your most recently updated repositories with descriptions and languages

### Discord Integration
- **Status Display**: Shows your current Discord status (online, idle, dnd, offline)
- **Real-time Updates**: Polls Discord API every 30 seconds for status updates

### Status Indicators
- **Green**: Currently active (within 10 minutes)
- **Yellow**: Recently active (within 1 hour)
- **Orange**: Was active today (within 24 hours)  
- **Gray**: Offline (no recent activity)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure GitHub Username**
   Update the GitHub username in the following files:
   - `composables/useGitHub.js` (line 78)
   - `components/EnhancedProfileCard.vue` (line 93)
   - `server/api/github-status.js` (line 3)

3. **Configure Discord Backend**
   Update the Discord API endpoint in `components/EnhancedProfileCard.vue` (line 115)

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## How It Works

### GitHub Status Detection
The application uses a multi-layered approach to determine GitHub activity:

1. **Public Events**: Fetches recent public events from GitHub API
2. **Repository Commits**: Checks recent commits in your most active repositories
3. **Smart Status Calculation**: Combines event data and commit timestamps to determine current status

### Real-time Updates
- GitHub status updates every 30 seconds
- Discord status updates every 30 seconds
- Server-side API route (`/api/github-status`) handles GitHub API calls to avoid CORS issues

### API Endpoints

#### `/api/github-status`
Returns comprehensive GitHub activity data:
```json
{
  "status": "online|idle|away|offline",
  "statusMessage": "Currently working on repository-name",
  "lastActivity": "2025-07-29T12:30:00.000Z",
  "currentRepo": "repository-name",
  "activityType": "PushEvent",
  "relativeTime": "5m ago",
  "publicRepos": 42,
  "followers": 100,
  "following": 50,
  "recentRepos": [...]
}
```

## Customization

### Styling
The component uses Tailwind CSS for styling. Key classes:
- Status indicators: `bg-green-500`, `bg-yellow-500`, `bg-orange-500`, `bg-gray-500`
- Tooltips: Animated hover effects with detailed information
- Loading states: Pulse animations during data fetching

### Polling Intervals
You can adjust update frequencies in:
- `composables/useGitHub.js`: `startPolling(intervalMs)`
- `components/EnhancedProfileCard.vue`: Discord polling interval

### GitHub API Rate Limits
The application respects GitHub API rate limits:
- 60 requests per hour for unauthenticated requests
- Consider adding GitHub token for higher limits if needed

## Components

### `EnhancedProfileCard.vue`
Main profile card component with:
- Dual status indicators (GitHub + Discord)
- Interactive tooltips
- Recent projects display
- Loading states
- Real-time activity feed

### `useGitHub.js`
Composable for GitHub integration:
- Activity fetching and processing
- Status calculation logic
- Polling management
- Error handling

### `server/api/github-status.js`
Server-side API route for GitHub data:
- Handles GitHub API requests
- Processes multiple data sources
- Returns consolidated status information

## Browser Support
- Modern browsers with ES6+ support
- WebSocket connections for real-time updates
- Responsive design for mobile and desktop

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the integration
5. Submit a pull request

## License
MIT License - feel free to use this in your own projects!
