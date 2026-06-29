# Ubiquitous Language

This glossary defines the terms used across the entire platform. All code,
documentation, and conversations between developers and domain experts must use
these terms consistently.

When a term has different meanings in different contexts, the context is noted
explicitly. Terms not listed here must be proposed and agreed upon before being
used in code.

---

## Core Concepts

| Term | Definition | Notes |
|---|---|---|
| **Course** | A structured educational offering with defined content, activities, and enrollment periods | A Course belongs to one Category |
| **Category** | A hierarchical grouping of Courses (e.g., "Computer Science > Web Development") | Can be nested |
| **Enrollment** | The relationship between a Student and a Course, including role and period | An Enrollment has a start date and may have an end date |
| **Student** | A User enrolled in a Course with the learner role | Same User can be Student in one Course and Teacher in another |
| **Teacher** | A User with authoring and grading permissions in a Course | |
| **Administrator** | A User with platform-wide management permissions | |
| **Guest** | A User browsing without enrollment, with read-only access if the Course permits | |

---

## Learning Content

| Term | Definition | Notes |
|---|---|---|
| **Activity** | An interactive learning component within a Course (e.g., Forum, Quiz, Assignment) | Provided by an ActivityPlugin |
| **Resource** | A static content element within a Course (e.g., File, Page, URL) | Read-only; no submission or grading |
| **Section** | A thematic grouping of Activities and Resources within a Course | Ordered; may have a title and description |
| **Completion** | The state reached when a Student satisfies all criteria of an Activity | Criteria defined per Activity by the plugin |
| **Submission** | A Student's response to an Activity that expects one (e.g., Assignment, Quiz attempt) | |
| **Attempt** | A single instance of a Student engaging with a gradable Activity | A Quiz may allow multiple Attempts |

---

## Assessment

| Term | Definition | Notes |
|---|---|---|
| **Grade** | A numerical or qualitative score assigned to a Submission | Stored in the Gradebook |
| **Gradebook** | The aggregated record of all Grades for a Student in a Course | Visible to Student and Teacher |
| **Grading Strategy** | The rules defining how Grades are calculated for an Activity | Defined by the ActivityPlugin |
| **Rubric** | A structured grading guide with criteria and level descriptors | Optional; used by Teacher during manual grading |
| **Feedback** | A Teacher's textual or annotated response to a Submission | Accompanies a Grade |

---

## Interoperability

| Term | Definition | Notes |
|---|---|---|
| **SCORM Package** | A zip archive containing course content conforming to the SCORM standard | Imported as an Activity |
| **LTI Tool** | An external learning application integrated via the LTI standard | Launched from within a Course |
| **xAPI Statement** | A structured record of a learning event (actor, verb, object) | Used for detailed activity tracking |
| **Common Cartridge** | An IMS standard format for exchanging Course content between platforms | Used for import/export |

---

## Plugin System

| Term | Definition | Notes |
|---|---|---|
| **Plugin** | A self-contained package that extends the platform by implementing one or more contracts | Must implement the interfaces defined in `plugin-sdk` |
| **Contract** | A TypeScript interface defined in `plugin-sdk` that a Plugin must implement | Versioned with semantic versioning |
| **Plugin Registry** | The runtime service responsible for discovering and registering installed Plugins | Managed by the core |
| **Plugin Slot** | A named extension point in the UI where Plugins can inject components | Defined by the core; filled by Plugins |
| **Event** | A typed, named signal emitted by the core or a Plugin that others can listen to | Async; delivered via the Event Bus |
| **Event Bus** | The infrastructure service that routes Events between the core and Plugins | |

---

## Terms Intentionally NOT Used

These terms exist in the Moodle legacy codebase but are replaced by the terms above.

| Legacy Term | Replaced By |
|---|---|
| `mdl_user` | User |
| `role` (raw string) | Enrollment role (Student, Teacher, Administrator) |
| `module` | Activity or Resource |
| `cm` (course module) | Activity instance within a Section |
| `instance` | Plugin-specific record tied to an Activity |
| `capability` | Permission (to be defined in the Permissions bounded context) |
