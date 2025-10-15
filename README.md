<p align="center">
    <img src="./dialecticabanner.png" alt="Dialectica Debate Room Banner" />
</p>

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/network/members)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/sYGyBHu5SU)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

## Features

- **Real-time Communication**: Instant messaging powered by Socket.io
- **Room-based Debates**: Create or join specific debate rooms
- **Random Room Matching**: Get paired with available participants
- **Modern UI**: Clean, responsive interface with dark/light mode support
- **Room Management**: Smart room capacity handling (max 2 participants per room)
- **Real-time Status**: Live connection status indicators

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Next-Auth** - Authentication (configured)
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket implementation
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type-safe server development

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dialectica-ai/dialectica-ai
   cd dialectica-ai
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   **Server Environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   ```

   **Client Environment:**
   ```bash
   cd client
   cp .env.example .env.local
   # Edit .env.local with your configuration
   # See client/SETUP.md for detailed setup instructions
   ```

   > 📖 For detailed client setup instructions including Google OAuth configuration, see [client/SETUP.md](client/SETUP.md)

4. **Database Setup**
   ```bash
   cd server
   # After configuring your .env file, run migrations
   npx prisma migrate dev
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000 (or http://localhost:3001 depending on config)
   - Backend: http://localhost:5003

> ⚠️ **Note**: Make sure both server and client are running for the application to work properly. The client needs to connect to the Socket.io server.

## Project Structure

```
dialectica-ai/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configurations
│   └── types/             # TypeScript type definitions
├── server/                # Express.js backend application
│   ├── src/
│   │   ├── routers/       # API route handlers
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # Socket.io event handlers
│   │   └── index.ts       # Server entry point
│   └── prisma/            # Database schema and migrations
└── docs/                  # Documentation
```

## Usage

1. **Create or Join a Room**: Enter a room name on the homepage
2. **Random Matching**: Click "Join Random Available Room" to be paired automatically
3. **Start Debating**: Send messages in real-time with other participants
4. **Room Management**: Rooms automatically handle capacity and cleanup

## Environment Variables

### Server (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dialectica_ai
PORT=5003
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

> See `server/.env.example` for all available options.

### Client (.env.local)
```env
# WebSocket Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (if using authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> 📖 **For detailed setup instructions**, including how to obtain Google OAuth credentials, see [client/SETUP.md](client/SETUP.md)

> ⚠️ **Security**: Never commit `.env` or `.env.local` files to version control!

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

1. **Code Style**: We use TypeScript and ESLint for code quality
2. **Commits**: Follow conventional commit format
3. **Pull Requests**: Provide clear descriptions and test coverage
4. **Issues**: Use provided templates for bug reports and feature requests

## API Documentation

### Socket Events

#### Client → Server
- `requestRandomRoom` - Request to join any available room
- `joinRoom(roomId)` - Join a specific room
- `sendMessage(message, roomId)` - Send a message to a room
- `checkRoomAvailability(roomId)` - Check if room exists and has space

#### Server → Client
- `chat-message` - Receive chat messages
- `system-message` - Receive system notifications
- `randomRoomFound(roomId)` - Notification of successful random room match
- `roomAvailabilityResponse` - Response to room availability check

## Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts and profiles
- **Room**: Debate room information
- **Message**: Chat messages with relationships

## Roadmap

- [ ] AI-powered debate moderation
- [ ] User authentication and profiles
- [ ] Debate scoring and analytics
- [ ] Mobile app development
- [ ] Video/voice chat integration
- [ ] Tournament-style debates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
- 👾 Discord: [Discord](https://discord.com/invite/sYGyBHu5SU)
- 🐛 Issues: [GitHub Issues](https://github.com/Dialectica-ai/dialectica-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Dialectica-ai/dialectica-ai/discussions)

## Acknowledgments

- Socket.io team for real-time communication
- Next.js team for the excellent React framework
- Prisma team for the database toolkit
- All contributors and users of this project

---

⭐ Star this repository if you find it useful!



