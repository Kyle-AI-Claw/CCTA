# CCTA - Coin Collection Tracker Application

A secure, Docker-based web application for tracking coin collections with comprehensive features including image management, tags, search, and statistics.

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose

### Installation

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

## Features

- 🏺 **Coin Management** - Create, view, edit, and delete coin entries
- 🔒 **Secure Authentication** - JWT-based auth with refresh tokens
- 🖼️ **Image Upload** - Upload and process coin images with Sharp
- 🏷️ **Tag System** - Organize coins with custom tags
- 🔍 **Search & Filter** - Advanced filtering by country, year, metal, grade
- 📊 **Statistics Dashboard** - Collection analytics and insights
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + Vite + Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Image Processing:** Sharp
- **Authentication:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Zod

## License

MIT
