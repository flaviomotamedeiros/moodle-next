# Interoperability Standards

This document lists the external standards that govern platform behavior.
These standards serve as the *ceiling* of behavioral requirements: the platform
must conform to them regardless of what the Moodle legacy system currently does.

---

## LTI (Learning Tools Interoperability) — IMS Global

**Version**: LTI 1.3 + Advantage

**Purpose**: Enables external tools (simulations, assessments, H5P, etc.) to
be launched from within a Course and to report grades back.

**Required capabilities**:
- Launch an LTI Tool from an Activity
- Receive grade passback via the Assignment and Grade Services (AGS)
- Support Deep Linking for content selection

**Reference**: https://www.imsglobal.org/spec/lti/v1p3

---

## SCORM (Sharable Content Object Reference Model)

**Version**: SCORM 2004 4th Edition (primary); SCORM 1.2 (legacy support)

**Purpose**: Defines how packaged course content communicates completion and
score data back to the platform.

**Required capabilities**:
- Import and unpack a SCORM zip package
- Launch the SCORM content in a sandboxed iframe
- Track `cmi.completion_status` and `cmi.score.scaled` via the SCORM API
- Persist tracking data per Enrollment per Attempt

**Reference**: https://adlnet.gov/projects/scorm

---

## xAPI (Experience API / Tin Can)

**Version**: 1.0.3

**Purpose**: Records fine-grained learning events as structured statements
(actor → verb → object) stored in a Learning Record Store (LRS).

**Required capabilities**:
- Emit xAPI statements for key platform events (enrollment, completion, grade)
- Accept xAPI statements from LTI Tools and SCORM content
- Forward statements to a configurable external LRS

**Reference**: https://github.com/adlnet/xAPI-Spec

---

## Common Cartridge — IMS Global

**Version**: 1.3

**Purpose**: Enables import and export of Course content between platforms.

**Required capabilities**:
- Export a Course (structure, Resources, Activity metadata) as a CC archive
- Import a CC archive and reconstruct the Course structure
- Preserve LTI links and associated metadata during export/import

**Reference**: https://www.imsglobal.org/activity/common-cartridge

---

## Accessibility

**Standard**: WCAG 2.1 Level AA

**Scope**: All UI components, including those contributed by Plugins via Plugin Slots.

**Requirement**: Plugin contracts include an accessibility compliance declaration.
Plugins that contribute UI components must pass automated accessibility checks
(axe-core) in the CI pipeline.

---

## Authentication

**Standard**: OpenID Connect 1.0 + OAuth 2.0 (RFC 6749, RFC 6750)

**Purpose**: Federated authentication with institutional identity providers
(Google Workspace, Microsoft Entra, SAML via bridge).

**Required capabilities**:
- Authorization Code Flow with PKCE
- Token introspection and refresh
- LDAP bridging via an AuthPlugin contract
