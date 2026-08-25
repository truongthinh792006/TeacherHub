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

export interface BackupPayload {
  tasks: Task[];
  prompts: Prompt[];
  docs: DocumentLink[];
  journals: JournalEntry[];
  students: Student[];
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
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeModal: () => void;
  glassClass: string;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

