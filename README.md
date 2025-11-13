# Blog API with Comments & Pagination

## Overview
Build a scalable REST API using Node.js, Express, PostgreSQL (Prisma), JWT auth, optional Cloudinary uploads, and modular architecture.

## Stack
- Node.js + Express
- PostgreSQL via Prisma
- JWT authentication
- Optional Cloudinary for image uploads

## Architecture
```mermaid
flowchart LR
  Client -->|HTTP| Router
  Router --> Controllers
  Controllers --> Services
  Services --> Repository
  Repository --> Prisma
  Prisma --> Postgres[(PostgreSQL)]

  subgraph Middleware
    AuthJWT
    Validate
    ErrorHandler
    RateLimit
  end

  Router --> Middleware
```

### Modules
- `auth`: register, login
- `users`: current user profile
- `posts`: CRUD, pagination, search, sorting, like/unlike, image upload
- `comments`: nested under posts with pagination

## Database Schema (Prisma)
```mermaid
erDiagram
  User ||--o{ Post : writes
  User ||--o{ Comment : writes
  User }o--o{ Post : likes
  Post ||--o{ Comment : has

  User {
    Int id
    String email
    String username
    String password
    DateTime createdAt
  }
  Post {
    Int id
    String title
    String body
    String imageUrl
    Int authorId
    DateTime createdAt
    DateTime updatedAt
  }
  Comment {
    Int id
    String body
    Int postId
    Int authorId
    DateTime createdAt
    DateTime updatedAt
  }
```

## Endpoints
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Users
  - `GET /api/users/me` (auth)
- Posts
  - `POST /api/posts` (auth)
  - `GET /api/posts?search=&authorId=&page=&limit=&sortBy=createdAt|title&sortOrder=asc|desc`
  - `GET /api/posts/:id`
  - `PATCH /api/posts/:id` (owner)
  - `DELETE /api/posts/:id` (owner)
  - `POST /api/posts/:id/like` (auth)
  - `POST /api/posts/:id/unlike` (auth)
  - `POST /api/posts/:id/image` (auth, multipart field `image`)
  - `DELETE /api/posts/:id/image` (auth)
- Comments
  - `POST /api/posts/:id/comments` (auth)
  - `GET /api/posts/:id/comments?page=&limit=`
  - `PATCH /api/posts/:id/comments/:commentId` (author)
  - `DELETE /api/posts/:id/comments/:commentId` (author or post owner)

## Pagination
- Query params: `page` (default 1), `limit` (default 10, max 100)
- Response includes `meta`: `{ page, limit, totalItems, totalPages, hasNext, hasPrev }`

## Setup
1. Create `.env` from `.env.example` and set:
   - `DATABASE_URL=postgresql://user:password@localhost:5432/blogdb?schema=public`
   - `JWT_SECRET=your-secret`
   - Optional `CLOUDINARY_URL`
2. Install dependencies: `npm install`
3. Prisma:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
4. Dev server: `npm run dev`

## Quickstart
- Configure `.env` and run migrations and seed as above.
- Start server: `npm run dev`
- Try the flow with curl:
```
# Register
curl -s -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","username":"user","password":"password123"}'

# Login and capture token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r .token)

# Create a post
curl -s -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Hello","body":"World"}'

# List posts (paginated)
curl -s 'http://localhost:3000/api/posts?page=1&limit=10&search=hello&sortBy=createdAt&sortOrder=desc'

# Add a comment
curl -s -X POST http://localhost:3000/api/posts/1/comments \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"body":"Nice!"}'

# Like a post
curl -s -X POST http://localhost:3000/api/posts/1/like -H "Authorization: Bearer $TOKEN"

# Health check
curl -s http://localhost:3000/health
```

## Environment Variables
| Name | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/blogdb?schema=public` |
| `JWT_SECRET` | yes | Secret for signing JWT tokens | `super-secret` |
| `CLOUDINARY_URL` | no | Cloudinary config URL | `cloudinary://api_key:api_secret@cloud_name` |
| `CORS_ORIGIN` | no | Allowed origin for CORS (`*` for any) | `http://localhost:3000` |

## Example Responses
Pagination list:
```
GET /api/posts?page=1&limit=2
{
  "data": [
    { "id": 1, "title": "Hello", "_count": { "likedBy": 0, "comments": 1 } },
    { "id": 2, "title": "Another", "_count": { "likedBy": 3, "comments": 0 } }
  ],
  "meta": {
    "page": 1,
    "limit": 2,
    "totalItems": 12,
    "totalPages": 6,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Error format:
```
{
  "message": "Validation error",
  "code": null,
  "details": [
    { "path": ["body","title"], "message": "Required" }
  ]
}
```

## Design Decisions
- Layered modules (controller/service/repository) for separation of concerns.
- Prisma relations and indexes for performance (`Post.title`, `Post.createdAt`, `Comment(postId, createdAt)`).
- Idempotent like/unlike by checking relation existence before connect/disconnect.
- Pagination bounds (`limit` max 100) to protect resources.
- Validation via Zod schemas to keep controllers slim.
- Global error handler ensures consistent payloads.

## Observability and Health
- `/health` reports process status and DB connectivity.
- Request logging via `morgan` and rate limiting to mitigate abuse.
- Graceful shutdown closes the server on `SIGINT`/`SIGTERM`.

## CI/CD (GitHub Actions)
- Typical pipeline steps:
  - Checkout, setup Node
  - `npm ci`
  - `npm run prisma:generate`
  - Set `DATABASE_URL` to ephemeral DB (or use a service container)
  - `npm test`
  - `npm run build`
- Add a status badge to the README after setting up Actions.

## Example API Usage Snippets
Get current user:
```
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users/me
```

List comments for a post:
```
curl 'http://localhost:3000/api/posts/1/comments?page=1&limit=5'
```

Upload an image to a post:
```
curl -X POST http://localhost:3000/api/posts/1/image \
  -H "Authorization: Bearer $TOKEN" \
  -F image=@/path/to/file.jpg
```

## Docker
Run Postgres and app via Compose:
```
docker compose up --build
```
App on `http://localhost:3000`, DB on `localhost:5432`.

## Testing
- Jest + ts-jest + Supertest
- Run: `npm test`
- Tests mock Prisma to avoid DB requirement.

## Security & Hardening
- Helmet, CORS (env-configurable), rate limiting
- Request validation with Zod
- Consistent error payload `{ message, code, details }`

## Notes
- Delete image only clears `imageUrl`. Configure Cloudinary and store `public_id` to support remote deletion if needed.