# Bounded Contexts

This document maps the platform domain into bounded contexts. Each context owns
its model, its data, and its rules. Cross-context communication happens through
events or explicit APIs — never through shared database tables or direct imports
of another context's internals.

---

## Context Map

```
┌─────────────────────┐     ┌─────────────────────┐
│   Course Management │────▶│     Enrollment       │
│                     │     │                     │
│  Course, Category   │     │  Enrollment, Role   │
│  Section, Resource  │     │  Waitlist           │
└─────────────────────┘     └──────────┬──────────┘
                                        │
              ┌─────────────────────────┼──────────────────────┐
              ▼                         ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Activity Execution  │  │      Grading        │  │    Notification     │
│                     │  │                     │  │                     │
│  Activity, Attempt  │  │  Grade, Gradebook   │  │  Notification,      │
│  Submission,        │  │  Rubric, Feedback   │  │  Channel, Template  │
│  Completion         │  │  GradingStrategy    │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│   Authentication    │     │     Identity        │
│                     │     │                     │
│  Session, Token,    │     │  User, Profile,     │
│  Credential         │     │  Preferences        │
└─────────────────────┘     └─────────────────────┘
```

---

## Context Definitions

### 1. Course Management

**Responsibility**: Defines the structure and content of educational offerings.

**Owns**: `Course`, `Category`, `Section`, `Resource`

**Does not own**: enrollment rules, grade calculation, user identity

**Key rules**:
- A Course belongs to exactly one Category
- A Category can be nested inside another Category
- Sections within a Course are ordered and can be reordered
- Deleting a Course triggers an event; other contexts react to it

**Events emitted**:
- `course.created`
- `course.updated`
- `course.deleted`
- `section.reordered`

---

### 2. Enrollment

**Responsibility**: Manages the relationship between Users and Courses, including roles and access periods.

**Owns**: `Enrollment`, `Role`, `Waitlist`

**Does not own**: User identity details, Course structure

**Key rules**:
- A User can have only one active Enrollment per Course
- An Enrollment has a role: `student`, `teacher`, or `guest`
- Enrollment can be manual, self-service, or triggered by an external system (LTI, payment)
- Unenrollment is soft-deleted; history is preserved

**Events emitted**:
- `enrollment.created`
- `enrollment.role_changed`
- `enrollment.suspended`
- `enrollment.deleted`

---

### 3. Activity Execution

**Responsibility**: Manages the lifecycle of learner interactions with Activities.

**Owns**: `Activity`, `Attempt`, `Submission`, `Completion`

**Does not own**: Grade calculation (delegates to Grading), User identity

**Key rules**:
- An Activity is created by an ActivityPlugin; the core stores only metadata
- Each Activity defines its own Completion criteria (via plugin contract)
- A Submission is immutable after the Teacher starts grading it
- Completion is re-evaluated whenever a new Submission or Attempt is recorded

**Events emitted**:
- `activity.created`
- `submission.created`
- `attempt.completed`
- `completion.achieved`

---

### 4. Grading

**Responsibility**: Records, calculates, and exposes grades for learner work.

**Owns**: `Grade`, `Gradebook`, `Rubric`, `Feedback`, `GradingStrategy`

**Does not own**: Submission content, Enrollment rules

**Key rules**:
- A Grade is always associated with a specific Enrollment and Activity
- The GradingStrategy is defined by the ActivityPlugin and stored at Grade creation time
- Manual override of a calculated Grade is allowed but must be logged
- The Gradebook aggregates Grades according to Course-level configuration

**Events emitted**:
- `grade.created`
- `grade.updated`
- `grade.overridden`

---

### 5. Authentication

**Responsibility**: Verifies identity and manages sessions.

**Owns**: `Session`, `Token`, `Credential`

**Does not own**: User profile data, Enrollment, permissions

**Key rules**:
- Authentication is delegated to an AuthPlugin (local, LDAP, OAuth2, SAML)
- A successful authentication produces a Token; the session is stateless (JWT)
- Token refresh follows the OAuth2 refresh token pattern
- Failed attempts are logged with rate limiting enforced

**Events emitted**:
- `auth.login_succeeded`
- `auth.login_failed`
- `auth.logout`

---

### 6. Identity

**Responsibility**: Stores and manages User profile data and preferences.

**Owns**: `User`, `Profile`, `Preferences`

**Does not own**: Enrollment, Grades, authentication credentials

**Key rules**:
- A User is created upon first successful authentication
- Profile fields are extensible via plugins
- User deletion is soft; a deleted User's Grades and Submissions are preserved for audit

**Events emitted**:
- `user.created`
- `user.updated`
- `user.deleted`

---

### 7. Notification

**Responsibility**: Delivers notifications to Users through configured channels.

**Owns**: `Notification`, `Channel`, `Template`

**Does not own**: The events that trigger notifications (listens to other contexts)

**Key rules**:
- Notifications are triggered by events from other contexts, not by direct calls
- Each User configures their channel preferences (email, in-app, push)
- Templates are internationalized
- Failed deliveries are retried with exponential backoff

**Listens to**: events from all other contexts

---

## Cross-Context Rules

1. **No shared tables**: each context owns its own database schema prefix
2. **No direct imports**: a context never imports a model from another context's internal package
3. **Communication via events**: state changes are propagated through the Event Bus
4. **Query via API**: when a context needs to read data from another, it calls a dedicated read API (not a direct DB query)
