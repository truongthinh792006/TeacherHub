export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export interface BaseRecord { id: string; createdAt: number; updatedAt: number; }
export interface Task extends BaseRecord { title: string; dueDate: string; priority: Priority; completed: boolean; }
export interface Prompt extends BaseRecord { title: string; content: string; description: string; category: string; tags: string; favorite: boolean; }
export interface Student extends BaseRecord { name: string; className: string; gender: string; level: string; status: string; notes: string; }
export interface JournalEntry extends BaseRecord { date: string; title: string; category: string; content: string; conclusion: string; notes: string; }
export interface DocumentLink extends BaseRecord { title: string; url: string; category: string; description: string; }
export interface Backup { tasks?: Task[]; prompts?: Prompt[]; docs?: DocumentLink[]; journals?: JournalEntry[]; students?: Student[]; }
