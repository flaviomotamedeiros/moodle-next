/**
 * Representative data drawn from the real Moodle seed (IFAL courses).
 * Used to render the UI before each module is wired to the live API.
 * As Strangler Fig migration flags flip, these reads move to `api`.
 */
import type { CourseCardData } from '@/components/course/course-card'

export const CURRENT_USER = { name: 'Ana Cavalcante', role: 'student' as const }

export const COURSES: CourseCardData[] = [
  { id: '2', shortName: 'TEC-RD', fullName: 'Técnico em Redes de Computadores (Integrado)', category: 'Técnico', progress: 72, hue: 245 },
  { id: '3', shortName: 'TEC-DS', fullName: 'Técnico em Desenvolvimento de Sistemas (Integrado)', category: 'Técnico', progress: 100, hue: 158 },
  { id: '4', shortName: 'SUB-INF', fullName: 'Técnico em Informática (Subsequente)', category: 'Técnico', progress: 45, hue: 280 },
  { id: '5', shortName: 'CST-ADS', fullName: 'Análise e Desenvolvimento de Sistemas (Superior)', category: 'Superior', progress: 18, hue: 210 },
]

export interface ActivityRow {
  id: string
  name: string
  type: 'assign' | 'quiz' | 'forum'
  status: 'complete' | 'in_progress' | 'overdue' | 'not_started'
  dueDate: string
  grade: number | null
  maxGrade: number
}

export const ACTIVITIES: Record<string, ActivityRow[]> = {
  '2': [
    { id: 'a1', name: 'Topologias de rede', type: 'assign', status: 'complete', dueDate: '2026-06-10', grade: 92, maxGrade: 100 },
    { id: 'a2', name: 'Quiz: Modelo OSI', type: 'quiz', status: 'complete', dueDate: '2026-06-15', grade: 85, maxGrade: 100 },
    { id: 'a3', name: 'Fórum: Sub-redes na prática', type: 'forum', status: 'in_progress', dueDate: '2026-07-02', grade: null, maxGrade: 100 },
    { id: 'a4', name: 'Projeto: Cabeamento estruturado', type: 'assign', status: 'not_started', dueDate: '2026-07-20', grade: null, maxGrade: 100 },
  ],
}
