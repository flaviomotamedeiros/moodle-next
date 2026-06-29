# ADR 002: Contract-Based Plugin System Without Legacy Compatibility

**Status**: Accepted  
**Date**: 2026-06-29

## Context

Moodle's legacy plugin system relies on file naming conventions and function
naming conventions rather than explicit interfaces. Maintaining compatibility
with legacy plugins would require a translation layer that perpetuates the
architectural problems we are trying to solve.

## Decision

Define explicit TypeScript interfaces in `packages/plugin-sdk` for each plugin
category. Legacy plugins are not supported. Plugin authors must rewrite their
plugins against the new contracts.

## Rationale

- Explicit contracts enable compile-time verification that a plugin implements
  the required interface correctly.
- Discarding legacy compatibility avoids the co-evolution problems documented
  by Mens and Demeyer (2008) and the ecosystem split observed in Drupal's
  migration from version 7 to 8.
- The new SDK is designed to be significantly simpler than the legacy plugin
  API, reducing the rewrite cost for common plugin types.

## Consequences

- All existing Moodle plugins require rewriting. This is an accepted cost.
- The `plugin-sdk` package must be stable before community plugin development
  begins. Breaking changes to contracts require a major version bump.
- The team commits to providing migration guides for the most commonly used
  plugin types (Forum, Quiz, Assignment, LDAP Auth).
