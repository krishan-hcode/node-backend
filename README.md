# Node.js + Express — Learning Project

A beginner-friendly Node.js REST API built while learning backend development.
Covers project setup, Express routing, middleware, and REST API design.

---

## Tech Stack

- **Node.js** v24+
- **Express.js** v5
- **Nodemon** (dev only — auto restart on file changes)
- **Yarn** (package manager)

---

## Project Structure

```
node-project/
├── index.js              ← Entry point, Express app setup
├── routes/
│   └── users.js          ← All /users REST API routes
├── middleware/
│   ├── logger.js         ← Logs every request to the console
│   ├── validateUser.js   ← Validates POST/PUT body before hitting route
│   └── errorHandler.js   ← Global error handler (registered last)
├── package.json
├── yarn.lock
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start the dev server

```bash
yarn dev
```

Server runs at: `http://localhost:3000`

---

## API Endpoints

### Base

| Method | Route | Response |
|--------|-------|----------|
| GET | `/` | `{ message: 'Hello from Node.js!' }` |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get one user by ID |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

---

## Example Requests

### GET all users
```
GET http://localhost:3000/users
```

### GET one user
```
GET http://localhost:3000/users/1
```

### POST create user
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Krishan",
  "email": "krishan@example.com"
}
```

### PUT update user
```
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "name": "Krishan Updated",
  "email": "krishan@example.com"
}
```

### DELETE user
```
DELETE http://localhost:3000/users/1
```

---

## Key Concepts Learned

### 1. Express Setup
```js
const express = require('express');
const app = express();
app.use(express.json()); // parse JSON request bodies
app.listen(3000);
```

### 2. Express Router (splitting routes into files)
```js
// routes/users.js
const router = express.Router();
router.get('/', handler);
module.exports = router;

// index.js
app.use('/users', require('./routes/users'));
```

### 3. req & res (compare with Next.js)
| Next.js | Express |
|---------|---------|
| `request.json()` | `req.body` |
| `params.id` | `req.params.id` |
| `return Response.json(data)` | `res.json(data)` |
| `return new Response(null, { status: 404 })` | `res.status(404).json(...)` |

### 4. Middleware — the core of Express

Every request flows through a **pipeline** of functions before hitting your route:

```
Request → [logger] → [validateUser] → Route Handler → Response
```

Each middleware has the signature `(req, res, next)`:
- Call `next()` to pass to the next step
- Call `res.json(...)` to stop the pipeline and respond immediately

**3 types of middleware used in this project:**

| File | Type | Registered |
|------|------|------------|
| `middleware/logger.js` | Global | `app.use(logger)` — runs on every request |
| `middleware/validateUser.js` | Route-level | `router.post('/', validateUser, handler)` — only on POST/PUT |
| `middleware/errorHandler.js` | Error handler | `app.use(errorHandler)` — must be last in index.js |

**Global middleware** (logger):
```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // always call next() or the request hangs
};
app.use(logger); // before routes
```

**Route-level middleware** (validateUser):
```js
// Pass middleware as 2nd argument — runs before the handler
router.post('/', validateUser, (req, res) => { ... });

// Same middleware can be reused on multiple routes
router.put('/:id', validateUser, (req, res) => { ... });
```

**Error handler** (4 params — Express detects this automatically):
```js
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
};
app.use(errorHandler); // LAST — after all routes
```

**Triggering the error handler** from any route:
```js
router.get('/:id', (req, res, next) => {
  try {
    // ... something that might throw
  } catch (err) {
    next(err); // passes error to errorHandler
  }
});
```

### 5. HTTP Status Codes used
| Code | Meaning |
|------|---------|
| 200 | OK (default) |
| 201 | Created |
| 400 | Bad Request (validation failed) |
| 404 | Not Found |
| 500 | Internal Server Error |

### 6. Data is stored in-memory (no database yet)
```js
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
];
```
> Data resets every time the server restarts. Database comes in the next phase.

---

## What's Next (Upcoming Topics)

- [x] **Express Setup** — server, routing, CRUD
- [x] **Middleware** — logger, validation, error handling, `next()`
- [ ] **Environment Variables** — `.env` file with `dotenv`
- [ ] **Database** — MongoDB + Mongoose or PostgreSQL + Prisma
- [ ] **Authentication** — JWT login & protected routes
- [ ] **Deploy** — Railway / Render

---

## Notes

- `yarn dev` uses **nodemon** — server auto-restarts on file save
- Browser does NOT auto-refresh (no HMR like React) — manually refresh or use Postman/Thunder Client
- Use **Thunder Client** (VS Code extension) or **Postman** to test API endpoints
- Middleware order matters — logger before routes, errorHandler after all routes
