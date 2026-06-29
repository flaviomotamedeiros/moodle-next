# ADR 001: Monorepo with pnpm Workspaces and Turborepo

**Status**: Accepted  
**Date**: 2026-06-29

## Context

The platform is composed of multiple independent packages: a frontend app, a
backend API, shared domain types, the plugin SDK, and first-party plugins. We
need a strategy for organizing these packages that enables shared tooling,
incremental builds, and independent versioning of the plugin SDK.

## Decision

Use a monorepo managed with **pnpm workspaces** and **Turborepo** for build
orchestration.

## Rationale

- The `plugin-sdk` package must be importable by plugins without pulling in
  internal core dependencies. A monorepo with explicit workspace boundaries
  enforces this separation.
- Turborepo's task graph respects `dependsOn` declarations, ensuring that
  `plugin-sdk` is always built before packages that depend on it.
- TypeScript path aliases work across packages in development without a
  publish/install cycle.
- pnpm's strict node_modules layout prevents plugins from accidentally
  importing transitive dependencies of the core.

## Consequences

- All packages share a single git repository and CI pipeline.
- The plugin SDK is versioned independently; breaking changes require a major
  version bump and a deprecation notice before removal.
- External plugin authors who do not use the monorepo can still install
  `@moodle-next/plugin-sdk` as a regular npm dependency.
