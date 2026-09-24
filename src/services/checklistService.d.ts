import type { ChecklistQuestion, CategoryRequestOptions } from './categoryService';
export function getComponentNumber(type: string): string;
export type ChecklistResult = {
  definition: { id: number; status: string; subcategory: number; subcategory_name?: string; screen_title: string } | null;
  questions: (ChecklistQuestion & { sectionId: string })[];
};
export function fetchChecklist(id: string, options?: CategoryRequestOptions): Promise<ChecklistResult>;
export function addChecklistQuestion(id: string, serviceName: string, question: Omit<ChecklistQuestion, 'id' | 'order'>, options?: CategoryRequestOptions): Promise<{ id: number }>;
export function deleteChecklistQuestion(id: string, options?: CategoryRequestOptions): Promise<unknown>;
export function reorderChecklistQuestions(questions: ChecklistQuestion[], options?: CategoryRequestOptions): Promise<void>;
export function saveChecklistQuestions(id: string, serviceName: string, questions: ChecklistQuestion[], options?: CategoryRequestOptions): Promise<void>;
declare const service: {
  getComponentNumber: typeof getComponentNumber;
  fetchChecklist: typeof fetchChecklist;
  addChecklistQuestion: typeof addChecklistQuestion;
  deleteChecklistQuestion: typeof deleteChecklistQuestion;
  reorderChecklistQuestions: typeof reorderChecklistQuestions;
  saveChecklistQuestions: typeof saveChecklistQuestions;
};
export default service;
