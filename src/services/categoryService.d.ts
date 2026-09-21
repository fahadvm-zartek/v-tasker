import type { AuthRequestOptions } from './authService';

export type ChecklistQuestion = {
  id: string;
  question: string;
  type: string;
  required: boolean;
  options: string[];
  order: number;
};

export type ServiceSubcategory = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  order: number;
  keywords: string[];
  checklist: ChecklistQuestion[];
  raw: Record<string, unknown>;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryType: 'IN_PERSON' | 'PROFESSIONAL' | 'ONLINE';
  isActive: boolean;
  order: number;
  keywords: string[];
  subcategories: ServiceSubcategory[];
  raw: Record<string, unknown>;
};

export type CategoriesPageResult = {
  count: number;
  categories: ServiceCategory[];
};

export type SubcategoryPayload = {
  categoryId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  keywords?: string[];
  checklist?: ChecklistQuestion[];
};

export type CategoryPayload = {
  name: string;
  description?: string;
  categoryType?: ServiceCategory['categoryType'];
  isActive?: boolean;
  keywords?: string[];
};

export type CategoryRequestOptions = AuthRequestOptions & {
  authenticatedFetch?: typeof fetch;
};

export const CATEGORY_API_PATHS: {
  categories: string;
  categoryDetail: (id: string) => string;
  subcategories: string;
  subcategoryDetail: (id: string) => string;
};

export function getCategoriesEndpoint(baseUrl?: string): string;
export function getCategoryEndpoint(id: string, baseUrl?: string): string;
export function getSubcategoriesEndpoint(baseUrl?: string): string;
export function getSubcategoryEndpoint(id: string, baseUrl?: string): string;
export function normalizeCategory(category: Record<string, unknown>, index?: number): ServiceCategory;
export function normalizeSubcategory(subcategory: Record<string, unknown>, index?: number): ServiceSubcategory;
export function normalizeCategoriesPage(payload: unknown): CategoriesPageResult;
export function buildCategoryPayload(category: CategoryPayload): Record<string, unknown>;
export function buildSubcategoryPayload(subcategory: SubcategoryPayload): Record<string, unknown>;
export function fetchCategoriesPage(options?: CategoryRequestOptions): Promise<CategoriesPageResult>;
export function fetchCategoryById(id: string, options?: CategoryRequestOptions): Promise<ServiceCategory>;
export function createCategory(category: CategoryPayload, options?: CategoryRequestOptions): Promise<ServiceCategory>;
export function createSubcategory(subcategory: SubcategoryPayload, options?: CategoryRequestOptions): Promise<ServiceSubcategory>;
export function updateCategory(id: string, category: CategoryPayload, options?: CategoryRequestOptions): Promise<ServiceCategory>;
export function updateSubcategory(id: string, subcategory: SubcategoryPayload, options?: CategoryRequestOptions): Promise<ServiceSubcategory>;

declare const categoryService: {
  CATEGORY_API_PATHS: typeof CATEGORY_API_PATHS;
  buildCategoryPayload: typeof buildCategoryPayload;
  buildSubcategoryPayload: typeof buildSubcategoryPayload;
  createCategory: typeof createCategory;
  createSubcategory: typeof createSubcategory;
  fetchCategoriesPage: typeof fetchCategoriesPage;
  fetchCategoryById: typeof fetchCategoryById;
  getCategoriesEndpoint: typeof getCategoriesEndpoint;
  getCategoryEndpoint: typeof getCategoryEndpoint;
  getSubcategoriesEndpoint: typeof getSubcategoriesEndpoint;
  getSubcategoryEndpoint: typeof getSubcategoryEndpoint;
  normalizeCategoriesPage: typeof normalizeCategoriesPage;
  normalizeCategory: typeof normalizeCategory;
  normalizeSubcategory: typeof normalizeSubcategory;
  updateCategory: typeof updateCategory;
  updateSubcategory: typeof updateSubcategory;
};

export default categoryService;
