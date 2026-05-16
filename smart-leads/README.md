# GigFlow - Smart Leads

A modern full-stack lead management system built with React, TypeScript, Node.js, and MongoDB. Manage, track, and qualify leads efficiently with real-time analytics and role-based access control.

## Features

- **Lead Management**: Create, read, update, and delete leads with detailed information
- **Real-time Analytics**: Dashboard with lead statistics, qualification rates, and source tracking
- **Advanced Filtering**: Filter leads by status, source, date range, and search by name/email
- **Role-based Access Control**: Admin and Sales user roles with different permissions
- **Authentication**: Secure JWT-based authentication and registration
- **Export Data**: Export leads to CSV format
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Dark Mode**: Global light/dark theme with persisted preference
- **Type-safe**: Full TypeScript implementation across frontend and backend

## Tech Stack

### Frontend
- **React** 18 with TypeScript
- **Vite** - Build tool
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Local Storage** - Persisted dark mode preference

### Backend
- **Node.js** with Express.js
- **TypeScript** - Type safety
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy for frontend

## Prerequisites

- Node.js 20+ (for local development)
- MongoDB 7+ (if running locally without Docker)
- Docker & Docker Compose (for containerized setup)

## Installation

### Local Setup

1. **Clone the repository**
```bash
cd smart-leads
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

3. **Configure environment variables**

Server (`.env`):
```bash
cp server/.env.example server/.env
```

Client (`.env.local`):
```bash
cat > client/.env.local << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

Update `server/.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigflow-smart-leads
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Application

### Development Mode (Local)

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend** (from `server` directory)
```bash
cd server
npm run dev
```
The API will be available at `http://localhost:5000`

3. **Start the frontend** (from `client` directory in a new terminal)
```bash
cd client
npm run dev
```
The app will be available at `http://localhost:5173`

4. **Theme switching**
- Use the sidebar or mobile header toggle to switch between light and dark mode.
- The app saves your selected theme in `localStorage` so it persists across browser sessions.

### Production Build

**Backend**:
```bash
cd server
npm run build
npm start
```

**Frontend**:
```bash
cd client
npm run build
npm run preview
```

### Docker Compose

Run the entire application stack with Docker:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

To stop the services:
```bash
docker-compose down
```

## Project Structure

```
smart-leads/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Layout components
│   │   │   ├── leads/              # Lead components
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── context/                # React context
│   │   ├── lib/                    # API utilities
│   │   ├── types/                  # TypeScript types
│   │   └── App.tsx                 # Main app component
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                          # Express.js backend
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Express middleware
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # Utility functions
│   │   └── index.ts                # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── docker-compose.yml              # Docker services configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Leads
- `GET /api/leads` - Get all leads (with filters)
  - Query params: `status`, `source`, `search`, `page`, `limit`
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `GET /api/leads/stats` - Get lead statistics
- `GET /api/leads/export` - Export leads as CSV

### Health Check
- `GET /api/health` - API health status

## User Roles

### Admin
- View all leads across all team members
- Full CRUD operations on leads
- User management

### Sales
- View only their own leads
- Create and update their leads
- Cannot delete leads
- View team statistics

## Development Notes

### Adding New Features

1. **Backend**: Add routes in `server/src/routes/`, implement controllers in `server/src/controllers/`
2. **Frontend**: Create components in `client/src/components/`, add pages in `client/src/pages/`
3. **Database**: Update Mongoose models in `server/src/models/`
4. **Types**: Maintain TypeScript interfaces in `*/types/index.ts`

### Database Schema

**User**
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "admin" | "sales",
  createdAt: Date
}
```

**Lead**
```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  status: "New" | "Contacted" | "Qualified" | "Lost",
  source: "Website" | "Instagram" | "Referral",
  notes: String,
  assignedTo: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

- JWT tokens expire in 7 days
- Passwords are hashed with bcryptjs
- CORS is configured to restrict cross-origin requests
- Role-based authorization on backend endpoints
- Environment variables for sensitive data

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use, update the port in `.env` and vite config.

### MongoDB Connection Issues
Ensure MongoDB is running and the `MONGO_URI` in `.env` is correct.

### CORS Errors
Check that `CLIENT_URL` in server `.env` matches your frontend URL.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
npm run build
```

## License

MIT