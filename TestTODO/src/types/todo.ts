export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
    id: string;
    text: string;
    description?: string; // Optional as per Level 1 requirement "Add Description field"
    completed: boolean;
    priority: Priority;
    dueDate?: string; // ISO date string
    createdAt: number;
}
