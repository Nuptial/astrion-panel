# Astrion Panel Admin Platform

Astrion Panel is a React (TypeScript) + Vite powered admin experience where product and user data can be listed, filtered, edited, and removed through a mock API layer. TanStack React Query provides cache + mutation management, Redux keeps product favorites in sync, and Ant Design components are styled with Tailwind utilities for a modern layout.

## Setup

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Technology Stack

- React + TypeScript + Vite
- Ant Design + TailwindCSS for responsive layout primitives
- React Router v6
- TanStack React Query for cache/mutation workflows
- Redux Toolkit for the favorites slice

## Architecture Overview

| Directory                                 | Purpose                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `src/pages/**`                            | Product and user pages (list, detail, form)          |
| `src/services/**`                         | Mock API services and in-memory datasets             |
| `src/hooks/**`                            | React Query hooks and query-key helpers              |
| `src/store/**`                            | Redux store setup plus the favorites slice           |
| `src/components/**`                       | Reusable UI pieces (page header, status tag, etc.)   |
| `src/constants`, `src/types`, `src/utils` | Shared constants, TypeScript types, and helper utils |

## Mock API

Instead of a real backend, the app keeps data inside module-level arrays. CRUD helpers in `src/services` clone and mutate the in-memory lists, while `simulateDelay` mimics a network roundtrip so React Query cache invalidation paths can be exercised realistically.

## Commands

- `npm run dev` – start the development server
- `npm run build` – type-check and create a production bundle
- `npm run lint` – run ESLint with the default Vite config

## Notes

- Forms include validation rules for every required field.
- Favorite toggling is instantaneous thanks to the Redux slice.
- Responsive design relies on Tailwind utilities, and interactive elements expose helpful `aria-*` attributes for accessibility.
