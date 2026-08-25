export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BaseRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface Task extends BaseRecord {
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface Prompt extends BaseRecord {
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string;
  favorite: boolean;
}

export interface Student extends BaseRecord {
  name: string;
  className: string;
  gender: string;
  level: string;
  status: string;
  notes: string;
}

export interface JournalEntry extends BaseRecord {
  date: string;
  title: string;
  category: string;
  content: string;
  conclusion: string;
  notes: string;
}

export interface DocumentLink extends BaseRecord {
  title: string;
  url: string;
  category: string;
  description: string;
}

// PPCT (Phân phối chương trình) Types
export type GradeLevel = '10' | '11' | '12';
export type TrackType = 'GENERAL' | 'ICT' | 'CS';
export type LessonStatus = 'PENDING' | 'COMPLETED' | 'DELAYED' | 'MAKEUP';
export type LessonType = 'LESSON' | 'PRACTICE' | 'MIDTERM' | 'FINAL' | 'REVIEW' | 'PROJECT';

export interface PPCTLesson {
  id: string;
  order: number;
  week: number;
  semester: 1 | 2;
  topic: string;
  lessonName: string;
  periods: number;
  type: LessonType;
  status: LessonStatus;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface PPCTPlan extends BaseRecord {
  title: string;
  grade: GradeLevel;
  track: TrackType;
  academicYear: string;
  assignedClasses: string;
  totalPeriods: number;
  totalWeeks: number;
  isDefault?: boolean;
  lessons: PPCTLesson[];
}

// Department Management Suite Types (Tổ chuyên môn)
export type EvaluationRating = 'GIOI' | 'KHA' | 'DAT' | 'CHUA_DAT';
export type MeetingTopic = 'LESSON_STUDY' | 'EXAM_MATRIX' | 'SPECIALIZED_TOPIC' | 'GENERAL';

export interface LessonEvaluationRecord extends BaseRecord {
  recordType: 'EVALUATION';
  teacherName: string;
  observerName: string;
  className: string;
  lessonName: string;
  date: string;
  period: number;
  scorePlanning: number;
  scoreTeacherActivity: number;
  scoreStudentActivity: number;
  scoreEffectiveness: number;
  totalScore: number;
  rating: EvaluationRating;
  strengths: string;
  weaknesses: string;
  recommendations: string;
}

export interface DepartmentMeetingRecord extends BaseRecord {
  recordType: 'MEETING';
  title: string;
  date: string;
  time?: string;
  location?: string;
  chair: string;
  secretary: string;
  attendees: string;
  absent?: string;
  topic: MeetingTopic;
  content: string;
  resolutions: string;
  assignments?: string;
  nextMeetingDate?: string;
}

export interface TeacherAssignmentRecord extends BaseRecord {
  recordType: 'ASSIGNMENT';
  teacherName: string;
  email?: string;
  phone?: string;
  assignedClasses: string;
  periodsPerWeek: number;
  labSchedule: string;
  notes?: string;
}

export type DepartmentRecord =
  | LessonEvaluationRecord
  | DepartmentMeetingRecord
  | TeacherAssignmentRecord;

// Google Drive Sync Types
export interface GoogleUserProfile {
  name: string;
  email: string;
  picture?: string;
}

export interface GoogleDriveSyncState {
  isSignedIn: boolean;
  userProfile: GoogleUserProfile | null;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  clientId: string;
  setClientId: (clientId: string) => void;
  login: () => Promise<void>;
  logout: () => void;
  syncNow: () => Promise<boolean>;
  uploadToDrive: () => Promise<boolean>;
  downloadFromDrive: () => Promise<boolean>;
}

// Firebase Auth & Cloud Firestore Sync Types
export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FirebaseAuthSyncState {
  user: FirebaseUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<boolean>;
  forceUpload: () => Promise<boolean>;
  forceDownload: () => Promise<boolean>;
}

export interface BackupPayload {
  tasks: Task[];
  prompts: Prompt[];
  docs: DocumentLink[];
  journals: JournalEntry[];
  students: Student[];
  ppct?: PPCTPlan[];
  department?: DepartmentRecord[];
  darkMode?: boolean;
}

export interface BackupData {
  app: 'TeacherHubPro';
  schemaVersion: 1;
  exportedAt: string;
  version: string;
  data: BackupPayload;
}

export interface SafetySnapshot {
  timestamp: number;
  createdAt: string;
  note?: string;
  data: BackupPayload;
}

export interface SafetySnapshotInfo {
  timestamp: number;
  createdAt: string;
  note?: string;
  counts: {
    tasks: number;
    prompts: number;
    docs: number;
    journals: number;
    students: number;
    ppct: number;
    department: number;
  };
}

export interface BackupValidationResult {
  isValid: boolean;
  data?: BackupData;
  errors: string[];
  summary: {
    tasks: number;
    prompts: number;
    docs: number;
    journals: number;
    students: number;
    ppct: number;
    department: number;
  };
}

export interface StorageController<T extends BaseRecord> {
  data: T[];
  addItem: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseRecord>) => void;
  updateItem: (id: string, item: Partial<T>) => void;
  deleteItem: (id: string) => void;
  hardSetData: (items: T[]) => void;
  refresh: () => void;
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  onConfirm?: (() => void) | null;
}

export interface GlobalFocus {
  id: string;
  action?: 'view' | 'edit';
}

export interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalFocus: GlobalFocus | null;
  setGlobalFocus: (focus: GlobalFocus | null) => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  tasksCtrl: StorageController<Task>;
  promptsCtrl: StorageController<Prompt>;
  docsCtrl: StorageController<DocumentLink>;
  journalCtrl: StorageController<JournalEntry>;
  studentsCtrl: StorageController<Student>;
  ppctCtrl: StorageController<PPCTPlan>;
  departmentCtrl: StorageController<DepartmentRecord>;
  gdrive: GoogleDriveSyncState;
  firebaseAuth: FirebaseAuthSyncState;
  openAuthModal: () => void;
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeModal: () => void;
  glassClass: string;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}
