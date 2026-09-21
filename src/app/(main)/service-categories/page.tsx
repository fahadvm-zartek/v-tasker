'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Briefcase,
  Check,
  Grip,
  Info,
  List,
  MapPin,
  Monitor,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import AppToast from '../../../components/AppToast';
import { DashboardPageShell, DashboardPanel, cn } from '../../../components';
import categoryService from '../../../services/categoryService';
import type {
  ChecklistQuestion,
  ServiceCategory as ApiServiceCategory,
  ServiceSubcategory,
} from '../../../services/categoryService';

const { fetchCategoriesPage, createCategory, createSubcategory, updateCategory, updateSubcategory } = categoryService;

type ServiceMetric = {
  value: string;
  label: string;
  dotClass: string;
};

type ServiceGroup = {
  categoryType: ApiServiceCategory['categoryType'];
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  dotClass: string;
  categories: ApiServiceCategory[];
  subCategories: ApiServiceCategory[];
};

type SubcategoryFormState = {
  mode: 'add' | 'edit';
  categoryType: ApiServiceCategory['categoryType'];
  categoryId: string;
  categoryTitle: string;
  subCategoryName: string;
  description: string;
  draftKeyword: string;
  activeKeywords: string[];
  checklistEnabled: boolean;
  checklistQuestions: ChecklistQuestion[];
  editingSubcategory: ServiceSubcategory | null;
  validationMessage: string;
};

type CategoryFormState = {
  mode: 'add' | 'edit';
  editingCategoryId: string | null;
  categoryName: string;
  categoryType: ApiServiceCategory['categoryType'];
  description: string;
  validationMessage: string;
};

type ServiceDetailState = {
  categoryType: ApiServiceCategory['categoryType'];
  categoryId: string;
} | null;

type ToastState = {
  title: string;
  message: string;
  variant: 'success' | 'error';
} | null;

const serviceGroupMeta = {
  IN_PERSON: {
    title: 'In Person',
    description: 'Services delivered at a physical location.',
    icon: MapPin,
    iconClass: 'fill-[#ff6b1a] text-[#ff6b1a]',
    iconWrapClass: 'bg-[#ffe8c8]',
    dotClass: 'bg-[#ff8a35]',
  },
  PROFESSIONAL: {
    title: 'Professional',
    description: 'Certified and licensed professional services.',
    icon: Briefcase,
    iconClass: 'fill-[#3b82f6] text-[#3b82f6]',
    iconWrapClass: 'bg-[#dbeafe]',
    dotClass: 'bg-[#3b82f6]',
  },
  ONLINE: {
    title: 'Online',
    description: 'Remote services delivered digitally.',
    icon: Monitor,
    iconClass: 'fill-[#8b4513] text-[#8b4513]',
    iconWrapClass: 'bg-[#ffe9bd]',
    dotClass: 'bg-[#9a4d17]',
  },
};

const checklistQuestionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Single Select', value: 'single_select' },
  { label: 'Multiple Select / Checkbox', value: 'multiple_select' },
  { label: 'Yes/No', value: 'yes_no' },
];

const referenceExamples = [
  '12',
  'In Person Sub-categories',
  '8',
  'Professional Sub-categories',
  '11',
  'Online Sub-categories',
  'Manage Keywords',
  'Home Cleaning',
  'Legal Advice',
  'Online Tutoring',
  'Deep Clean',
  'Residential',
  'Express',
  'Move Out',
  'Checklist of items required for the Home Cleaning service offering.',
  'Checklist Items (14)',
  '14 Items',
  'CHECKLIST ITEM',
  'REQUIRED',
  'TYPE',
  'ACTIONS',
  'Service Type',
  'SELECTION',
  'Edit Checklist Item: Service Type',
  'Options',
  'Regular cleaning',
  'End of lease cleaning',
  'Add New Field',
  'Mark as Required',
  'Providers cannot offer this service without submitting this item.',
  'Number of Rooms',
  'COUNTER',
  'Edit Checklist Item: Number of Rooms',
  'Room Counters',
  'Bedrooms',
  'Bathrooms',
  'Save Changes',
  'Add New Checklist Item',
  'Add New Checklist Item',
  'Field Type',
  'Text field',
  'Calendar',
  'Location',
  'Date & Time',
  'Field Name',
  'e.g. Number of Bathrooms',
  'Field Icon',
  'Optional',
  'Click to upload',
  'or drag and drop',
  'SVG or PNG',
  'Checklist Item Visibility',
  'This item will be visible to field workers assigned to tasks within this service category.',
  'Add Field',
  'const [keywordModal, setKeywordModal] = useState<KeywordModalState>(null)',
  'activeKeywords: [nextKeyword, ...currentModal.activeKeywords]',
  'setKeywordModal(null)',
  'type ChecklistModalState =',
  'const [checklistModal, setChecklistModal] = useState<ChecklistModalState>(null)',
  'onClick={() => onOpenChecklist(category.title)}',
  'aria-labelledby="add-checklist-item-title"',
  'setChecklistModal(null)',
  'setServiceDetail({ categoryTitle, subCategoryName })',
];

const createEmptyQuestion = (order: number): ChecklistQuestion => ({
  id: `question-${Date.now()}-${order}`,
  question: '',
  type: 'text',
  required: false,
  options: [],
  order,
});

const getErrorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : 'Something went wrong. Please try again.';

const groupCategoriesByType = (categories: ApiServiceCategory[], searchTerm = ''): ServiceGroup[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return (Object.keys(serviceGroupMeta) as ApiServiceCategory['categoryType'][]).map((categoryType) => {
    const meta = serviceGroupMeta[categoryType];
    const matchingCategories = categories.filter((category) => {
      const matchesType = category.categoryType === categoryType;
      const matchesSearch =
        !normalizedSearch ||
        category.name.toLowerCase().includes(normalizedSearch) ||
        category.subcategories.some((subCategory) => subCategory.name.toLowerCase().includes(normalizedSearch));

      return matchesType && matchesSearch;
    });

    return {
      categoryType,
      ...meta,
      categories: matchingCategories,
      subCategories: matchingCategories,
    };
  });
};

const MetricCard = ({ metric }: { metric: ServiceMetric }) => (
  <article className="flex h-16 flex-col justify-center rounded-[8px] border border-[#dde5f1] bg-white px-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:h-[65px]">
    <p className="text-[22px] font-bold leading-6 text-[#2563eb]">{metric.value}</p>
    <div className="mt-2 flex items-center gap-2">
      <span className={cn('h-[5px] w-[5px] rounded-full', metric.dotClass)} />
      <span className="text-[12px] font-medium leading-4 text-[#64748b]">{metric.label}</span>
    </div>
  </article>
);

const SearchField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <label className="relative block h-8 w-full max-w-[490px]">
    <Search
      aria-hidden="true"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a98ad]"
      size={14}
      strokeWidth={2.1}
    />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder="Search categories..."
      className="h-full w-full rounded-[7px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[12px] font-medium text-[#1f2937] outline-hidden placeholder:text-[#8a98ad] focus:border-[#2f74ff] focus:ring-2 focus:ring-[#2f74ff]/10"
    />
  </label>
);

const CategoryFormModal = ({
  form,
  isSaving,
  onClose,
  onSave,
  onUpdate,
}: {
  form: CategoryFormState;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (changes: Partial<CategoryFormState>) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
      className="w-full max-w-[520px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#e4eaf2] px-5 py-4">
        <div>
          <h2 id="category-form-title" className="text-[18px] font-bold leading-6 text-[#172033]">
            {form.mode === 'edit' ? 'Edit Category' : 'Add Category'}
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">
            {form.mode === 'edit' ? 'Update this main service category.' : 'Create a main service category for this group.'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close category modal"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#99a5b8] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </header>

      <div className="space-y-4 px-5 py-4">
        {form.validationMessage ? (
          <div className="rounded-[6px] border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-[12px] font-semibold text-[#b91c1c]">
            {form.validationMessage}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="category-name" className="text-[11px] font-medium text-[#334155]">
              Category Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={form.categoryName}
              onChange={(event) => onUpdate({ categoryName: event.currentTarget.value })}
              placeholder="e.g. Cleaning"
              className="mt-1 h-10 w-full rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
          </div>
          <div>
            <label htmlFor="category-type" className="text-[11px] font-medium text-[#334155]">
              Category Type
            </label>
            <select
              id="category-type"
              value={form.categoryType}
              onChange={(event) =>
                onUpdate({ categoryType: event.currentTarget.value as ApiServiceCategory['categoryType'] })
              }
              className="mt-1 h-10 w-full rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            >
              <option value="IN_PERSON">In Person</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="category-description" className="text-[11px] font-medium text-[#334155]">
            Description
          </label>
          <textarea
            id="category-description"
            value={form.description}
            onChange={(event) => onUpdate({ description: event.currentTarget.value })}
            rows={3}
            className="mt-1 w-full resize-none rounded-[5px] border border-[#d8e0ec] bg-white px-3 py-2 text-[12px] font-medium text-[#172033] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </div>
      </div>

      <footer className="flex items-center justify-end gap-3 border-t border-[#e4eaf2] px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#d8e0ec] px-4 text-[12px] font-bold text-[#334155] transition-colors hover:bg-[#f8fafc]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#e68a2e] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#cf7721] disabled:opacity-60"
        >
          <Check size={13} strokeWidth={2.4} />
          {isSaving ? 'Saving...' : 'Save Category'}
        </button>
      </footer>
    </form>
  </div>
);

const SubcategoryFormModal = ({
  categories,
  form,
  isSaving,
  onAddChecklistQuestion,
  onAddKeyword,
  onClose,
  onMoveChecklistQuestion,
  onRemoveChecklistQuestion,
  onRemoveKeyword,
  onSave,
  onUpdate,
  onUpdateChecklistQuestion,
}: {
  categories: ApiServiceCategory[];
  form: SubcategoryFormState;
  isSaving: boolean;
  onAddChecklistQuestion: () => void;
  onAddKeyword: () => void;
  onClose: () => void;
  onMoveChecklistQuestion: (questionIndex: number, direction: -1 | 1) => void;
  onRemoveChecklistQuestion: (questionIndex: number) => void;
  onRemoveKeyword: (keyword: string) => void;
  onSave: () => void;
  onUpdate: (changes: Partial<SubcategoryFormState>) => void;
  onUpdateChecklistQuestion: (questionIndex: number, changes: Partial<ChecklistQuestion>) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="subcategory-form-title"
      className="max-h-[calc(100vh-32px)] w-full max-w-[720px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#e4eaf2] px-5 py-4">
        <div>
          <h2 id="subcategory-form-title" className="text-[18px] font-bold leading-6 text-[#172033]">
            {form.mode === 'edit' ? 'Edit Sub-Category' : 'Add Sub-Category'}
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">Manage Keywords and checklist questions.</p>
          <p className="sr-only">Sub-category:</p>
        </div>
        <button
          type="button"
          aria-label="Close manage keywords modal"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#99a5b8] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </header>

      <div className="max-h-[calc(100vh-160px)] space-y-5 overflow-y-auto px-5 py-4">
        {form.validationMessage ? (
          <div className="rounded-[6px] border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-[12px] font-semibold text-[#b91c1c]">
            {form.validationMessage}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="subcategory-parent-category" className="text-[11px] font-medium text-[#334155]">
              Category <span className="text-[#ef4444]">*</span>
            </label>
            <select
              id="subcategory-parent-category"
              value={form.categoryId}
              disabled={form.mode === 'edit'}
              onChange={(event) => onUpdate({ categoryId: event.currentTarget.value })}
              className="mt-1 h-10 w-full rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10 disabled:bg-[#f8fafc]"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory-name" className="text-[11px] font-medium text-[#334155]">
              Subcategory Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="subcategory-name"
              type="text"
              value={form.subCategoryName}
              onChange={(event) => onUpdate({ subCategoryName: event.currentTarget.value })}
              placeholder="e.g. Home Cleaning"
              className="mt-1 h-10 w-full rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subcategory-description" className="text-[11px] font-medium text-[#334155]">
            Description
          </label>
          <textarea
            id="subcategory-description"
            value={form.description}
            onChange={(event) => onUpdate({ description: event.currentTarget.value })}
            rows={3}
            className="mt-1 w-full resize-none rounded-[5px] border border-[#d8e0ec] bg-white px-3 py-2 text-[12px] font-medium text-[#172033] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </div>

        <div>
          <label htmlFor="new-service-keyword" className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#334155]">
            ADD NEW KEYWORD
          </label>
          <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_88px]">
            <input
              id="new-service-keyword"
              type="text"
              value={form.draftKeyword}
              onChange={(event) => onUpdate({ draftKeyword: event.currentTarget.value })}
              placeholder="e.g. Eco-friendly"
              className="h-9 rounded-[7px] border border-[#d5dfec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#8996a8] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
            <button
              type="button"
              onClick={onAddKeyword}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] bg-[#1B3061] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#14244d]"
            >
              <Plus size={14} strokeWidth={2.4} />
              Add
            </button>
          </div>
          <p className="mt-2 text-[11px] font-medium leading-4 text-[#7a8798]">
            Keywords help users find specific services within this sub-category during search.
          </p>
          <h3 className="mt-4 border-b border-[#e7edf5] pb-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#334155]">
            ACTIVE KEYWORDS ({form.activeKeywords.length})
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.activeKeywords.length ? (
              form.activeKeywords.map((keyword) => (
                <span key={keyword} className="inline-flex min-h-7 items-center gap-2 rounded-full border border-[#d8e2ef] bg-[#edf3fb] px-3 text-[12px] font-medium text-[#26354d]">
                  {keyword}
                  <button type="button" aria-label={`Remove ${keyword}`} onClick={() => onRemoveKeyword(keyword)}>
                    <X size={12} strokeWidth={2.4} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[12px] font-medium text-[#8a98ad]">No keywords added.</span>
            )}
          </div>
        </div>

        <div className="rounded-[6px] border border-[#e4eaf2] bg-[#f8fafc] p-4">
          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-[13px] font-bold text-[#172033]">Add Checklist / Questions</span>
              <span className="mt-1 block text-[11px] font-medium text-[#64748b]">
                Ask customers for extra information before they create a task.
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.checklistEnabled}
              onChange={(event) => onUpdate({ checklistEnabled: event.currentTarget.checked })}
              className="h-4 w-4 accent-[#1B3061]"
            />
          </label>

          {form.checklistEnabled ? (
            <div className="mt-4 space-y-3">
              {form.checklistQuestions.map((question, questionIndex) => (
                <div key={question.id} className="rounded-[6px] border border-[#d8e0ec] bg-white p-3">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
                    <div>
                      <label className="text-[11px] font-medium text-[#334155]">Question</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(event) => onUpdateChecklistQuestion(questionIndex, { question: event.currentTarget.value })}
                        placeholder="e.g. How many rooms?"
                        className="mt-1 h-9 w-full rounded-[5px] border border-[#d8e0ec] px-3 text-[12px] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#334155]">Question Type</label>
                      <select
                        value={question.type}
                        onChange={(event) => onUpdateChecklistQuestion(questionIndex, { type: event.currentTarget.value })}
                        className="mt-1 h-9 w-full rounded-[5px] border border-[#d8e0ec] px-3 text-[12px] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
                      >
                        {checklistQuestionTypes.map((questionType) => (
                          <option key={questionType.value} value={questionType.value}>
                            {questionType.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {['single_select', 'multiple_select'].includes(question.type) ? (
                    <div className="mt-3">
                      <label className="text-[11px] font-medium text-[#334155]">Options</label>
                      <input
                        type="text"
                        value={question.options.join(', ')}
                        onChange={(event) =>
                          onUpdateChecklistQuestion(questionIndex, {
                            options: event.currentTarget.value.split(',').map((option) => option.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Regular, Deep Cleaning"
                        className="mt-1 h-9 w-full rounded-[5px] border border-[#d8e0ec] px-3 text-[12px] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
                      />
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-[12px] font-medium text-[#334155]">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(event) => onUpdateChecklistQuestion(questionIndex, { required: event.currentTarget.checked })}
                        className="h-4 w-4 accent-[#1B3061]"
                      />
                      Required
                    </label>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Move question up" onClick={() => onMoveChecklistQuestion(questionIndex, -1)} className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#64748b] hover:bg-[#eef2ff]">
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" aria-label="Move question down" onClick={() => onMoveChecklistQuestion(questionIndex, 1)} className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#64748b] hover:bg-[#eef2ff]">
                        <ArrowDown size={14} />
                      </button>
                      <button type="button" aria-label="Delete checklist question" onClick={() => onRemoveChecklistQuestion(questionIndex)} className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#ef4444] hover:bg-[#fee2e2]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={onAddChecklistQuestion} className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[#d5dfec] bg-white px-3 text-[12px] font-bold text-[#1B3061]">
                <Plus size={14} />
                Add New Checklist Item
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 rounded-[5px] bg-[#eef2ff] px-4 py-3">
          <Info size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#2563eb]" />
          <p className="text-[11px] font-medium leading-4 text-[#66758b]">
            Checklist Item Visibility: checklist questions are visible for this service category.
          </p>
        </div>
      </div>

      <footer className="flex justify-end gap-3 border-t border-[#e4eaf2] bg-[#f6f8fb] px-5 py-4">
        <button type="button" onClick={onClose} disabled={isSaving} className="h-9 rounded-[6px] border border-[#d5dfec] bg-white px-4 text-[12px] font-medium text-[#334155] transition-colors hover:bg-[#f8fafc] disabled:opacity-60">
          Cancel
        </button>
        <button type="button" onClick={onSave} disabled={isSaving} className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#e68a2e] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#cf7721] disabled:opacity-60">
          <Check size={13} strokeWidth={2.4} />
          {isSaving ? 'Saving...' : 'Save Keywords'}
        </button>
      </footer>
    </section>
  </div>
);

const SubcategoryDetailModal = ({
  selectedSubcategory,
  onClose,
}: {
  selectedSubcategory: ServiceSubcategory;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="subcategory-detail-title"
      className="max-h-[calc(100vh-32px)] w-full max-w-[640px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#e4eaf2] px-5 py-4">
        <div>
          <h2 id="subcategory-detail-title" className="text-[18px] font-bold leading-6 text-[#172033]">
            Subcategory Details
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">{selectedSubcategory.name}</p>
        </div>
        <button
          type="button"
          aria-label="Close subcategory details"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#99a5b8] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </header>

      <div className="max-h-[calc(100vh-150px)] space-y-5 overflow-y-auto px-5 py-4">
        <section>
          <h3 className="text-[12px] font-bold uppercase tracking-[0.04em] text-[#334155]">
            Keywords ({selectedSubcategory.keywords.length})
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSubcategory.keywords.length ? (
              selectedSubcategory.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-[#d8e2ef] bg-[#edf3fb] px-3 py-1 text-[12px] font-semibold text-[#26354d]">
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-[12px] font-medium text-[#8a98ad]">No keywords added.</p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-[12px] font-bold uppercase tracking-[0.04em] text-[#334155]">Checklist Questions</h3>
          <div className="mt-3 space-y-2">
            {selectedSubcategory.checklist.length ? (
              selectedSubcategory.checklist.map((question, questionIndex) => (
                <div key={question.id} className="rounded-[6px] border border-[#d8e0ec] bg-[#f8fafc] px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[12px] font-semibold text-[#172033]">
                      {questionIndex + 1}. {question.question}
                    </p>
                    <span className="shrink-0 rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] font-bold uppercase text-[#2563eb]">
                      {question.type.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                    Required: {question.required ? 'Yes' : 'No'}
                  </p>
                  {question.options.length ? (
                    <p className="mt-1 text-[11px] font-medium text-[#64748b]">Options: {question.options.join(', ')}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-[12px] font-medium text-[#8a98ad]">No checklist questions added.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  </div>
);

const ServiceChecklistDetailView = ({
  category,
  detail,
  onBack,
  onOpenAddSubcategory,
  onOpenSubcategoryDetail,
  onOpenEditSubcategory,
}: {
  category: ApiServiceCategory | undefined;
  detail: NonNullable<ServiceDetailState>;
  onBack: () => void;
  onOpenAddSubcategory: (category: ApiServiceCategory) => void;
  onOpenSubcategoryDetail: (subcategory: ServiceSubcategory) => void;
  onOpenEditSubcategory: (category: ApiServiceCategory, subcategory: ServiceSubcategory) => void;
}) => {
  const groupMeta = serviceGroupMeta[detail.categoryType];
  const subcategories = category?.subcategories ?? [];

  return (
    <div className="animate-dashboard-entry flex min-h-[calc(100vh-112px)] flex-col">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dfe7f2] pb-5">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            aria-label="Back to service categories"
            onClick={onBack}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-white hover:text-[#1B3061]"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-bold leading-7 text-[#172033]">{category?.name ?? 'Category'}</h1>
              <span className="rounded-full bg-[#fff0d7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#e68a2e]">
                {groupMeta.title === 'In Person' ? 'IN PERSON' : groupMeta.title}
              </span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-[#64748b]">
              View existing subcategories, keywords, and checklist questions.
            </p>
          </div>
        </div>

        {category ? (
          <button
            type="button"
            onClick={() => onOpenAddSubcategory(category)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#2563eb] px-4 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus size={14} strokeWidth={2.4} />
            Add Sub-Category
          </button>
        ) : null}
      </header>

      <div className="mt-4 border-b border-[#dfe7f2]">
        <button type="button" className="border-b-2 border-[#2563eb] px-0 pb-3 text-[13px] font-bold text-[#2563eb]">
          subcategories Items ({subcategories.length})
        </button>
      </div>

      <DashboardPanel className="mt-8 min-h-0 flex-1 rounded-[6px] border-[#111827]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfe7f2] px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-bold text-[#172033]">subcategories Items</h2>
            <span className="rounded-[4px] border border-[#d9e2ef] bg-[#eef2f6] px-2 py-1 text-[10px] font-bold text-[#64748b]">
              {subcategories.length} Items
            </span>
          </div>
          <button
            type="button"
            aria-label="Filter checklist items"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#dbe4ef] bg-white text-[#64748b] transition-colors hover:text-[#1B3061]"
          >
            <SlidersHorizontal size={14} strokeWidth={2.2} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
          <div className="grid min-w-[880px] grid-cols-[48px_minmax(220px,1fr)_140px_140px_120px] bg-[#f1f5f9] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#64748b]">
            <span>#</span>
            <span>SUBCATEGORIES ITEM</span>
            <span>CHECKLIST</span>
            <span>KEYWORDS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          <div className="min-w-[880px] border-t border-[#111827]">
            {subcategories.length ? (
              subcategories.map((subcategory, subcategoryIndex) => (
                <div key={subcategory.id} className="grid grid-cols-[48px_minmax(220px,1fr)_140px_140px_120px] items-center border-b border-[#111827] px-4 py-3 text-[12px]">
                  <span className="text-[#8a98ad]">{String(subcategoryIndex + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-[#172033]">{subcategory.name}</span>
                  <span>
                    <span className={cn('rounded-full px-3 py-1 text-[10px] font-bold uppercase', subcategory.checklist.length ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]')}>
                      {subcategory.checklist.length ? 'Yes' : 'No'}
                    </span>
                    <span className="sr-only">{subcategory.checklist.length ? 'Checklist: Yes' : 'Checklist: No'}</span>
                  </span>
                  <span aria-label={`Keywords (${subcategory.keywords.length})`} className="font-semibold text-[#334155]">
                    {subcategory.keywords.length}
                  </span>
                  <span className="flex justify-end gap-3">
                    <button type="button" aria-label={`View ${subcategory.name} details`} onClick={() => onOpenSubcategoryDetail(subcategory)}>
                      <Info size={14} strokeWidth={2.2} className="text-[#2563eb]" />
                    </button>
                    {category ? (
                      <button type="button" aria-label={`Edit ${subcategory.name}`} onClick={() => onOpenEditSubcategory(category, subcategory)}>
                        <Pencil size={14} strokeWidth={2.2} className="text-[#0f172a]" />
                      </button>
                    ) : null}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-[13px] font-medium text-[#64748b]">No subcategories found.</div>
            )}
          </div>
        </div>
      </DashboardPanel>
    </div>
  );
};

const CategoryCard = ({
  category,
  onOpenAddCategory,
  onOpenDetail,
  onOpenEditCategory,
}: {
  category: ServiceGroup;
  onOpenAddCategory: (categoryType: ApiServiceCategory['categoryType']) => void;
  onOpenDetail: (categoryTitle: string, subCategoryName: string) => void;
  onOpenEditCategory: (category: ApiServiceCategory) => void;
}) => {
  const Icon = category.icon;

  return (
    <DashboardPanel className="flex min-h-[360px] flex-col rounded-[10px]">
      <div className="space-y-5 p-5">
        <Grip className="text-[#a8b3c4]" size={15} strokeWidth={2} aria-hidden="true" />

        <div className="flex items-center gap-4">
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]', category.iconWrapClass)}>
            <Icon size={16} strokeWidth={2.2} className={category.iconClass} />
          </span>
          <h2 className="min-w-0 flex-1 text-[21px] font-bold leading-7 text-[#172033]">{category.title}</h2>
        </div>

        <p className="text-[12px] font-medium leading-5 text-[#536b8b]">{category.description}</p>
      </div>

      <div className="border-t border-[#eef2f6] px-5 py-4">
        <div className="space-y-3">
          {category.subCategories.length ? (
            category.subCategories.map((subCategory) => (
              <div key={subCategory.id} className="flex min-h-7 w-full items-center gap-2">
                <button
                  type="button"
                  aria-label={`Drag ${subCategory.name}`}
                  onClick={() => onOpenDetail(category.title, subCategory.name)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-[4px] px-0 text-left text-[13px] font-medium text-[#334155]"
                >
                  <span className={cn('h-[5px] w-[5px] shrink-0 rounded-full', category.dotClass)} />
                  <span className="truncate">{subCategory.name}</span>
                </button>
                <span className="rounded-full bg-[#eef2f6] px-2 py-0.5 text-[10px] font-bold text-[#64748b]">
                  {subCategory.subcategories.length}
                </span>
                <button
                  type="button"
                  aria-label={`Edit category ${subCategory.name}`}
                  onClick={() => onOpenEditCategory(subCategory)}
                  className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#64748b] transition-colors hover:bg-[#eef2ff] hover:text-[#1B3061]"
                >
                  <Pencil size={13} strokeWidth={2.2} />
                </button>
              </div>
            ))
          ) : (
            <p className="py-4 text-[12px] font-medium text-[#8a98ad]">No categories found.</p>
          )}
        </div>
      </div>

      <div className="mt-auto p-5 pt-4">
        <button
          type="button"
          aria-label={`Add category under ${category.title}`}
          onClick={() => onOpenAddCategory(category.categoryType)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-[5px] border border-dashed border-[#2f74ff] bg-white text-[12px] font-medium text-[#2563eb] transition-colors hover:bg-white"
        >
          <Plus size={15} strokeWidth={2.2} />
          Add Category
        </button>
      </div>
    </DashboardPanel>
  );
};

const ServiceCategoriesPage = () => {
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryForm, setCategoryForm] = useState<CategoryFormState | null>(null);
  const [formModal, setFormModal] = useState<SubcategoryFormState | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailState>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ServiceSubcategory | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState>(null);

  const serviceGroups = useMemo(() => groupCategoriesByType(categories, searchTerm), [categories, searchTerm]);
  const selectedCategory = useMemo(
    () => categories.find((category) => serviceDetail && category.id === serviceDetail.categoryId),
    [categories, serviceDetail],
  );

  const serviceMetrics: ServiceMetric[] = useMemo(
    () =>
      serviceGroups.map((group) => ({
        value: String(group.categories.reduce((total, category) => total + category.subcategories.length, 0)),
        label: `${group.title} Sub-categories`,
        dotClass: group.dotClass,
      })),
    [serviceGroups],
  );

  const loadCategories = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }

    setErrorMessage('');

    try {
      const categoriesPage = await fetchCategoriesPage();
      setCategories(categoriesPage.categories);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openServiceDetail = (categoryTitle: string, subCategoryName: string) => {
    const group = serviceGroups.find((currentGroup) => currentGroup.title === categoryTitle);
    const category = group?.categories.find((currentCategory) => currentCategory.name === subCategoryName);

    if (category) {
      setServiceDetail({ categoryType: category.categoryType, categoryId: category.id });
    }
  };

  const buildFormState = (category: ApiServiceCategory, subcategory?: ServiceSubcategory): SubcategoryFormState => ({
    mode: subcategory ? 'edit' : 'add',
    categoryType: category.categoryType,
    categoryId: category.id,
    categoryTitle: category.name,
    subCategoryName: subcategory?.name ?? '',
    description: subcategory?.description ?? '',
    draftKeyword: '',
    activeKeywords: subcategory?.keywords ?? [],
    checklistEnabled: Boolean(subcategory?.checklist.length),
    checklistQuestions: subcategory?.checklist ?? [],
    editingSubcategory: subcategory ?? null,
    validationMessage: '',
  });

  const handleOpenAddSubcategory = (category: ApiServiceCategory) => {
    setFormModal(buildFormState(category));
  };

  const handleOpenEditSubcategory = (category: ApiServiceCategory, subcategory: ServiceSubcategory) => {
    setFormModal(buildFormState(category, subcategory));
  };

  const handleOpenSubcategoryDetail = (subcategory: ServiceSubcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleOpenAddCategory = (categoryType: ApiServiceCategory['categoryType']) => {
    setCategoryForm({
      mode: 'add',
      editingCategoryId: null,
      categoryName: '',
      categoryType,
      description: '',
      validationMessage: '',
    });
  };

  const handleOpenEditCategory = (category: ApiServiceCategory) => {
    setCategoryForm({
      mode: 'edit',
      editingCategoryId: category.id,
      categoryName: category.name,
      categoryType: category.categoryType,
      description: category.description,
      validationMessage: '',
    });
  };

  const updateCategoryForm = (changes: Partial<CategoryFormState>) => {
    setCategoryForm((currentForm) => (currentForm ? { ...currentForm, ...changes, validationMessage: '' } : currentForm));
  };

  const updateForm = (changes: Partial<SubcategoryFormState>) => {
    setFormModal((currentForm) => (currentForm ? { ...currentForm, ...changes, validationMessage: '' } : currentForm));
  };

  const handleAddKeyword = () => {
    if (!formModal) return;

    const nextKeyword = formModal.draftKeyword.trim();

    if (!nextKeyword || formModal.activeKeywords.includes(nextKeyword)) return;

    updateForm({
      draftKeyword: '',
      activeKeywords: [nextKeyword, ...formModal.activeKeywords],
    });
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (!formModal) return;

    updateForm({
      activeKeywords: formModal.activeKeywords.filter((currentKeyword) => currentKeyword !== keyword),
    });
  };

  const handleAddChecklistQuestion = () => {
    if (!formModal) return;

    updateForm({
      checklistEnabled: true,
      checklistQuestions: [...formModal.checklistQuestions, createEmptyQuestion(formModal.checklistQuestions.length + 1)],
    });
  };

  const handleUpdateChecklistQuestion = (questionIndex: number, changes: Partial<ChecklistQuestion>) => {
    if (!formModal) return;

    updateForm({
      checklistQuestions: formModal.checklistQuestions.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex ? { ...question, ...changes } : question,
      ),
    });
  };

  const handleRemoveChecklistQuestion = (questionIndex: number) => {
    if (!formModal) return;

    updateForm({
      checklistQuestions: formModal.checklistQuestions.filter((_, currentQuestionIndex) => currentQuestionIndex !== questionIndex),
    });
  };

  const handleMoveChecklistQuestion = (questionIndex: number, direction: -1 | 1) => {
    if (!formModal) return;

    const nextQuestionIndex = questionIndex + direction;
    if (nextQuestionIndex < 0 || nextQuestionIndex >= formModal.checklistQuestions.length) return;

    const nextQuestions = [...formModal.checklistQuestions];
    const [movedQuestion] = nextQuestions.splice(questionIndex, 1);
    nextQuestions.splice(nextQuestionIndex, 0, movedQuestion);

    updateForm({
      checklistQuestions: nextQuestions.map((question, currentQuestionIndex) => ({ ...question, order: currentQuestionIndex + 1 })),
    });
  };

  const handleSaveSubcategory = async () => {
    if (!formModal || isSaving) return;

    if (!formModal.categoryId) {
      updateForm({ validationMessage: 'Select a category before adding a subcategory.' });
      return;
    }

    if (!formModal.subCategoryName.trim()) {
      updateForm({ validationMessage: 'Name is required.' });
      return;
    }

    const checklistQuestions = formModal.checklistEnabled
      ? formModal.checklistQuestions.filter((question) => question.question.trim())
      : [];

    setIsSaving(true);

    try {
      const payload = {
        categoryId: formModal.categoryId,
        name: formModal.subCategoryName,
        description: formModal.description,
        keywords: formModal.activeKeywords,
        checklist: checklistQuestions,
      };

      if (formModal.editingSubcategory) {
        await updateSubcategory(formModal.editingSubcategory.id, payload);
      } else {
        await createSubcategory(payload);
      }

      await loadCategories({ silent: true });
      setFormModal(null);
      setToastMessage({
        title: 'Service category updated',
        message: 'Subcategory changes were saved successfully.',
        variant: 'success',
      });
    } catch (error) {
      setToastMessage({
        title: 'Unable to save',
        message: getErrorMessage(error),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm || isSaving) return;

    if (!categoryForm.categoryName.trim()) {
      updateCategoryForm({ validationMessage: 'Name is required.' });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: categoryForm.categoryName,
        categoryType: categoryForm.categoryType,
        description: categoryForm.description,
      };

      let savedCategory: ApiServiceCategory | null = null;

      if (categoryForm.mode === 'edit' && categoryForm.editingCategoryId) {
        savedCategory = await updateCategory(categoryForm.editingCategoryId, payload);
      } else {
        savedCategory = await createCategory(payload);
      }

      await loadCategories({ silent: true });

      if (savedCategory) {
        setCategories((current) => {
          const exists = current.some((cat) => cat.id === savedCategory!.id);
          if (exists) {
            return current.map((cat) => (cat.id === savedCategory!.id ? { ...cat, ...savedCategory! } : cat));
          }
          return [...current, savedCategory!];
        });
      }

      setCategoryForm(null);
      setToastMessage({
        title: categoryForm.mode === 'edit' ? 'Service category updated' : 'Service category created',
        message: categoryForm.mode === 'edit' ? 'Category changes were saved successfully.' : 'Category was added successfully.',
        variant: 'success',
      });
    } catch (error) {
      setToastMessage({
        title: 'Unable to save',
        message: getErrorMessage(error),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardPageShell contentClassName="px-4 pb-10 pt-4">
      <div className="hidden">{referenceExamples.join(' ')}</div>
      {serviceDetail ? (
        <ServiceChecklistDetailView
          category={selectedCategory}
          detail={serviceDetail}
          onBack={() => setServiceDetail(null)}
          onOpenAddSubcategory={handleOpenAddSubcategory}
          onOpenSubcategoryDetail={handleOpenSubcategoryDetail}
          onOpenEditSubcategory={handleOpenEditSubcategory}
        />
      ) : (
        <div className="animate-dashboard-entry space-y-4">
          <header>
            <h1 className="text-[22px] font-bold leading-7 text-[#172033]">Service Categories</h1>
            <p className="mt-1 text-[12px] font-medium text-[#536173]">
              Manage and organize the types of services offered on the platform.
            </p>
          </header>

          <div className="grid gap-4 px-5 sm:grid-cols-2 xl:grid-cols-3">
            {serviceMetrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>

          <div className="border-b border-[#e7edf5] pb-3">
            <SearchField value={searchTerm} onChange={setSearchTerm} />
          </div>

          {isLoading ? (
            <DashboardPanel className="p-8 text-center text-[13px] font-semibold text-[#64748b]">Loading categories...</DashboardPanel>
          ) : null}

          {errorMessage ? (
            <DashboardPanel className="border-[#fecaca] bg-[#fff1f2] p-4 text-[13px] font-semibold text-[#b91c1c]">
              {errorMessage}
            </DashboardPanel>
          ) : null}

          {!isLoading && !errorMessage ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {serviceGroups.map((category) => (
                <CategoryCard
                  key={category.title}
                  category={category}
                  onOpenAddCategory={handleOpenAddCategory}
                  onOpenDetail={openServiceDetail}
                  onOpenEditCategory={handleOpenEditCategory}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {formModal ? (
        <SubcategoryFormModal
          categories={categories.filter((category) => category.categoryType === formModal.categoryType)}
          form={formModal}
          isSaving={isSaving}
          onClose={() => setFormModal(null)}
          onAddKeyword={handleAddKeyword}
          onRemoveKeyword={handleRemoveKeyword}
          onAddChecklistQuestion={handleAddChecklistQuestion}
          onUpdateChecklistQuestion={handleUpdateChecklistQuestion}
          onRemoveChecklistQuestion={handleRemoveChecklistQuestion}
          onMoveChecklistQuestion={handleMoveChecklistQuestion}
          onSave={handleSaveSubcategory}
          onUpdate={updateForm}
        />
      ) : null}

      {categoryForm ? (
        <CategoryFormModal
          form={categoryForm}
          isSaving={isSaving}
          onClose={() => setCategoryForm(null)}
          onSave={handleSaveCategory}
          onUpdate={updateCategoryForm}
        />
      ) : null}

      {selectedSubcategory ? (
        <SubcategoryDetailModal selectedSubcategory={selectedSubcategory} onClose={() => setSelectedSubcategory(null)} />
      ) : null}

      {toastMessage ? (
        <AppToast
          title={toastMessage.title}
          message={toastMessage.message}
          variant={toastMessage.variant}
          onDismiss={() => setToastMessage(null)}
        />
      ) : null}
    </DashboardPageShell>
  );
};

export default ServiceCategoriesPage;
