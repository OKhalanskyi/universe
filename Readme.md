# GitHub Projects CRM

A comprehensive project management system for organizing and monitoring GitHub repositories.

## Overview

GitHub Projects CRM is a full-stack application designed to help developers and teams manage their GitHub repositories in an organized way. The system allows users to group repositories into projects, track key metrics such as stars, forks, and open issues, and keep everything up-to-date with GitHub's latest data.

## Features

- **User Authentication**: Register, login with email/password, or authenticate via GitHub OAuth
- **Repository Management**:
    - Add repositories by simply entering the path (e.g., `facebook/react`)
    - Automatic data retrieval from GitHub API
    - Track stars, forks, and open issues
    - Refresh repository data with a single click
- **Project Organization**:
    - Create custom projects to group related repositories
    - Assign/unassign repositories to projects
    - View all repositories within a project
- **User-friendly Interface**:
    - Clean dashboard showing all your projects and repositories
    - Detailed views for each repository with key metrics
- **API Documentation**: Comprehensive Swagger documentation

## Tech Stack

### Backend (NestJS)
- TypeScript
- Prisma ORM
- JWT Authentication
- GitHub OAuth integration
- RESTful API
- Swagger documentation

### Frontend (Next.js)
- TypeScript
- Next.js
- React-query for data fetching
- ShadCn UI for UI components

## Getting Started

### Prerequisites

- Docker and Docker Compose
- GitHub OAuth application (for GitHub integration)

### Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/okhalanskyi/universe.git
   cd github-projects-crm
   ```

2. **Environment Configuration**

   Create a `.env` file in the root directory with the correct variables:


3. **Start the application with Docker Compose**
   ```bash
   docker compose up
   ```

4. **Access the application**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:3001/api](http://localhost:3001/api)
    - API Documentation: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Backend Modules

- **Auth Module**: Handles user registration, authentication, and GitHub OAuth
- **Project Module**: Manages the creation and organization of projects
- **GitHub Repository Module**: Handles repository tracking and GitHub API integration

### Frontend Structure

- APP router
- Modules with (API, models, and UI components)
- Shared layer
- Configuration

## API Documentation

The API is fully documented using Swagger. You can access the documentation at [http://localhost:3001/api/docs](http://localhost:3001/api/docs) when the application is running.

Key endpoints include:

- **Authentication**:
    - `POST /api/auth/register` - Register a new user
    - `POST /api/auth/login` - Login with email/password
    - `GET /api/auth/github` - GitHub OAuth authentication
    - `GET /api/auth/me` - Get current user info

- **Projects**:
    - `GET /api/projects` - List all projects
    - `POST /api/projects` - Create a new project
    - `GET /api/projects/:id` - Get project details
    - `PATCH /api/projects/:id` - Update a project
    - `DELETE /api/projects/:id` - Delete a project

- **Repositories**:
    - `GET /api/repositories` - List all repositories
    - `POST /api/repositories` - Add a new repository
    - `GET /api/repositories/:id` - Get repository details
    - `PATCH /api/repositories/:id` - Update repository (e.g., assign to project)
    - `POST /api/repositories/:id/refresh` - Refresh data from GitHub
    - `DELETE /api/repositories/:id` - Remove a repository
    - `POST /api/repositories/sync` - Sync repositories from GitHub account

## Development

### Backend Development

The backend is a NestJS application with the following structure:

```
backend/
├── src/
│   ├── auth/             # Authentication module
│   ├── project/          # Project management module
│   ├── github-repository/ # GitHub repository module
│   ├── prisma/           # Database connection
│   ├── config/           # Configuration files
│   ├── user/             # User management module
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
```

### Frontend Development

The frontend is a Next.js application with the following structure:

```
frontend/
├── public/              # Static assets
├── src/
│   ├── modules/      # Modules with API, models, and UI components
│   ├── app/           # Router
│   ├── config/        # Configuration files
│   ├── shared/           # Shared components and utilities
│   ├── widgets/          # Reusable UI components
```

## Docker Compose Configuration

The project includes a `docker-compose.yml` file that sets up:

- PostgreSQL database
- Backend NestJS service
- Frontend Next.js service
- Proper networking between services
- PGAdmin for database management
