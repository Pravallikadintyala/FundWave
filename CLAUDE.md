# CLAUDE.md

## Project

This is a MERN stack application.

Frontend:
- React
- TypeScript
- TailwindCSS
- React Router
- Axios
- Recharts

Backend:
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas (Mongoose)

Authentication:
- JWT + bcrypt

---

## Coding Standards

- Always use TypeScript.
- Never use plain JavaScript.
- Avoid `any` unless absolutely necessary.
- Use async/await only.
- Prefer interfaces for request/response models.
- Keep code modular and reusable.

---

## Backend Rules

Use this structure:

```
routes/
controllers/
services/
models/
middleware/
utils/
```

- Controllers should only validate requests and call services.
- Business logic belongs in services.
- Protected routes must use `authMiddleware`.

API responses:

Success

```json
{
  "success": true,
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": ""
}
```

---

## Frontend Rules

- Functional components only.
- Use React Hooks.
- Use React Context for authentication.
- TailwindCSS only.
- No inline styles.
- Keep components small and reusable.

---

## General

Whenever generating code:

- Follow the existing project structure.
- Reuse existing components and utilities.
- Do not rewrite working code unless requested.
- Write production-ready code.
- Explain architectural decisions when introducing new patterns.