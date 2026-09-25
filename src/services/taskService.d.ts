import type { AuthRequestOptions } from './authService';

export type TaskPerson = { name: string; initials: string; avatarClass: string };
export type TaskSummary = { serial: string; id: string; routeId: string; title: string; poster: TaskPerson; doer: TaskPerson; category: string; service: string; status: string; dateCreated: string };
export type TaskMetrics = { totalTasks: string; active: string; pending: string; noOffers: string; disputes: string; completed: string };
export type TasksPageResult = { count: number; next: string | null; previous: string | null; tasks: TaskSummary[]; metrics: TaskMetrics };
export type TaskRequestOptions = AuthRequestOptions & { authenticatedFetch?: typeof fetch; signal?: AbortSignal; stateSuburbs?: string[]; suburbName?: string; page?: number; pageSize?: number; search?: string; status?: string; state?: string; suburb?: string; taskType?: string; hasOffers?: boolean; dateCreatedAfter?: string; dateCreatedBefore?: string };

export type TaskDetailPerson = { id: string; name: string; email: string };
export type TaskTimelineItem = { title: string; time: string; detail: string; status: string; tone: 'done' | 'active' | 'danger' | 'pending'; note?: string };
export type TaskDetail = {
  id: string;
  displayId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  budget: string;
  dueDate: string;
  locationType: string;
  address: string;
  suburb: string;
  state: string;
  status: string;
  priority: string;
  poster: TaskDetailPerson;
  doer: TaskDetailPerson | null;
  images: unknown[];
  viewsCount: number | null;
  dateCreated: string;
  statusTimeline?: TaskTimelineItem[] | null;
  raw: Record<string, unknown>;
};

export type QuestionReply = {
  author: string;
  initials: string;
  text: string;
  timestamp: string;
  moderated: boolean;
};

export type NormalizedQuestion = {
  id: string;
  author: string;
  initials: string;
  question: string;
  timestamp: string;
  likes: number;
  reply?: QuestionReply;
};

export const TASK_API_PATHS: {
  tasks: string;
  taskDetail: (id: string | number) => string;
  cancelTask: (id: string | number) => string;
  taskQuestions: (id: string | number) => string;
  questionReply: (taskId: string | number, questionPk: string | number) => string;
  increaseBudget: (id: string | number) => string;
  taskReceipt: (id: string | number) => string;
};

export function getTasksEndpoint(baseUrl?: string, query?: TaskRequestOptions): string;
export function normalizeTaskSummary(task: Record<string, unknown>, index?: number): TaskSummary;
export function normalizeTasksPage(payload: unknown): TasksPageResult;
export function normalizeTaskDetail(task: Record<string, unknown>): TaskDetail | null;
export function normalizeQuestion(question: Record<string, unknown>, index?: number): NormalizedQuestion;
export function fetchTasksPage(options?: TaskRequestOptions): Promise<TasksPageResult>;
export function fetchTaskById(id: string | number, options?: TaskRequestOptions): Promise<TaskDetail>;
export function deleteTask(id: string | number, options?: TaskRequestOptions): Promise<boolean>;
export function cancelTask(id: string | number, options?: TaskRequestOptions): Promise<unknown>;
export function fetchTaskQuestions(id: string | number, options?: TaskRequestOptions): Promise<NormalizedQuestion[]>;
export function replyToQuestion(taskId: string | number, questionPk: string | number, data?: Record<string, unknown>, options?: TaskRequestOptions): Promise<unknown>;
export function increaseBudget(id: string | number, data?: Record<string, unknown>, options?: TaskRequestOptions): Promise<unknown>;
export function fetchTaskReceipt(id: string | number, options?: TaskRequestOptions): Promise<unknown>;

export function fetchFilteredTasksPage(options?: TaskRequestOptions): Promise<TasksPageResult>;
