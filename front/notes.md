# SecureVault Setup Guide

## Project Structure

```
securevault/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── workspace_sessions.db (auto-generated)
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    │   ├── SessionManager.tsx
    │   └── BrowserViewer.tsx
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── next.config.js
    └── .env.local
```

## Backend Setup

### 1. Prerequisites
- Docker installed and running
- Python 3.11+

### 2. Installation
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Pull browser container image
docker pull selenium/standalone-chrome:4.15.0

# Run the API
python main.py
```

API will be available at `http://localhost:8000`

### 3. Test API
```bash
curl http://localhost:8000/health
```

## Frontend Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Installation
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. Environment Configuration
Create `.env.local` file:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## Usage

### 1. Login
- Enter any User ID on the login screen
- User ID is stored in localStorage

### 2. Create Session
- Enable/disable persistence
- Set expiration time
- Click "Create Session"

### 3. Control Sessions
- **View**: Open browser session in iframe
- **Pause**: Pause container execution
- **Resume**: Resume paused container
- **Stop**: Stop container (can be restarted)
- **Restart**: Restart container
- **Delete**: Permanently remove session

### 4. Browser Access
- Sessions display in embedded iframe
- Full Chrome browser accessible via VNC web interface
- Auto-refresh session list every 5 seconds

## API Endpoints

### Create Session
```bash
POST http://localhost:8000/sessions
Content-Type: application/json

{
  "user_id": "user123",
  "persistence_enabled": true,
  "expires_in_minutes": 120
}
```

### Get Session
```bash
GET http://localhost:8000/sessions/{session_id}
```

### Control Session
```bash
POST http://localhost:8000/sessions/{session_id}/start
POST http://localhost:8000/sessions/{session_id}/stop
POST http://localhost:8000/sessions/{session_id}/pause
POST http://localhost:8000/sessions/{session_id}/unpause
POST http://localhost:8000/sessions/{session_id}/restart
```

### Delete Session
```bash
DELETE http://localhost:8000/sessions/{session_id}
```

### Get User Sessions
```bash
GET http://localhost:8000/users/{user_id}/sessions
```

## Features

### Backend
- Docker container orchestration
- SQLite persistence
- Per-user session isolation
- Resource limits (2GB RAM, 2 CPU cores)
- Automatic port management
- Session lifecycle management

### Frontend
- Dark mode UI with Tailwind CSS
- Real-time session status updates
- Embedded browser viewer
- Session control panel
- User authentication (localStorage)
- Responsive design

## Production Deployment

### Backend
- Use PostgreSQL instead of SQLite
- Add authentication middleware
- Implement rate limiting
- Set up TLS/SSL
- Use Docker Swarm or Kubernetes

### Frontend
- Build production bundle: `npm run build`
- Deploy to Vercel, Netlify, or self-host
- Configure CORS on backend
- Set production API URL in environment variables

## Troubleshooting

### Container Exits Immediately
- Check Docker logs: `docker logs <container_id>`
- Ensure selenium/standalone-chrome image is pulled
- Verify sufficient system resources

### Can't Access Browser
- Wait 5-10 seconds after creation
- Check container status in session list
- Verify port is not blocked by firewall

### Sessions Not Appearing
- Verify backend API is running
- Check browser console for errors
- Confirm NEXT_PUBLIC_API_BASE is correct

## Security Notes

- Add proper authentication before production
- Implement HTTPS/TLS
- Add session token validation
- Limit container resources
- Set network isolation
- Add rate limiting
- Implement audit logging
