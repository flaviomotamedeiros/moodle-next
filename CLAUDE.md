@docs/domain/ubiquitous-language.md

# moodle-next

Modernization of the Moodle LMS using a contract-based plugin architecture,
DDD, and the Strangler Fig pattern. See docs/ for the full strategy.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS (TypeScript)
- **Frontend**: Next.js (TypeScript)
- **Database**: PostgreSQL + Prisma
- **Plugin contracts**: packages/plugin-sdk

## Commands

```bash
pnpm install          # install all dependencies
pnpm build            # build all packages
pnpm dev              # start all apps in dev mode
pnpm test             # run all tests
pnpm typecheck        # typecheck all packages
```

## Key conventions

- The ubiquitous language in docs/domain/ubiquitous-language.md governs all naming.
- Plugin contracts live in packages/plugin-sdk. Never import from packages/core inside a plugin.
- Each bounded context owns its own database schema prefix (see docs/domain/bounded-contexts.md).
- Architecture decisions are recorded in docs/adr/.
