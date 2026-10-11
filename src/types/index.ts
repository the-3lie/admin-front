export type Statut = 'active' | 'suspended';
export type RoleAdmin = 'SUPER_ADMIN' | 'ADMIN' | 'OBSERVATEUR';
export type TypeSalle = 'CM' | 'TD';
export type StatutPresence = 'present' | 'late' | 'absent' | 'excused';

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleAdmin;
  establishment?: { id: string; name: string };
  lastLoginAt: string | null;
}

export interface AdminCompte {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleAdmin;
  status: Statut;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Etudiant {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  className: string;
  facultyName: string;
  filiereName: string;
  level: string;
  status: Statut;
}

export interface Enseignant {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  facultyId: string;
  facultyName: string;
  status: Statut;
  hireDate: string;
  subjectsCount: number;
  classesCount: number;
}

export interface ChefClasse {
  classId: string;
  className: string;
  level: string;
  filiereName: string;
  facultyName: string;
  studentCount: number;
  chief: { id: string; firstName: string; lastName: string } | null;
  deputy?: { id: string; firstName: string; lastName: string } | null;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  program: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  volumeHours: number;
}

export interface Salle {
  id: string;
  name: string;
  type: TypeSalle;
  capacity: number;
  creneauxCount: number;
}

export interface Creneau {
  id: string;
  day: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  sessionType: TypeSalle;
  room: { id: string; name: string; type: TypeSalle; capacity: number };
  hasConflict: boolean;
  conflictReason: string | null;
}

export interface SessionLive {
  id: string;
  classId: string;
  className?: string;
  subjectName?: string;
  teacherName?: string;
  room?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';
  date: string;
  startTime: string;
  endTime: string;
  expectedCount: number;
  presentCount?: number;
}

export interface Presence {
  id: string;
  sessionId: string;
  studentId: string;
  status: StatutPresence;
  scannedAt: string | null;
  student?: { id: string; firstName: string; lastName: string; matricule: string };
  session?: { id: string; date: string; subject?: { name: string }; class?: { name: string } };
}

export interface AlerteFraude {
  id: string;
  studentId: string;
  studentName?: string;
  sessionId: string;
  reason: string;
  severity: string;
  status: string;
  createdAt: string;
}

export interface JournalEntree {
  id: string;
  type: string;
  actorName: string;
  actorRole: string;
  targetLabel: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  activeSessions?: number;
  tauxPresenceGlobal?: number;
  fraudAlertsOpen?: number;
  [key: string]: unknown;
}
