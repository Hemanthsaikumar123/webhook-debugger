# 🪝 Webhook Debugger

A developer-friendly tool for capturing, inspecting, and replaying webhooks. Perfect for testing integrations, debugging webhook payloads, and developing webhook-based applications locally.

## ✨ Features

- **Capture webhooks** - Receive webhooks from any service using unique project endpoints
- **Inspect payloads** - View full request details including headers, body, and metadata
- **Replay webhooks** - Re-send captured webhooks to test your integrations
- **Project-based organization** - Separate webhooks by project with custom slugs
- **Real-time UI** - Modern React interface for browsing and managing webhooks
- **Forward webhooks** - Automatically forward incoming webhooks to your local server
- **PostgreSQL storage** - Persist all webhook data for later inspection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/webhook-debugger.git
cd webhook-debugger
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd ui
npm install
cd ..
```

4. **Set up environment variables**

Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/webhook_debugger
```

5. **Set up the database**

Create the PostgreSQL database and tables:

```sql
CREATE DATABASE webhook_debugger;

-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    forward_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create webhooks table
CREATE TABLE webhooks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    method VARCHAR(10),
    headers JSONB,
    body JSONB,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    forwarded_status INTEGER,
    forwarded_response TEXT
);
```

6. **Start the backend server**
```bash
npm run dev
```

7. **Start the frontend (in a new terminal)**
```bash
cd ui
npm run dev
```

8. **Open the app**

Navigate to `http://localhost:5173` to access the UI.

## 📖 Usage

### Creating a Project

1. Insert a project into the database:
```sql
INSERT INTO projects (name, slug, forward_url) 
VALUES ('My App', 'my-app', 'http://localhost:3000/webhook');
```

2. Your webhook endpoint will be: `http://localhost:4000/webhooks/my-app`

### Receiving Webhooks

Send webhooks to your project endpoint:

```bash
curl -X POST http://localhost:4000/webhooks/my-app \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": "hello world"}'
```

### Viewing Webhooks

1. Open the UI at `http://localhost:5173`
2. Click on your project
3. Browse all received webhooks
4. Click on a webhook to see full details

### Replaying Webhooks

1. Open a webhook in the UI
2. Click the "🔄 Replay Webhook" button
3. The webhook will be re-sent to your configured forward URL

## 🛠️ API Endpoints

### Projects

- `GET /projects` - List all projects
- `GET /projects/:slug` - Get project by slug

### Webhooks

- `POST /webhooks/:slug` - Receive a webhook (captures all data)
- `GET /webhooks/:slug` - List webhooks for a project
- `GET /webhooks/:slug/:id` - Get specific webhook details
- `POST /webhooks/:id/replay` - Replay a webhook

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL
- Axios for webhook forwarding

**Frontend:**
- React 18
- React Router
- Vite
- Modern CSS with CSS Variables

## 📁 Project Structure

```
webhook-debugger/
├── src/
│   ├── app.js              # Express server setup
│   ├── db.js               # PostgreSQL connection
│   ├── controllers/        # Route handlers
│   │   ├── webhook.controller.js
│   │   ├── project.controller.js
│   │   ├── replay.controller.js
│   │   └── read.controller.js
│   └── routes/             # API routes
│       ├── webhook.routes.js
│       └── project.routes.js
├── ui/                     # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── package.json
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |

### Forward URLs

Set a `forward_url` for your project to automatically forward webhooks to your local development server:

```sql
UPDATE projects 
SET forward_url = 'http://localhost:3000/webhook' 
WHERE slug = 'my-app';
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

ISC

## 🐛 Troubleshooting

**Database connection issues:**
- Verify PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Ensure the database and tables exist

**Webhooks not appearing:**
- Check the backend server is running on the correct port
- Verify the project slug exists in the database
- Check browser console and server logs for errors

**Forward URL not working:**
- Ensure your local server is running
- Check the `forward_url` is correct in the database
- Verify the target endpoint can accept POST requests

---

Built with ❤️ for developers who need to debug webhooks locally
