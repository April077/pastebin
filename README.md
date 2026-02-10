# Pastebin-Lite

A simple Pastebin-like application that allows users to create text pastes and share a link to view them. Pastes can optionally expire after a certain time (TTL) or after a maximum number of views. This project was built as part of a take-home assignment and is designed to pass automated tests.

---

## Features

- Create a paste with arbitrary text
- Generate a shareable URL for the paste
- View pastes via a public link
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Persistent storage (no in-memory state)
- Deterministic time handling for testing

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Backend:** Next.js API routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS

---

## Persistence Layer

This application uses **PostgreSQL** as the persistence layer, accessed through **Prisma ORM**. A persistent database is required because the application runs on a serverless platform and must retain data across requests. In-memory storage is not used.

---

## API Routes

### Health Check

```
GET /api/healthz
```

Returns HTTP 200 with JSON confirming the application can access its database.

---

### Create a Paste

```
POST /api/pastes
```

**Request body**

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

* `content` is required and must be a non-empty string
* `ttl_seconds` is optional and must be an integer ≥ 1
* `max_views` is optional and must be an integer ≥ 1

**Response**

```json
{
  "id": "string",
  "url": "https://<domain>/p/<id>"
}
```

---

### Fetch a Paste (API)

```
GET /api/pastes/:id
```

Returns the paste content along with remaining views and expiry time. Each successful API fetch counts as one view. Expired or unavailable pastes return HTTP 404.

---

### View a Paste (HTML)

```
GET /p/:id
```

Returns an HTML page displaying the paste content. If the paste is unavailable, HTTP 404 is returned.

---

## Deterministic Time for Testing

To support automated TTL testing:

* If the environment variable `TEST_MODE=1` is set
* And the request includes the header:

```
x-test-now-ms: <timestamp_in_milliseconds>
```

Then this value is treated as the current time **for expiry logic only**. If the header is not present, real system time is used.

---

## Running the Project Locally

### 1. Install dependencies

```bash
yarn install
```

### 2. Set environment variables

Create a `.env` file:

```env
DATABASE_URL=your_postgres_connection_string
```

### 3. Sync the database schema

```bash
npx prisma db push
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Notes

* No secrets or credentials are committed to the repository
* No hardcoded absolute URLs are used
* The application is safe to deploy on serverless platforms such as Vercel

---

## Author

Tanmay Majee