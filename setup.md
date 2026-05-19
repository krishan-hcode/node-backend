# Setup Guide

This document explains how to set up the project from scratch, which packages you need for each feature, and how to add new CRUD endpoints without installing unnecessary dependencies.

For API examples and learning notes, see [README.md](./README.md).

---

## Table of Contents

1. [Package reference](#package-reference)
2. [Prerequisites](#prerequisites)
3. [First-time setup](#first-time-setup)
4. [Project structure](#project-structure)
5. [Adding a new CRUD resource](#adding-a-new-crud-resource)
6. [Troubleshooting](#troubleshooting)

---

## Package reference

### What is already installed

This project includes the following dependencies (see `package.json`):

| Package | Type | Purpose |
|---------|------|---------|
| `express` | dependency | HTTP server, routing, middleware |
| `dotenv` | dependency | Load `PORT`, `MONGO_URI`, etc. from `.env` |
| `mongoose` | dependency | MongoDB schemas, models, and queries |
| `nodemon` | devDependency | Auto-restart server during development |

### What to install for each feature

| Goal | Package(s) | Command | Notes |
|------|------------|---------|-------|
| REST API routes | `express` | `yarn add express` | Already installed |
| Environment variables | `dotenv` | `yarn add dotenv` | Already installed |
| MongoDB persistence | `mongoose` | `yarn add mongoose` | Already installed; requires MongoDB on your machine |
| Dev auto-restart | `nodemon` | `yarn add -D nodemon` | Already installed |
| **Another CRUD resource** (e.g. `/products`) | None | — | Reuse existing stack: model + routes |
| JWT authentication (planned) | `jsonwebtoken`, `bcryptjs` | `yarn add jsonwebtoken bcryptjs` | Not installed yet |
| PostgreSQL instead of MongoDB | `prisma`, `@prisma/client` | `yarn add prisma @prisma/client` | Alternative stack; not used in this project |

### Decision guide

```
REST API only              →  express
+ secrets / config in .env →  dotenv
+ save data in MongoDB     →  mongoose  (+ MongoDB server installed locally)
+ faster local development →  nodemon    (dev only)

New resource like /users   →  no new packages; add model + routes + register in index.js
```

### Package roles

| Package | What it does |
|---------|----------------|
| **express** | Defines routes, reads `req.body` / `req.params`, sends `res.json()`, runs middleware. |
| **dotenv** | Reads `.env` and sets `process.env.MONGO_URI`, `process.env.PORT`, etc. |
| **mongoose** | Connects to MongoDB and provides `User.find()`, `User.create()`, and similar methods. |
| **nodemon** | Restarts Node when you save files (`yarn dev`). |

**MongoDB is not an npm package.** It is a separate database server you install on your computer (see [Prerequisites](#prerequisites)).

---

## Prerequisites

Install these once on your machine:

| Tool | Minimum | Purpose | Install (macOS) |
|------|---------|---------|-----------------|
| Node.js | v24+ | Run the API | [nodejs.org](https://nodejs.org) or `brew install node` |
| Yarn | latest | Install npm packages | `npm install -g yarn` |
| MongoDB Community | 8.x | Store application data | See below |

### Install and run MongoDB (macOS)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

Verify MongoDB is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

Expected output includes `{ ok: 1 }`.

### Verify Node and Yarn

```bash
node -v
yarn -v
```

---

## First-time setup

Follow these steps in order when setting up the project on a new machine.

### Step 1: Go to the project folder

```bash
cd node-backend
```

### Step 2: Install dependencies

```bash
yarn install
```

This installs everything listed in `package.json`.

### Step 3: Create environment file

```bash
cp .env.template .env
```

Open `.env` and set:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/node-backend
JWT_SECRET=replace_with_a_strong_secret
```

| Variable | Required now | Description |
|----------|--------------|-------------|
| `PORT` | No | Server port (defaults to `3000`) |
| `MONGO_URI` | **Yes** | MongoDB connection URL |
| `JWT_SECRET` | No | Reserved for future JWT auth |

**Security:** Do not commit `.env`. It is listed in `.gitignore`. Commit only `.env.template` without real secrets.

### Step 4: Start MongoDB

```bash
brew services start mongodb/brew/mongodb-community
```

Skip this step if MongoDB is already running.

### Step 5: Start the development server

```bash
yarn dev
```

Expected console output:

```
MongoDB connected
Server running at http://localhost:3000
```

### Step 6: Verify the API

Open in a browser or API client (Thunder Client, Postman):

```http
GET http://localhost:3000/
GET http://localhost:3000/users
```

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start with nodemon (auto-restart on file changes) |
| `yarn start` | Start with `node` (no auto-restart) |

---

## Project structure

```
node-backend/
├── index.js                 # Entry point: env, express, DB, routes
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   └── User.js              # Mongoose schema and model
├── routes/
│   └── users.js             # /users CRUD handlers
├── middleware/
│   ├── logger.js            # Request logging
│   ├── validateUser.js      # POST/PUT validation
│   └── errorHandler.js      # Global error responses (register last)
├── .env                     # Local secrets (not in git)
├── .env.template            # Example env for other developers
├── package.json             # Dependencies and scripts
├── setup.md                 # This file
└── README.md                # API docs and learning notes
```

### Request flow

```
HTTP Request
  → express.json()      (parse JSON body)
  → logger              (log method + URL)
  → /users router
      → validateUser    (POST and PUT only)
      → route handler   (Mongoose → MongoDB)
  → errorHandler        (on errors)
  → HTTP Response
```

---

## Adding a new CRUD resource

Use this when you want a new endpoint group, for example `/products`, using the same stack as `/users`.

**You do not need to run `yarn add` for a standard CRUD resource** if you already have `express`, `dotenv`, and `mongoose` installed.

### Checklist

| Step | File / action | New package? |
|------|---------------|--------------|
| 1 | Create `models/Product.js` | No |
| 2 | Create `routes/products.js` | No |
| 3 | Optional: `middleware/validateProduct.js` | No |
| 4 | Register route in `index.js` | No |
| 5 | Test with Postman or Thunder Client | No |

### Step 1: Create the model

File: `models/Product.js`

```js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
```

MongoDB creates the `products` collection on the first insert.

### Step 2: Create the routes

File: `routes/products.js`

Copy the structure from `routes/users.js` and replace `User` with `Product`:

| Method | Route | Mongoose method |
|--------|-------|-----------------|
| GET | `/` | `Product.find()` |
| GET | `/:id` | `Product.findById(id)` |
| POST | `/` | `Product.create(body)` |
| PUT | `/:id` | `Product.findByIdAndUpdate(id, body, { new: true })` |
| DELETE | `/:id` | `Product.findByIdAndDelete(id)` |

Important:

- Use MongoDB `_id` in URLs, not numeric IDs like `1` or `2`.
- Validate IDs with `mongoose.Types.ObjectId.isValid(req.params.id)` before querying.
- Wrap handlers in `try/catch` and call `next(err)` on failure.

### Step 3: Add validation (optional)

Create `middleware/validateProduct.js` following `middleware/validateUser.js`, then attach it to POST and PUT:

```js
router.post('/', validateProduct, async (req, res, next) => { ... });
router.put('/:id', validateProduct, async (req, res, next) => { ... });
```

### Step 4: Register the router

In `index.js`, add **above** `app.use(errorHandler)`:

```js
const productsRouter = require('./routes/products');

app.use('/products', productsRouter);
```

### Step 5: Test

```http
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Keyboard",
  "price": 49.99
}
```

Copy `_id` from the response for single-resource requests:

```http
GET http://localhost:3000/products/<_id>
PUT http://localhost:3000/products/<_id>
DELETE http://localhost:3000/products/<_id>
```

### Inspect data in MongoDB

```bash
mongosh
use node-backend
db.products.find()
```

### When you need extra packages

| Feature | Install |
|---------|---------|
| Login with JWT | `yarn add jsonwebtoken bcryptjs` |
| Password hashing only | `yarn add bcryptjs` |
| File uploads (example) | Depends on provider (e.g. AWS SDK) |
| Switch to PostgreSQL | `yarn add prisma @prisma/client` and follow Prisma setup |

---

## Troubleshooting

| Problem | Likely cause | Solution |
|---------|--------------|----------|
| `MONGO_URI is not defined` | Missing `.env` | Run `cp .env.template .env` and set `MONGO_URI` |
| `connect ECONNREFUSED` | MongoDB not running | `brew services start mongodb/brew/mongodb-community` |
| `User not found` for `/users/1` | Wrong ID format | Use `_id` from a POST response, not a number |
| `EADDRINUSE` | Port 3000 in use | Change `PORT` in `.env` or stop the other process |
| Server hangs on request | Middleware missing `next()` | Ensure `next()` is called in non-terminal middleware |

### Useful MongoDB commands

```bash
# Start / stop service (macOS Homebrew)
brew services start mongodb/brew/mongodb-community
brew services stop mongodb/brew/mongodb-community

# Open MongoDB shell
mongosh
```

---

## Quick reference

| Task | Command |
|------|---------|
| Install packages | `yarn install` |
| Copy env template | `cp .env.template .env` |
| Run dev server | `yarn dev` |
| Run production-style | `yarn start` |
| Add CRUD (same stack) | Model + routes + `app.use()` — no new packages |
