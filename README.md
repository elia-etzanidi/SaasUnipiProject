# SaaS Unipi Project

## REST API

This repository contains a Node.js REST API using Express, Prisma (PostgreSQL), and Swagger for the documentation.

### Prerequisites

- Node.js (v20 or higher)
- Postgresql (if running locally without Docker)

OR

- Docker & docker compose

### Installation

1. Navigate to the `rest_api` directory:
   ```bash
   cd rest_api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file based on `.env.example`.
   - **Crucial: Set `DATABASE_URL` correctly.**
     - **For Docker**: ensure the host is `db` (e.g., `postgresql://postgres:admin@db:5432/db?schema=public`).
     - **For Local Development**: ensure the host is `localhost` (e.g., `postgresql://postgres:admin@localhost:5432/db?schema=public`).

### Running with Docker (Recommended)

Start the API and PostgreSQL database using Docker Compose:

```bash
docker-compose up --build
```

- **API URL**: `http://localhost:3000`
- **Database**: Port `5432`

### Running Locally

1. Ensure your PostgreSQL database is running.
2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### API Documentation

The API documentation is available via Swagger UI at:

- `http://localhost:3000/api-docs`

### Testing

> [!IMPORTANT]
> The HTTPie tests in `rest_api/tests/httpie-collection-to-do-list-api.json` need to be updated with valid UUIDs and Auth Tokens from your current session to work correctly.
