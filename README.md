# Node.js + Express — Learning Project

A beginner-friendly Node.js REST API for learning backend development: Express routing, middleware, environment variables, and MongoDB with Mongoose.

**Setup, packages, and adding new CRUD resources:** see [setup.md](./setup.md).

---

## Tech Stack

- **Node.js** v24+
- **Express.js** v5
- **Mongoose** v9 (MongoDB ODM)
- **dotenv**
- **Nodemon** (dev)
- **Yarn**
- **MongoDB Community** (local)

---

## Quick Start

```bash
yarn install
cp .env.template .env
brew services start mongodb/brew/mongodb-community
yarn dev
```

Server: `http://localhost:3000`

Full instructions: [setup.md](./setup.md).

---

## Project Structure

```
node-backend/
├── index.js
├── config/db.js
├── models/User.js
├── routes/users.js
├── middleware/
│   ├── logger.js
│   ├── validateUser.js
│   └── errorHandler.js
├── setup.md
└── README.md
```

---

## API Endpoints

### Base

| Method | Route | Response |
|--------|-------|----------|
| GET | `/` | `{ "message": "Hello from Node.js!" }` |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get one user by MongoDB `_id` |
| POST | `/users` | Create user (`name`, `email` required) |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

User IDs are MongoDB ObjectIds (for example `6a0c41b1da9cdfa8617d0653`), not numeric `1` or `2`.

---

## Example Requests

### GET all users

```http
GET http://localhost:3000/users
```

### GET one user

```http
GET http://localhost:3000/users/<_id>
```

### POST create user

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Krishan",
  "email": "krishan@example.com"
}
```

### PUT update user

```http
PUT http://localhost:3000/users/<_id>
Content-Type: application/json

{
  "name": "Krishan Updated",
  "email": "krishan@example.com"
}
```

### DELETE user

```http
DELETE http://localhost:3000/users/<_id>
```

---

## Key Concepts Learned

### 1. Express setup

```js
const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000);
```

### 2. Environment variables

```js
require('dotenv').config();
const port = process.env.PORT || 3000;
```

### 3. MongoDB + Mongoose

```js
await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();
const user = await User.create({ name, email });
```

Data persists across server restarts.

### 4. Express Router

```js
// routes/users.js
const router = express.Router();
router.get('/', handler);
module.exports = router;

// index.js
app.use('/users', require('./routes/users'));
```

### 5. req and res (compare with Next.js)

| Next.js | Express |
|---------|---------|
| `request.json()` | `req.body` |
| `params.id` | `req.params.id` |
| `return Response.json(data)` | `res.json(data)` |
| `return new Response(null, { status: 404 })` | `res.status(404).json(...)` |

### 6. Middleware pipeline

```
Request → [logger] → [validateUser] → Route Handler → Response
```

| File | Type | Registered |
|------|------|------------|
| `middleware/logger.js` | Global | `app.use(logger)` |
| `middleware/validateUser.js` | Route-level | `router.post('/', validateUser, handler)` |
| `middleware/errorHandler.js` | Error handler | `app.use(errorHandler)` — must be last |

**Error handler** (4 parameters):

```js
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
};
app.use(errorHandler);
```

**Trigger from a route:**

```js
return next({ status: 404, message: 'User not found' });
```

### 7. HTTP status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation failed) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## What's Next

- [x] **Express Setup** — server, routing, CRUD
- [x] **Middleware** — logger, validation, error handling, `next()`
- [x] **Environment Variables** — `.env` with `dotenv`
- [x] **Database** — MongoDB + Mongoose
- [ ] **Authentication** — JWT login and protected routes
- [ ] **Deploy** — Railway / Render

---

## Notes

- `yarn dev` uses nodemon — the server restarts when you save files
- Use **Thunder Client** or **Postman** to test API endpoints
- Middleware order: `express.json` → `logger` → routes → `errorHandler` (last)
- MongoDB must be running before starting the server

For package lists, troubleshooting, and adding new CRUD routes, see [setup.md](./setup.md).
