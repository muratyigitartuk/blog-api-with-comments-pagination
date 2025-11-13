## Overview
A phase-by-phase plan to build a scalable Blog REST API using Node.js, Express, PostgreSQL (Prisma), JWT authentication, optional Cloudinary uploads, and clean modular architecture. The repository currently has no files, so the plan includes bootstrapping.

## Architecture & Conventions
- Layered modules: `controller` → `service` → `repository` (Prisma) → `db`
- Common middleware: auth (JWT), validation, error handler, rate limiting, logging
- RESTful routes, consistent status codes, and unified error/response format
- Pagination pattern: `?page=1&limit=10` with `meta` object: `{ page, limit, totalItems, totalPages, hasNext, hasPrev }`
- Query features: filter (authorId), search (title substring), sort (`createdAt desc` default; configurable)
- Entities: `User`, `Post`, `Comment`, `Like` (many-to-many: User↔Post)

## Phase 0: Project Bootstrap
1. Initialize project: Node.js with optional TypeScript, ESLint/Prettier
2. Install core deps: `express`, `cors`, `helmet`, `morgan`, `dotenv`
3. Auth & security: `bcrypt`, `jsonwebtoken`, rate limiter (`express-rate-limit`)
4. Validation: `zod` or `express-validator` (choose one)
5. ORM: `prisma`, `@prisma/client`; setup PostgreSQL connection in `.env`
6. Optional uploads: `cloudinary`, `multer` (or direct SDK upload)
7. Scripts: `dev`, `build`, `start`, `prisma:migrate`, `prisma:seed`, `test`

## Phase 1: Database Schema (Prisma)
Define models and relations, with indexes for performance and constraints for integrity.
```prisma
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  username   String   @unique
  password   String
  posts      Post[]
  comments   Comment[]
  likes      Post[]   @relation("Likes", references: [id])
  createdAt  DateTime @default(now())
}

model Post {
  id         Int       @id @default(autoincrement())
  title      String
  body       String
  imageUrl   String?
  author     User      @relation(fields: [authorId], references: [id])
  authorId   Int
  comments   Comment[]
  likedBy    User[]    @relation("Likes")
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Comment {
  id         Int      @id @default(autoincrement())
  body       String
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  author     User     @relation(fields: [authorId], references: [id])
  authorId   Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```
- Add indexes: `Post(title)`, `Post(createdAt)`, `Comment(postId, createdAt)`
- Seed users, posts, comments for development

## Phase 2: App Skeleton
- `src/server.ts`: Express app, JSON parsing, CORS, Helmet, request logging
- Global error handler with consistent payload `{ message, code, details }`
- `src/config/env.ts`: loads env vars (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`)
- `src/db/prisma.ts`: singleton Prisma client with graceful shutdown
- Project structure:
  - `src/modules/auth`, `users`, `posts`, `comments`, `likes`
  - Each: `controller.ts`, `service.ts`, `repository.ts`, `validators.ts`, `routes.ts`
  - `src/middleware`: `auth.ts`, `validate.ts`, `error.ts`, `rateLimit.ts`
  - `src/utils`: pagination helpers, build query options

## Phase 3: Authentication & Users
- Endpoints:
  - `POST /auth/register` → create user (hash password)
  - `POST /auth/login` → verify credentials, issue JWT
  - `GET /users/me` → current user profile
- JWT middleware: verifies `Authorization: Bearer <token>`
- Password hashing: bcrypt with salt
- Validation: email, username, password policy

## Phase 4: Posts CRUD + Pagination/Query
- Endpoints:
  - `POST /posts` (auth) → create
  - `GET /posts` → list with `page`, `limit`, `search`, `authorId`, `sortBy`, `sortOrder`
  - `GET /posts/:id` → detail (include comment count, like count)
  - `PATCH /posts/:id` (owner) → update
  - `DELETE /posts/:id` (owner) → delete
- Implement pagination helper returning `{ data, meta }`
- Search by title: case-insensitive substring filter
- Sorting: default `createdAt desc`, allow `createdAt`, `title`

## Phase 5: Comments CRUD + Pagination
- Endpoints:
  - `POST /posts/:id/comments` (auth)
  - `GET /posts/:id/comments` → paginated list, newest first
  - `PATCH /comments/:id` (author)
  - `DELETE /comments/:id` (author or post owner)
- Enforce ownership authorization in services

## Phase 6: Like/Unlike System
- Endpoints:
  - `POST /posts/:id/like` (auth) → idempotent; no duplicate likes
  - `POST /posts/:id/unlike` (auth) → idempotent; no error if not liked
- Return updated like count
- Implementation: many-to-many relation; use connect/disconnect with existence checks

## Phase 7: Optional Image Uploads (Cloudinary)
- Configure Cloudinary credentials via env
- Accept `multipart/form-data` for post image uploads
- On upload, store `secure_url` on `Post.imageUrl`
- Provide `DELETE /posts/:id/image` to remove image (optional)

## Phase 8: Validation, Errors, and Security Hardening
- Request validation schemas per route (zod or express-validator)
- Centralized error mapping: validation → 400, auth → 401/403, not found → 404
- Security: Helmet, CORS, rate limiting, input sanitization, pagination bounds (max `limit`)

## Phase 9: Testing
- Unit tests: services and utilities (mock Prisma)
- Integration tests: routes with in-memory/test DB, using Supertest
- Seed/reset DB per test suite; CI workflow to run tests and Prisma migrations

## Phase 10: Documentation
- Auto-generated OpenAPI (Swagger) or a Postman collection
- `GET /docs` served via Swagger UI (if chosen)
- Include examples of pagination, search, sort, like/unlike

## Phase 11: Observability & Ops
- Logging: request logs with `morgan`, structured app logs (`pino` optional)
- Health check: `GET /health` reports DB connectivity
- Graceful shutdown: close Prisma on SIGINT/SIGTERM

## Phase 12: Deployment
- Environment configuration for production
- Database migrations and seed strategy
- Optional Docker: `Dockerfile`, `docker-compose.yml` (app + Postgres)
- CI/CD pipeline: install, prisma generate/migrate, tests, build, deploy

## Phase 13: Deliverables & Acceptance Criteria
- Functional endpoints for users, posts, comments, likes with pagination/search/sort
- Prisma schema with migrations and seed
- JWT auth working with protected routes and ownership rules
- Validation + global error handling + security middleware
- Tests passing for core features; API docs available at `/docs`

## Next Steps
- Confirm TypeScript vs JavaScript preference
- Confirm validation library choice
- Confirm whether to include Swagger and Docker in scope