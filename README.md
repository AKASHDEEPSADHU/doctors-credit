# Doctors Credit Workspace

Monorepo for the Doctors Credit project, containing a Vite frontend, an Express API server, shared API contract/codegen packages, and a shared database package.

## Repository overview

This repository is managed as a **pnpm workspace** and is organized into deployable apps and shared libraries:

- `artifacts/doctors-credit` — frontend app (`@workspace/doctors-credit`) built with Vite + React + Tailwind
- `artifacts/api-server` — backend API service (`@workspace/api-server`) built with Express + Pino
- `artifacts/mockup-sandbox` — isolated UI/mockup playground (`@workspace/mockup-sandbox`)
- `lib/api-spec` — OpenAPI source of truth + Orval codegen config
- `lib/api-zod` — generated/typed Zod API schemas
- `lib/api-client-react` — generated React Query API client
- `lib/db` — shared Drizzle ORM database package
- `scripts` — small internal utility scripts
- `.migration-backup` — legacy migration snapshot kept for reference

## Tech stack

- Node.js 24
- pnpm workspaces
- TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind 4, TanStack Query
- API: Express 5, pino/pino-http
- Data layer: PostgreSQL + Drizzle ORM + drizzle-zod
- API contract/codegen: OpenAPI 3.1 + Orval + Zod

## Prerequisites

- Node.js 24+
- pnpm (required; npm/yarn install is blocked by `preinstall`)

## Install

```bash
pnpm install
```

## Workspace commands (root)

```bash
pnpm run typecheck        # typecheck libs + packages
pnpm run build            # typecheck + build all packages with build scripts
pnpm run typecheck:libs   # only workspace libraries
```

## Run applications

### 1) Frontend (`@workspace/doctors-credit`)

`artifacts/doctors-credit/vite.config.ts` requires both `PORT` and `BASE_PATH`.

```bash
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/doctors-credit run dev
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/doctors-credit run build
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/doctors-credit run serve
```

Current Vite entrypoint is `src/main.tsx` + `src/App.tsx`.

### 2) API server (`@workspace/api-server`)

Requires `PORT` and `DATABASE_URL`.

```bash
PORT=5000 DATABASE_URL=******localhost:5432/db pnpm --filter @workspace/api-server run dev
```

Other commands:

```bash
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

The API mounts under `/api` and currently exposes `GET /api/healthz`.

### 3) Mockup sandbox (`@workspace/mockup-sandbox`)

```bash
pnpm --filter @workspace/mockup-sandbox run dev
pnpm --filter @workspace/mockup-sandbox run build
pnpm --filter @workspace/mockup-sandbox run preview
```

## API contract and client generation

OpenAPI spec lives at `lib/api-spec/openapi.yaml`.

```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates typed artifacts consumed by:

- `lib/api-zod`
- `lib/api-client-react`

## Database package (`@workspace/db`)

`lib/db` exports the Drizzle client and schema entrypoints.

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run push-force
```

> `DATABASE_URL` must be set before using Drizzle push commands.

## Security and dependency hygiene

Workspace policy is defined in `pnpm-workspace.yaml`:

- `minimumReleaseAge: 1440` enforces a 1-day minimum npm package age
- allowlist exceptions are explicitly declared under `minimumReleaseAgeExclude`

## Notes

- `.migration-backup` contains previous project assets and historical implementation details for reference only.
- If you add new API endpoints, update `lib/api-spec/openapi.yaml` first, then run codegen.
