VoteSecure - Voting application
<img width="1896" height="924" alt="image" src="https://github.com/user-attachments/assets/ef2ef66d-4210-4b50-b9b4-934effad6eac" />


Secure Online Voting Platform:--
VoteSecure is a modern, full-stack online voting application designed to provide a secure, transparent, and efficient digital voting experience. It incorporates industry-standard authentication, authorization, and security practices while delivering a responsive and user-friendly interface.
The platform enables authenticated users to participate in elections securely, while administrators can manage elections, candidates, and results through a dedicated dashboard.

Overview:--
Traditional voting systems often face challenges related to accessibility, scalability, and security. VoteSecure addresses these issues by providing a secure web-based platform that supports authenticated voting, role-based access control, and efficient election management.
The application follows modern web development practices with a focus on performance, security, and maintainability.

Features:

Authentication

- Secure JWT Authentication
- Google OAuth Login
- Email & Password Registration
- Protected Routes
- Persistent User Sessions
- Role-Based Access Control (RBAC)

Voting System

- Create and Manage Elections
- Candidate Management
- Secure Vote Casting
- One Vote Per User
- Live Election Status
- Election Result Management

Security

- CSRF Protection
- HTTP-only Cookies
- Password Hashing (bcrypt)
- Secure Authentication Middleware
- Input Validation
- XSS Protection
- CORS Configuration
- Secure REST APIs

Dashboard

- Admin Dashboard
- User Dashboard
- Election Analytics
- Candidate Overview
- User Management
- Election Monitoring

Performance

- Redis Caching
- Optimized API Responses
- Efficient Database Queries
- Scalable Backend Architecture

Technology Stack:

Frontend:--

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- TanStack Query
- Zustand

Backend:--

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Passport.js
- Google OAuth
- Redis
- Express Session
- Cookie Parser
- bcrypt


Project Structure:

VoteSecure/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── assets/
│
├── docs/
├── screenshots/
└── README.md


Getting Started:

Prerequisites:--

- Node.js 18+
- MongoDB
- Redis
- npm

Clone Repository:--

git clone https://github.com/yourUsername/yourRepository.git

cd votesecure

Backend Installation:

cd backend

npm install

Create a .env file

env
PORT=yourPortnumber

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

REDIS_URL=your_redis_connection

CLIENT_URL=http://localhost:yourportnumber

Run the backend:

npm run dev

Frontend Installation:-

cd frontend

npm install

npm run dev


Application Workflow:--

User
   │
   ▼
Login / Register
   │
   ▼
Authentication
   │
   ▼
Dashboard
   │
   ▼
Browse Elections
   │
   ▼
Cast Vote
   │
   ▼
Vote Verification
   │
   ▼
Election Results

Security Features:
- JWT Authentication
- Google OAuth
- Role-Based Authorization
- CSRF Protection
- HTTP-only Cookies
- Password Encryption
- Redis Session Management
- Input Validation
- Protected Routes
- Secure API Architecture

Contributing:

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

git checkout -b feature/new-feature

3. Commit your changes
git commit -m "Add new feature"

4. Push your branch

git push origin feature/new-feature

License
This project is licensed under the MIT License.

Author:-

Ujjwal Singh

BSc-IT Student | Javascript Developer | Backend Developer

If you found this project helpful, consider giving it a ⭐ on GitHub.
