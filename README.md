# LinkUp - Student Networking Platform

## 🌟 Project Overview

LinkUp is a modern web application designed to facilitate networking among students, enabling them to connect, collaborate on projects, and share their skills. This platform was developed as part of the Microsoft Student Accelerator (MSA) Phase 2 Software Stream assessment.

## ✨ Key Features

### Basic Features
- **User Authentication & Security**
  - JWT-based authentication with refresh token support
  - Secure password hashing using BCrypt
  - Session management with token validation
  - Password change functionality
  - User activity tracking (last login)

- **Profile Management**
  - Personal information management (username, email, name)
  - University affiliation
  - Skill board showcase
  - Development direction preferences
  - Professional links and portfolio

- **Project Collaboration**
  - Create and manage projects
  - Advanced project search with filters
  - Multiple project categories (Web, Mobile, AI, etc.)
  - Required skills matching
  - Member management
  - Project status tracking (Recruiting, InProgress, Completed)

- **Social Networking**
  - Friend request system
  - User discovery
  - Profile viewing
  - University-based connections

- **Real-time Chat**
  - Direct messaging between friends
  - Real-time message delivery using SignalR
  - Message read status tracking
  - Conversation history
  - Unread message counts
  - Online/offline status

### Advanced Features
1. **Theme Switching**
   - Light/dark mode support
   - Persistent theme preferences
   - Responsive UI components

2. **WebSocket Integration (SignalR)**
   - Real-time chat functionality
   - Connection state management
   - Multiple device support
   - Automatic reconnection
   - Connection cleanup

3. **State Management with Redux**
   - Centralized state management
   - Auth state persistence
   - Project state management
   - Theme state management
   - Skill board state management

4. **Docker Containerization**
   - Multi-container application setup
   - Development and production configurations
   - Easy deployment process

## 🛠 Technology Stack

### Frontend
- **Core**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Ant Design
- **Styling**: CSS-in-JS with theme support
- **Routing**: React Router v6
- **Real-time**: SignalR client
- **HTTP Client**: Axios with interceptors
- **Form Handling**: Formik with Yup validation

### Backend
- **Framework**: .NET 8
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT with refresh tokens
- **Real-time**: SignalR
- **API Documentation**: Swagger/OpenAPI
- **Validation**: FluentValidation
- **Security**: 
  - BCrypt password hashing
  - HTTPS enforcement
  - CORS configuration
  - XSS protection
  - SQL injection prevention

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- .NET 8 SDK
- SQL Server
- Docker (optional)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with necessary environment variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update the connection string in appsettings.json:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Your_SQL_Server_Connection_String"
     },
     "Jwt": {
       "Key": "Your_Secret_Key_Here",
       "Issuer": "LinkUp",
       "Audience": "LinkUpUsers"
     }
   }
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

### Docker Setup
1. Build and run using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## 🌐 API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user info
- POST /api/auth/change-password - Change password

### Users
- GET /api/users - Get all users
- GET /api/users/{id} - Get user by ID
- PUT /api/users/{id} - Update user profile

### Projects
- GET /api/projects - Get all projects with filters
- POST /api/projects - Create new project
- GET /api/projects/{id} - Get project details
- PUT /api/projects/{id} - Update project
- DELETE /api/projects/{id} - Delete project
- POST /api/projects/{id}/join - Join project
- POST /api/projects/{id}/leave - Leave project

### Friends
- GET /api/friends - Get friend list
- POST /api/friends/request - Send friend request
- PUT /api/friends/accept/{id} - Accept friend request
- DELETE /api/friends/{id} - Remove friend

### Messages
- GET /api/messages/{userId} - Get chat history
- POST /api/messages - Send message
- GET /api/messages/conversations - Get user conversations
- PUT /api/messages/{id}/read - Mark message as read
- GET /api/messages/unread-count - Get unread message count

### SkillBoard
- GET /api/skillboard - Get current user's skill board
- GET /api/skillboard/user/{userId} - Get user's skill board
- POST /api/skillboard - Create skill board
- PUT /api/skillboard - Update skill board
- DELETE /api/skillboard - Delete skill board

## 🔒 Security Features

- JWT-based authentication with refresh token rotation
- Password hashing using BCrypt with work factor 12
- HTTPS enforcement in production
- Cross-Origin Resource Sharing (CORS) configuration
- Input validation using FluentValidation
- SQL injection prevention through Entity Framework Core
- XSS protection through proper encoding
- Rate limiting for sensitive endpoints
- Secure WebSocket connections with authentication

## 🧪 Testing

- Unit tests for backend services
- Integration tests for API endpoints
- Frontend component testing
- End-to-end testing capabilities
- WebSocket connection testing

## 📝 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/      # Authentication components
│   │   ├── chat/      # Chat related components
│   │   ├── common/    # Shared components
│   │   ├── projects/  # Project related components
│   │   └── user/      # User related components
│   ├── pages/         # Page components
│   ├── services/      # API service layers
│   ├── store/         # Redux store and slices
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
```

### Backend Structure
```
backend/
├── Controllers/    # API endpoints
├── Models/        # Data models
├── Services/      # Business logic
├── Data/          # Database context
├── Hubs/          # SignalR hubs
├── Middleware/    # Custom middleware
├── Validators/    # Request validators
└── Migrations/    # Database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Microsoft Student Accelerator Program
