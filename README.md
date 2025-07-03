# Sheria Smart - Legal AI Assistant

A legal AI assistant application for Kenyan law, built with Next.js frontend and Express.js backend, integrated with Google Gemini API.

## Features

- **AI Legal Assistant**: Chat with an AI assistant specialized in Kenyan law
- **Real-time Chat**: Instant responses with conversation history
- **Database Storage**: Persistent chat sessions and message history
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- React hooks for state management

### Backend
- Express.js with TypeScript
- Prisma ORM with MySQL
- Google Gemini API integration
- CORS enabled for frontend communication

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MySQL database
- Google Gemini API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The `.env` file is already configured with:
```
DATABASE_URL="mysql://root:P%40sswo3d%23@localhost:3306/sheriasmart"
GEMINI_API_KEY="AIzaSyCYFIndQrHWeFphSzGezeQbIFOxz_Rhs_w"
PORT=5000
```

4. Set up database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Chat Endpoints

- `POST /api/chat/session` - Create a new chat session
- `POST /api/chat/send` - Send a message and receive AI response
- `GET /api/chat/history/:sessionId` - Get chat history for a session
- `GET /api/health` - Health check endpoint

### Example API Usage

```bash
# Create a chat session
curl -X POST http://localhost:5000/api/chat/session \
  -H "Content-Type: application/json" \
  -d "{}"

# Send a message
curl -X POST http://localhost:5000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "your-session-id", "message": "What are my rights as a tenant in Kenya?"}'
```

## Usage

1. Start both backend and frontend servers
2. Open the application in your browser at `http://localhost:3000`
3. Navigate to the dashboard and click "Ask Legal Question"
4. Start chatting with the AI assistant about Kenyan law

## Database Schema

The application uses two main tables:
- `chat_sessions`: Stores chat session information
- `messages`: Stores individual messages with role (USER/ASSISTANT)

## Important Notes

- The AI assistant is specialized in Kenyan law
- Always recommends consulting with qualified legal professionals
- Conversation history is maintained for context
- All responses include appropriate disclaimers about legal advice

## Future Enhancements

- User authentication system
- Document generation features
- Advanced legal document templates
- Integration with legal databases
- Multi-language support