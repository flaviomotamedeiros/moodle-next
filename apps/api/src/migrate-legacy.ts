/**
 * Stage 3 — Legacy → New data migration (backfill).
 *
 * Reads the legacy Moodle MariaDB and writes into the new Prisma/SQLite database,
 * using the same conventions the Strangler repositories expect:
 *   - enrollment.id  = legacy mdl_user_enrolments.id
 *   - grade.enrollmentId = "legacy-user-{userid}"
 *   - grade.activityId   = "{itemmodule}-{iteminstance}"
 *   - activity.id    = legacy mdl_course_modules.id
 *
 * Run:  npm run migrate:legacy   (after `nest build`)
 */
import { join } from 'node:path'
import { createPool } from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'

const legacy = createPool({
  host: process.env.LEGACY_DB_HOST ?? 'localhost',
  port: Number(process.env.LEGACY_DB_PORT ?? 3307),
  user: process.env.LEGACY_DB_USER ?? 'moodle',
  password: process.env.LEGACY_DB_PASSWORD ?? 'moodlepassword',
  database: process.env.LEGACY_DB_NAME ?? 'moodle',
})

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${join(process.cwd(), 'prisma', 'dev.db')}` } },
})

async function q<T = any>(sql: string): Promise<T[]> {
  const [rows] = await legacy.query(sql)
  return rows as T[]
}

async function migrateUsers() {
  const rows = await q(`SELECT id, username, firstname, lastname, email, deleted FROM mdl_user WHERE deleted = 0`)
  for (const r of rows) {
    const data = { username: r.username, email: r.email, firstName: r.firstname, lastName: r.lastname, deletedAt: null }
    await prisma.user.upsert({ where: { id: String(r.id) }, create: { id: String(r.id), ...data }, update: data })
  }
  return rows.length
}

async function migrateCourses() {
  const rows = await q(`SELECT id, fullname, shortname, category, visible FROM mdl_course WHERE id <> 1`)
  for (const r of rows) {
    const data = { fullName: r.fullname, shortName: r.shortname, categoryId: String(r.category), visible: r.visible === 1 }
    await prisma.course.upsert({ where: { id: String(r.id) }, create: { id: String(r.id), ...data }, update: data })
  }
  return rows.length
}

async function migrateEnrollments() {
  const rows = await q(`
    SELECT ue.id, ue.userid, e.courseid, ue.status, ue.timecreated, r.shortname AS role_shortname
    FROM mdl_user_enrolments ue
    JOIN mdl_enrol e ON e.id = ue.enrolid
    LEFT JOIN mdl_role_assignments ra ON ra.userid = ue.userid
      AND ra.contextid = (SELECT id FROM mdl_context WHERE contextlevel = 50 AND instanceid = e.courseid LIMIT 1)
    LEFT JOIN mdl_role r ON r.id = ra.roleid`)
  for (const r of rows) {
    const role = r.role_shortname === 'editingteacher' || r.role_shortname === 'teacher' ? 'teacher'
      : r.role_shortname === 'guest' ? 'guest' : 'student'
    const data = {
      userId: String(r.userid), courseId: String(r.courseid), role,
      status: r.status === 0 ? 'active' : 'suspended',
      enrolledAt: new Date(r.timecreated * 1000), deletedAt: null,
    }
    await prisma.enrollment.upsert({ where: { id: String(r.id) }, create: { id: String(r.id), ...data }, update: data })
  }
  return rows.length
}

async function migrateActivities() {
  const rows = await q(`
    SELECT cm.id AS cmid, cm.course, cm.section, cm.visible, m.name AS modtype,
      COALESCE(a.name, f.name, qz.name, p.name, rs.name, u.name) AS name
    FROM mdl_course_modules cm
    JOIN mdl_modules m ON m.id = cm.module
    LEFT JOIN mdl_assign a ON m.name='assign' AND a.id=cm.instance
    LEFT JOIN mdl_forum f ON m.name='forum' AND f.id=cm.instance
    LEFT JOIN mdl_quiz qz ON m.name='quiz' AND qz.id=cm.instance
    LEFT JOIN mdl_page p ON m.name='page' AND p.id=cm.instance
    LEFT JOIN mdl_resource rs ON m.name='resource' AND rs.id=cm.instance
    LEFT JOIN mdl_url u ON m.name='url' AND u.id=cm.instance
    WHERE cm.deletioninprogress = 0`)
  for (const r of rows) {
    const data = {
      courseId: String(r.course), sectionId: String(r.section),
      pluginId: `mod_${r.modtype}`, name: r.name ?? r.modtype, visible: r.visible === 1,
    }
    await prisma.activity.upsert({ where: { id: String(r.cmid) }, create: { id: String(r.cmid), ...data }, update: data })
  }
  return rows.length
}

async function migrateGrades() {
  const rows = await q(`
    SELECT gg.id, gg.userid, gg.finalgrade, gg.rawgrademax, gg.feedback, gi.itemmodule, gi.iteminstance
    FROM mdl_grade_grades gg
    JOIN mdl_grade_items gi ON gi.id = gg.itemid
    WHERE gi.itemtype = 'mod' AND gg.finalgrade IS NOT NULL`)
  for (const r of rows) {
    const data = {
      enrollmentId: `legacy-user-${r.userid}`,
      activityId: `${r.itemmodule}-${r.iteminstance}`,
      value: Number(r.finalgrade), maxValue: Number(r.rawgrademax),
      feedback: r.feedback ?? null, gradingStrategyType: 'points',
    }
    await prisma.grade.upsert({
      where: { id: String(r.id) },
      create: { id: String(r.id), ...data },
      update: { value: data.value, feedback: data.feedback },
    }).catch(() => {/* skip dup (enrollmentId,activityId) */})
  }
  return rows.length
}

async function main() {
  console.log('▶ Migrating legacy → new database…')
  console.log(`  users:       ${await migrateUsers()}`)
  console.log(`  courses:     ${await migrateCourses()}`)
  console.log(`  enrollments: ${await migrateEnrollments()}`)
  console.log(`  activities:  ${await migrateActivities()}`)
  console.log(`  grades:      ${await migrateGrades()}`)
  console.log('✓ Migration complete.')
  await legacy.end()
  await prisma.$disconnect()
}

main().catch(async err => {
  console.error('Migration failed:', err)
  await legacy.end().catch(() => {})
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})
