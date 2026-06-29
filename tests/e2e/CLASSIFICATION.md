# Behat Test Classification

This document records the classification of Moodle upstream Behat tests.
Source: github.com/moodle/moodle — branch `main`

## Classification Rules

| Class | Definition | Action |
|---|---|---|
| **BEHAVIORAL** | Tests observable behavior from the user's perspective. Describes WHAT the system does, not HOW. | Translated to Playwright. Used as acceptance criteria. |
| **IMPLEMENTATION** | Tests internal PHP classes, database queries, or Moodle-specific UI internals. | Discarded. Not portable. |

---

## Classified Tests

### Authentication (`auth/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `login.feature` | BEHAVIORAL | `auth/login.spec.ts` | Core flow — retained in full |
| `loginform.feature` | BEHAVIORAL | `auth/login.spec.ts` | Merged into login spec |
| `displayloginfailures.feature` | IMPLEMENTATION | — | Admin config UI — discard |
| `rememberusername.feature` | IMPLEMENTATION | — | Browser-level cookie behavior — discard |
| `validateagedigitalconsentmap.feature` | IMPLEMENTATION | — | Admin config only — discard |
| `verifyageofconsent.feature` | BEHAVIORAL | — | Deferred: depends on consent policy decision |

---

### Enrollment (`enrol/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `enrol_user.feature` | BEHAVIORAL | `enrollment/enrol-user.spec.ts` | Core flow — retained in full |
| `add_to_group.feature` | BEHAVIORAL | — | Deferred: Groups feature not yet in scope |
| `role_visibility.feature` | IMPLEMENTATION | — | Admin role config — discard |

---

### Course Management (`course/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `course_creation.feature` | BEHAVIORAL | `course/course-creation.spec.ts` | Core flow — retained |
| `create_delete_course.feature` | BEHAVIORAL | `course/course-creation.spec.ts` | Merged |
| `course_browsing.feature` | BEHAVIORAL | — | Deferred: catalog view |
| `section_visibility.feature` | BEHAVIORAL | — | Deferred: section management |
| `category_management.feature` | BEHAVIORAL | — | Deferred: category hierarchy |
| `edit_settings.feature` | IMPLEMENTATION | — | Form field tests — discard |
| `course_format.feature` | IMPLEMENTATION | — | UI format config — discard |
| `frontpage_display_modes.feature` | IMPLEMENTATION | — | Admin config — discard |
| `reset_course.feature` | BEHAVIORAL | — | Deferred |

---

### Activity Execution — Assignment (`mod/assign/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `online_submissions.feature` | BEHAVIORAL | `activity-execution/assignment-submission.spec.ts` | Core flow — retained |
| `assign_activity_completion.feature` | BEHAVIORAL | `activity-execution/assignment-submission.spec.ts` | Retained |
| `grading_status.feature` | BEHAVIORAL | `activity-execution/assignment-submission.spec.ts` | Retained |
| `file_submission.feature` | BEHAVIORAL | — | Deferred: file upload feature |
| `group_submission.feature` | BEHAVIORAL | — | Deferred: groups feature |
| `assign_anonymous_submission.feature` | BEHAVIORAL | — | Deferred |
| `assign_settings.feature` | IMPLEMENTATION | — | Form field validation — discard |
| `assign_table_preferences.feature` | IMPLEMENTATION | — | UI preferences — discard |
| `duplicate_permissions.feature` | IMPLEMENTATION | — | Permission internals — discard |

---

### Activity Execution — Quiz (`mod/quiz/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `attempt_basic.feature` | BEHAVIORAL | `activity-execution/quiz-attempt.spec.ts` | Core flow — retained |
| `completion_condition_passing_grade.feature` | BEHAVIORAL | `activity-execution/quiz-attempt.spec.ts` | Retained |
| `attempt_timed_quiz.feature` | BEHAVIORAL | — | Deferred: timed quiz feature |
| `attempt_review_options.feature` | BEHAVIORAL | — | Deferred |
| `editing_add.feature` | IMPLEMENTATION | — | Quiz editor UI — discard |
| `settings_form_fields_disableif.feature` | IMPLEMENTATION | — | Form field logic — discard |
| `settings_form_validation.feature` | IMPLEMENTATION | — | Form validation — discard |

---

### Activity Execution — Forum (`mod/forum/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `add_forum.feature` | BEHAVIORAL | — | Deferred: Forum plugin |
| `discussion_display.feature` | BEHAVIORAL | — | Deferred |
| `forum_activity_completion.feature` | BEHAVIORAL | — | Deferred |
| `forum_subscriptions.feature` | BEHAVIORAL | — | Deferred |
| `grade_forum.feature` | BEHAVIORAL | — | Deferred |
| `portfolio_export.feature` | IMPLEMENTATION | — | Discard |

---

### Grading (`grade/`)

| Feature file | Classification | Playwright file | Notes |
|---|---|---|---|
| `grade_view.feature` | BEHAVIORAL | `grading/grade-view.spec.ts` | Core flow — retained |
| `grade_aggregation.feature` | BEHAVIORAL | `grading/grade-view.spec.ts` | Retained |
| `grade_feedback.feature` | BEHAVIORAL | `grading/grade-view.spec.ts` | Retained |
| `grade_import.feature` | BEHAVIORAL | — | Deferred |
| `grade_scales.feature` | BEHAVIORAL | — | Deferred |
| `grade_UI_settings.feature` | IMPLEMENTATION | — | Admin config — discard |
| `grade_calculated_grade_items.feature` | IMPLEMENTATION | — | Formula internals — discard |

---

## Summary

| Context | Total Behat files | Behavioral (retained) | Implementation (discarded) | Deferred |
|---|---|---|---|---|
| Authentication | 6 | 2 | 3 | 1 |
| Enrollment | 3 | 1 | 1 | 1 |
| Course Management | ~20 | 3 | 8 | 9 |
| Assignment | ~40 | 3 | 4 | 33 |
| Quiz | ~40 | 2 | 3 | 35 |
| Forum | ~40 | 5 | 1 | 34 |
| Grading | ~30 | 3 | 2 | 25 |

Deferred tests are activated as each feature enters implementation scope.
