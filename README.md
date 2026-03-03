# VaultFS — Frontend

> React SPA for the VaultFS SaaS File Management System. Built with Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Query, and Redux Toolkit.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
- [Pages & Routes](#pages--routes)
- [Running Locally](#running-locally)
- [All Scripts](#all-scripts)
- [Environment Variables](#environment-variables)
- [State Management](#state-management)
- [API Integration](#api-integration)

---

## Tech Stack

| Concern | Technology |
|---|---|
| Build tool | Vite 7 + `@vitejs/plugin-react` |
| Language | TypeScript 5.9 |
| UI framework | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Component library | shadcn/ui (Radix UI primitives) |
| Server state | TanStack React Query v5 |
| Client state | Redux Toolkit v2 + React Redux |
| Routing | React Router DOM v7 |
| Forms | React Hook Form v7 + `@hookform/resolvers` |
| Validation | Zod v4 |
| Icons | Lucide React |
| Notifications | Sonner |
| Charts | Recharts |
| Animations | `tailwindcss-animate` + `tw-animate-css` |
| Date handling | `date-fns` + `react-day-picker` |
| Theming | `next-themes` (dark/light) |
| Linting | ESLint 9 + `typescript-eslint` |

---

## Default Credentials

> ⚠️ These are development/demo credentials only. Do not use in production.

### User Login — `/login`
| Field | Value |
|---|---|
| Email | `dolonr718@gmail.com` |
| Password | `hello@world` |

### Admin Login — `/admin/login`
| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `AdminPassword123!` |

---

## Application Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (React SPA)                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Router v7                         │ │
│  │                                                            │ │
│  │  /              →  HomePage (public landing)              │ │
│  │  /login         →  LoginPage                              │ │
│  │  /register      →  RegisterPage                           │ │
│  │  /verify-email  →  VerifyEmailPage                        │ │
│  │  /dashboard     →  DashboardPage  ─── ProtectedRoute      │ │
│  │  /packages      →  PackagesPage   ─── ProtectedRoute      │ │
│  │  /admin/login   →  AdminLoginPage                         │ │
│  │  /admin/*       →  Admin pages    ─── AdminRoute          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────┐    ┌─────────────────────────────────┐  │
│  │   Redux Store      │    │     TanStack React Query        │  │
│  │                    │    │                                 │  │
│  │  authSlice         │    │  Server state (auto cache,      │  │
│  │  • currentUser     │    │  background refetch, mutations) │  │
│  │  • token           │    │                                 │  │
│  │  • isAdmin         │    │  useQuery   → GET requests      │  │
│  │                    │    │  useMutation→ POST/PATCH/DELETE  │  │
│  │  uiSlice           │    │                                 │  │
│  │  • modals          │    └──────────────┬──────────────────┘  │
│  │  • sidebarOpen     │                   │                     │
│  └────────────────────┘                   │                     │
│                                           │                     │
│  ┌────────────────────────────────────────▼──────────────────┐  │
│  │                    Axios Instance (lib/axios.ts)           │  │
│  │                                                           │  │
│  │  baseURL = VITE_API_BASE_URL                              │  │
│  │  Request interceptor  → attach Authorization: Bearer JWT  │  │
│  │  Response interceptor → 401 → clear auth → redirect login │  │
│  └────────────────────────────────────────┬──────────────────┘  │
└────────────────────────────────────────────┼─────────────────────┘
                                             │  HTTP/REST
                                             ▼
                              ┌──────────────────────────┐
                              │  Express.js API (: 5000) │
                              │  /api/v1/*               │
                              └──────────────────────────┘
```

### Key Design Decisions

**Feature-sliced structure** — each feature (`auth`, `dashboard`, `packages`, `admin`) owns its own pages, components, and API hooks. This prevents cross-feature coupling and makes the codebase easy to navigate.

**React Query for server state, Redux for client state** — network data (files, folders, packages) lives in React Query's cache with automatic background refetching. UI state (current user, open modals, sidebar) lives in Redux. The two never overlap.

**Axios interceptors** — the base Axios instance automatically attaches the JWT from Redux on every request and redirects to `/login` on any `401` response, so individual API calls don't need to handle auth errors.

**ProtectedRoute / AdminRoute** — wrapper components that read from the Redux `authSlice`. Unauthenticated users are redirected to `/login`; non-admin users attempting to reach `/admin/*` are redirected to `/dashboard`.

**Optimistic UI** — rename and delete mutations use `useMutation` with `onSuccess` query invalidation so the file tree updates immediately without a full page reload.

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing homepage with plan overview |
| `/login` | Public | User email + password login |
| `/register` | Public | New user registration |
| `/verify-email` | Public | OTP email verification |
| `/forgot-password` | Public | Request password reset email |
| `/reset-password` | Public | Submit new password with token |
| `/dashboard` | User | File & folder manager |
| `/packages` | User | Browse plans + subscribe |
| `/packages/history` | User | Subscription history log |
| `/admin/login` | Public | Admin email + password login |
| `/admin` | Admin | Admin overview dashboard |
| `/admin/packages` | Admin | Create / edit / delete subscription tiers |
| `/admin/users` | Admin | View and manage all users |

---

## Running Locally

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 22.x |
| npm | >= 10.x |
| Running backend | See `backend/README.md` |

### Step-by-step

```bash
# 1. Clone the repository (skip if already cloned)
git clone https://github.com/your-username/vaultfs.git
cd vaultfs/frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and set VITE_API_BASE_URL (see below)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

> Make sure the backend is running at `http://localhost:5000` before starting the frontend, otherwise API calls will fail.

---

## All Scripts

```bash
# ── Development ──────────────────────────────────────────
npm run dev            # Start Vite dev server with HMR

# ── Production ──────────────────────────────────────────
npm run build          # Type-check + Vite production build → dist/
npm run preview        # Serve the dist/ folder locally for preview

# ── Code Quality ────────────────────────────────────────
npm run lint           # ESLint check across all src files
```

---

## Environment Variables

Create a `.env` file in the `frontend/` root (copy from `.env.example`):

```env
# URL of the running backend API — no trailing slash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env.VITE_*`.

---

## State Management

### Redux Toolkit — `src/store/`

Manages client-side state that needs to persist across navigation or be shared between unrelated components.

```
authSlice
  • currentUser   — logged-in user object (id, name, email, role)
  • token         — JWT access token (stored in memory, not localStorage)
  • isAdmin       — boolean derived from role

uiSlice
  • sidebarOpen   — mobile sidebar visibility
  • activeModal   — which modal is open (rename / delete / create)
```

### TanStack React Query — `src/features/*/hooks/`

Manages all server state. Each feature exposes custom hooks built on `useQuery` and `useMutation`:

```
useFiles(folderId)         → GET /files?folderId=...
useFolder(id)              → GET /folders/:id
useFolders()               → GET /folders
useUploadFile()            → POST /files/upload
useRenameFile(id)          → PATCH /files/:id
useDeleteFile(id)          → DELETE /files/:id
useDownloadFile(id)        → GET /files/:id/download

usePackages()              → GET /packages
useSubscribe(packageId)    → POST /users/subscribe/:packageId
usePackageHistory()        → GET /users/package-history

useAdminPackages()         → GET /packages  (admin token)
useCreatePackage()         → POST /packages
useUpdatePackage(id)       → PATCH /packages/:id
useDeletePackage(id)       → DELETE /packages/:id
```

---

## API Integration

The Axios instance at `src/lib/axios.ts` is pre-configured:

```ts
// src/lib/axios.ts
import axios from 'axios';
import { store } from '@/store';
import { clearAuth } from '@/store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(clearAuth());
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

All feature hooks import `api` from this file — no direct `fetch()` calls anywhere in the codebase.

---

## License

ISC © 2026 Dolon Roy