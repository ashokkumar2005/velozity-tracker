import { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Aria Shah',    color: '#6366f1' },
  { id: 'u2', name: 'Ben Torres',   color: '#f59e0b' },
  { id: 'u3', name: 'Cleo Nakamura',color: '#10b981' },
  { id: 'u4', name: 'Dev Patel',    color: '#ef4444' },
  { id: 'u5', name: 'Eva Müller',   color: '#8b5cf6' },
  { id: 'u6', name: 'Finn O\'Brien', color: '#ec4899' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[]     = ['todo', 'inprogress', 'inreview', 'done'];

const TASK_VERBS  = ['Implement','Refactor','Design','Test','Deploy','Review','Fix','Update','Migrate','Optimise','Audit','Document','Integrate','Debug','Configure'];
const TASK_NOUNS  = ['authentication flow','dashboard metrics','API gateway','payment module','user onboarding','search indexer','notification service','CI/CD pipeline','data pipeline','mobile layout','export feature','role permissions','SSO integration','error tracking','cache layer','analytics widget','dark mode','type system','unit tests','accessibility audit'];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateTasks(count = 500): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const hasStart = Math.random() > 0.15; // 15% have no start date
    const dueOffset  = rndInt(-30, 60);     // spread across past & future
    const dueDate    = addDays(today, dueOffset);
    const startDate  = hasStart ? addDays(dueDate, -rndInt(3, 20)) : null;

    tasks.push({
      id:         `task-${i + 1}`,
      title:      `${rnd(TASK_VERBS)} ${rnd(TASK_NOUNS)}`,
      status:     rnd(STATUSES),
      priority:   rnd(PRIORITIES),
      assigneeId: rnd(USERS).id,
      startDate:  startDate ? toISO(startDate) : null,
      dueDate:    toISO(dueDate),
    });
  }

  return tasks;
}
