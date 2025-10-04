# Radlands Game Companion App

## Overview

The Radlands Game Companion is a web application designed to assist players of the Radlands board game by providing digital tracking and management tools. The application tracks game state, water resources, event queues, board positions, and provides a searchable card database. Built as a full-stack solution with a React frontend and Flask backend, it aims to streamline gameplay by replacing physical trackers with an intuitive digital interface.

**Current Status (October 04, 2025):**
- ✅ Ambiente completo instalado e funcionando
  - Python 3.11.13 (requerido: >= 3.11)
  - Node.js v20.19.3
  - Todas as dependências instaladas (Flask, React, Vite, etc.)
- ✅ Backend Flask API totalmente implementado e rodando (porta 8000)
- ✅ Frontend React + Vite rodando (porta 5000)
- ✅ Integração frontend-backend funcionando via proxy
- ✅ Workflows configurados e ativos
- ✅ Deploy configurado para Render com PostgreSQL
- ✅ Banco de dados SQLite local para desenvolvimento
- 📝 Pronto para desenvolvimento e expansão de features

## User Preferences

Preferred communication style: Simple, everyday language.

## About Radlands

Radlands is a competitive card game where players protect three unique camps while trying to destroy their opponent's camps. The game features:

- **Water Management**: Main resource used to play cards and activate abilities
- **Event System**: Timed events with countdown mechanics (3-space queue)
- **Board Columns**: 3 columns per player, max 2 people per column
- **Card Types**: 
  - People cards (with abilities and traits)
  - Event cards (with bomb countdown)
  - Camp cards (unique starting positions)
  - Punks (facedown people with no abilities)
- **Game Phases**: Events → Replenish → Actions
- **Expansions**: Base game + Cult of Chrome expansion supported

**Key Mechanics:**
- Damage system (damaged → destroyed)
- Ready/damaged states for people
- Unprotected cards (no cards in front)
- Junk effects (quick card discard effects)
- Water disc tracking (3 per turn + extras)

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom post-apocalyptic theme (wasteland orange, steel blue, radioactive green)
- **State Management**: React hooks and TanStack Query for server state
- **Routing**: React Router DOM for client-side navigation

**Design Pattern:**
The frontend follows a component-based architecture with reusable UI primitives. Key features are organized into dedicated components:
- `WaterTracker`: Manages player water resources with increment/decrement controls
- `EventQueue`: Displays and advances game events chronologically
- `BoardColumn`: Represents individual game board columns with card slots
- Pages are organized in `src/pages/` with clear separation between setup, game tracking, and card database views

**Rationale:**
React was chosen for its component reusability and excellent TypeScript support. Vite provides faster development cycles compared to traditional bundlers. The shadcn/ui approach allows for customizable components while maintaining consistency.

**Mobile Considerations:**
The app includes viewport meta tags and responsive breakpoints, with a dedicated mobile hook (`use-mobile.tsx`) for responsive behavior. The design accommodates touch interactions suitable for tablet gameplay.

### Backend Architecture

**Technology Stack:**
- **Framework**: Flask 3.x (Python)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy integration
- **Database**: SQLite for development, PostgreSQL for production (Render deployment)
- **CORS**: Flask-CORS for frontend-backend communication
- **Server**: Gunicorn for production deployment

**Design Pattern:**
The backend uses a Blueprint-based modular architecture:
- `backend/__init__.py`: Application factory pattern with database initialization
- `backend/models.py`: SQLAlchemy models (Game, BoardState, GameEvent, Card)
- `backend/routes.py`: RESTful API endpoints under `/api` prefix

**API Structure:**
- `GET /api/health`: Health check endpoint
- `POST /api/games`: Create new game sessions
- `GET /api/games/<id>`: Retrieve game state with full board state
- `POST /api/games/<id>/water`: Update water tracker
- `POST /api/games/<id>/events`: Add events to queue
- `DELETE /api/games/<id>/events/<event_id>`: Remove events
- `PUT /api/games/<id>/board`: Update board columns and camps
- `POST /api/games/<id>/turn`: Advance to next turn
- `GET /api/cards`: Get card database (with search)
- `POST /api/cards/seed`: Seed sample cards

**Rationale:**
Flask was selected for its simplicity and flexibility, allowing rapid development of a RESTful API. SQLAlchemy provides database abstraction, making it easy to switch between SQLite (dev) and PostgreSQL (prod). The Blueprint pattern enables modular code organization as features expand.

**Alternatives Considered:**
FastAPI was considered for automatic API documentation and async support, but Flask's maturity and simpler learning curve made it more suitable for this project scope.

### Data Storage

**Database Schema:**

**Game Table:**
- Tracks game sessions with player names, status, and timestamps
- One-to-one relationship with BoardState
- One-to-many relationship with GameEvents

**BoardState Table:**
- Stores current game state including water levels for both players
- JSON columns for flexible storage of camps and columns (arrays of card positions)
- Tracks current player and turn number

**GameEvent Table:**
- Represents events in the event queue
- Links to specific games with position ordering
- Stores event metadata (name, water cost, effects)

**Card Table:**
- (Schema incomplete in provided code) Will store card database with traits, abilities, costs

**Rationale:**
The relational model fits the structured nature of game state. JSON columns provide flexibility for complex nested data (card arrays in columns) while maintaining relational integrity for game sessions. This hybrid approach balances normalization with practical flexibility.

**Migration Strategy:**
SQLAlchemy's `db.create_all()` handles initial schema creation. For production, Alembic migrations would be recommended for schema evolution.

### Authentication and Authorization

**Current State:**
No authentication is currently implemented. The application is designed for local/shared gameplay sessions.

**Future Considerations:**
If multi-user or persistent sessions are needed:
- Flask-JWT-Extended for token-based authentication
- User table linking to game sessions
- Session-based authorization for game access

**Rationale:**
Authentication was deferred as the primary use case is single-device, two-player gameplay where both players share the same screen/device.

## External Dependencies

### Third-Party Services

**Deployment Platform:**
- **Render**: Configured for both web service (Flask app) and PostgreSQL database
- Environment variables: `DATABASE_URL`, `SECRET_KEY`, `FLASK_ENV`
- Build script (build.sh) handles both frontend (npm build) and backend (pip install) dependencies
- **Deployment Files:**
  - `Procfile`: Gunicorn start command
  - `runtime.txt`: Python 3.11 version
  - `build.sh`: Build script for frontend and backend
  - `requirements.txt`: Python dependencies including psycopg2-binary
  - `DEPLOY_RENDER.md`: Complete deployment instructions

**Static File Serving:**
Flask is configured to serve the Vite build output (dist/) in production. The catch-all route ensures React Router works correctly for SPA routing.

**Rationale:**
Render provides integrated PostgreSQL hosting and automatic HTTPS, simplifying deployment compared to managing separate services. Single Gunicorn instance serves both API and frontend.

### Frontend Libraries

**UI Framework:**
- **Radix UI**: Accessible, unstyled component primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component implementations using Radix primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

**Utilities:**
- **TanStack Query**: Server state management and caching
- **React Router DOM**: Client-side routing
- **React Hook Form** + **Zod**: Form handling and validation (via @hookform/resolvers)
- **date-fns**: Date manipulation
- **sonner**: Toast notifications

**Rationale:**
This stack prioritizes accessibility (Radix), developer experience (TypeScript, Tailwind), and modern React patterns (hooks, query caching). The component library approach ensures UI consistency while allowing customization for the Radlands theme.

### Backend Libraries

**Core:**
- **Flask**: Web framework
- **SQLAlchemy**: ORM and database toolkit
- **psycopg2-binary**: PostgreSQL adapter
- **python-dotenv**: Environment variable management

**Production:**
- **Gunicorn**: WSGI HTTP server for production deployment
- **Flask-CORS**: Cross-origin resource sharing

**Rationale:**
These are standard, well-maintained libraries in the Python ecosystem. Gunicorn provides robust production serving, while Flask-CORS enables the decoupled frontend-backend architecture.

### Development Tools

- **TypeScript**: Type safety for frontend code
- **ESLint**: Code linting with TypeScript support
- **Vite**: Development server with hot module replacement
- **PostCSS**: CSS processing with Tailwind

**Proxy Configuration:**
Vite dev server proxies `/api` requests to `localhost:8000` (Flask backend) for seamless local development.

**Development Workflows:**
- **Frontend**: `npm run dev` on port 5000 (Vite dev server)
- **Backend**: `python app.py` on port 8000 (Flask debug mode)
- Both workflows run simultaneously for full-stack development

### Static Assets and CDN

**Fonts:**
- Google Fonts (Inter font family) loaded via preconnect for performance
- Served from `fonts.googleapis.com` and `fonts.gstatic.com`

**Meta Tags:**
- Open Graph and Twitter Card metadata configured for social sharing
- Custom theme colors for mobile browsers