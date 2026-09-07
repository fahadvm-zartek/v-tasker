'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileUp,
  Grip,
  Info,
  KeyRound,
  List,
  MapPin,
  Minus,
  Monitor,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel, cn } from '../components';

type ServiceMetric = {
  value: string;
  label: string;
  dotClass: string;
};

type ServiceSubCategory = {
  name: string;
};

type ServiceCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  dotClass: string;
  canAddKeyword?: boolean;
  subCategories: ServiceSubCategory[];
};

type KeywordModalState = {
  categoryTitle: string;
  subCategoryName: string;
  draftKeyword: string;
  activeKeywords: string[];
} | null;

type ChecklistModalState = {
  categoryTitle: string;
  fieldType: string;
  fieldName: string;
} | null;

type ServiceDetailState = {
  categoryTitle: string;
  subCategoryName: string;
} | null;

type ChecklistFieldType = {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

const serviceMetrics: ServiceMetric[] = [
  { value: '12', label: 'In Person Sub-categories', dotClass: 'bg-[#ff9f2d]' },
  { value: '8', label: 'Professional Sub-categories', dotClass: 'bg-[#3b82f6]' },
  { value: '11', label: 'Online Sub-categories', dotClass: 'bg-[#9a4d17]' },
];

const serviceCategories: ServiceCategory[] = [
  {
    title: 'In Person',
    description: 'Services delivered at a physical location.',
    icon: MapPin,
    iconClass: 'fill-[#ff6b1a] text-[#ff6b1a]',
    iconWrapClass: 'bg-[#ffe8c8]',
    dotClass: 'bg-[#ff8a35]',
    canAddKeyword: true,
    subCategories: [
      { name: 'Home Cleaning' },
      { name: 'Home Cleaning' },
      { name: 'Home Cleaning' },
      { name: 'Home Cleaning' },
    ],
  },
  {
    title: 'Professional',
    description: 'Certified and licensed professional services.',
    icon: Briefcase,
    iconClass: 'fill-[#3b82f6] text-[#3b82f6]',
    iconWrapClass: 'bg-[#dbeafe]',
    dotClass: 'bg-[#3b82f6]',
    subCategories: [
      { name: 'Legal Advice' },
      { name: 'Legal Advice' },
      { name: 'Legal Advice' },
      { name: 'Legal Advice' },
    ],
  },
  {
    title: 'Online',
    description: 'Remote services delivered digitally.',
    icon: Monitor,
    iconClass: 'fill-[#8b4513] text-[#8b4513]',
    iconWrapClass: 'bg-[#ffe9bd]',
    dotClass: 'bg-[#9a4d17]',
    subCategories: [
      { name: 'Online Tutoring' },
      { name: 'Online Tutoring' },
      { name: 'Online Tutoring' },
    ],
  },
];

const defaultActiveKeywords = ['Deep Clean', 'Residential', 'Express', 'Move Out'];

const checklistFieldTypes: ChecklistFieldType[] = [
  { label: 'Text field', icon: List },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Location', icon: MapPin },
  { label: 'Date & Time', icon: Clock3 },
];

const MetricCard = ({ metric }: { metric: ServiceMetric }) => (
  <article className="flex h-16 flex-col justify-center rounded-[8px] border border-[#dde5f1] bg-white px-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:h-[65px]">
    <p className="text-[22px] font-bold leading-6 text-[#2563eb]">{metric.value}</p>
    <div className="mt-2 flex items-center gap-2">
      <span className={cn('h-[5px] w-[5px] rounded-full', metric.dotClass)} />
      <span className="text-[12px] font-medium leading-4 text-[#64748b]">{metric.label}</span>
    </div>
  </article>
);

const SearchField = () => (
  <label className="relative block h-8 w-full max-w-[490px]">
    <Search
      aria-hidden="true"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a98ad]"
      size={14}
      strokeWidth={2.1}
    />
    <input
      type="search"
      placeholder="Search categories..."
      className="h-full w-full rounded-[7px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[12px] font-medium text-[#1f2937] outline-hidden placeholder:text-[#8a98ad] focus:border-[#2f74ff] focus:ring-2 focus:ring-[#2f74ff]/10"
    />
  </label>
);

const ManageKeywordsModal = ({
  modal,
  onAddKeyword,
  onClose,
  onSave,
  onUpdateDraft,
}: {
  modal: NonNullable<KeywordModalState>;
  onAddKeyword: () => void;
  onClose: () => void;
  onSave: () => void;
  onUpdateDraft: (value: string) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-keywords-title"
      className="w-full max-w-[560px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#e4eaf2] px-4 py-4">
        <div>
          <h2 id="manage-keywords-title" className="text-[18px] font-bold leading-6 text-[#172033]">
            Manage Keywords
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#e68a2e]" />
            <span>Sub-category:</span>
            <span className="font-bold text-[#26354d]">{modal.subCategoryName}</span>
          </div>
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

      <div className="space-y-6 px-4 py-5">
        <div>
          <label
            htmlFor="new-service-keyword"
            className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#334155]"
          >
            ADD NEW KEYWORD
          </label>
          <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_68px]">
            <input
              id="new-service-keyword"
              type="text"
              value={modal.draftKeyword}
              onChange={(event) => onUpdateDraft(event.currentTarget.value)}
              placeholder="e.g. Eco-friendly"
              className="h-9 rounded-[7px] border border-[#d5dfec] bg-white px-9 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#8996a8] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
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
        </div>

        <div>
          <h3 className="border-b border-[#e7edf5] pb-2 text-[11px] font-bold uppercase tracking-[0.04em] text-[#334155]">
            ACTIVE KEYWORDS ({modal.activeKeywords.length})
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {modal.activeKeywords.map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="inline-flex h-7 items-center rounded-full border border-[#d8e2ef] bg-[#edf3fb] px-3 text-[12px] font-medium text-[#26354d]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-3 border-t border-[#e4eaf2] bg-[#f6f8fb] px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-[6px] border border-[#d5dfec] bg-white px-4 text-[12px] font-medium text-[#334155] transition-colors hover:bg-[#f8fafc]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="h-9 rounded-[6px] bg-[#e68a2e] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#cf7721]"
        >
          Save Keywords
        </button>
      </footer>
    </section>
  </div>
);

const AddChecklistItemModal = ({
  modal,
  onClose,
  onFieldNameChange,
  onFieldTypeChange,
  onSave,
}: {
  modal: NonNullable<ChecklistModalState>;
  onClose: () => void;
  onFieldNameChange: (value: string) => void;
  onFieldTypeChange: (value: string) => void;
  onSave: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-checklist-item-title"
      className="max-h-[calc(100vh-32px)] w-full max-w-[500px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex h-14 items-center justify-between border-b border-[#e4eaf2] px-5">
        <h2 id="add-checklist-item-title" className="text-[18px] font-bold leading-6 text-[#172033]">
          Add New Checklist Item
        </h2>
        <button
          type="button"
          aria-label="Close add checklist item modal"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#99a5b8] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={17} strokeWidth={2.4} />
        </button>
      </header>

      <div className="space-y-4 px-5 py-4">
        <div>
          <label htmlFor="checklist-field-type" className="text-[11px] font-medium text-[#334155]">
            Field Type <span className="text-[#ef4444]">*</span>
          </label>
          <button
            id="checklist-field-type"
            type="button"
            aria-label="Select checklist field type"
            className="mt-1 flex h-10 w-full items-center justify-between rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-left text-[12px] font-medium text-[#334155]"
          >
            {modal.fieldType}
            <ChevronDown size={14} strokeWidth={2.3} className="text-[#8a98ad]" />
          </button>
          <div className="overflow-hidden rounded-b-[5px] border border-t-0 border-[#d8e0ec]">
            {checklistFieldTypes.map((fieldType) => {
              const FieldIcon = fieldType.icon;
              const isSelected = fieldType.label === modal.fieldType;

              return (
                <button
                  key={fieldType.label}
                  type="button"
                  onClick={() => onFieldTypeChange(fieldType.label)}
                  className={cn(
                    'flex h-[34px] w-full items-center gap-3 px-4 text-left text-[11px] font-medium transition-colors',
                    isSelected ? 'bg-[#f0f7ff] text-[#2563eb]' : 'bg-white text-[#26354d] hover:bg-[#f8fafc]',
                  )}
                >
                  <FieldIcon
                    size={14}
                    strokeWidth={2.1}
                    className={isSelected ? 'text-[#2563eb]' : 'text-[#64748b]'}
                  />
                  <span className="min-w-0 flex-1 truncate">{fieldType.label}</span>
                  {isSelected ? <Check size={14} strokeWidth={2.4} className="text-[#2563eb]" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="checklist-field-name" className="text-[11px] font-medium text-[#334155]">
            Field Name <span className="text-[#ef4444]">*</span>
          </label>
          <input
            id="checklist-field-name"
            type="text"
            value={modal.fieldName}
            onChange={(event) => onFieldNameChange(event.currentTarget.value)}
            placeholder="e.g. Number of Bathrooms"
            className="mt-1 h-10 w-full rounded-[5px] border border-[#d8e0ec] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-[#334155]">
            Field Icon <span className="text-[#8a98ad]">(Optional)</span>
          </label>
          <div className="mt-1 flex h-[158px] flex-col items-center justify-center rounded-[5px] border border-dashed border-[#d7e3f4] bg-[#f8faff] text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7e3f4] bg-white text-[#8aa0bd]">
              <FileUp size={18} strokeWidth={2} />
            </span>
            <p className="mt-3 text-[11px] font-medium text-[#2563eb]">
              Click to upload <span className="text-[#64748b]">or drag and drop</span>
            </p>
            <p className="mt-1 text-[10px] font-medium text-[#7a8798]">SVG or PNG (Max. 2MB)</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-[5px] bg-[#eef2ff] px-4 py-3">
          <Info size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#2563eb]" />
          <div>
            <h3 className="text-[11px] font-bold text-[#26354d]">Checklist Item Visibility</h3>
            <p className="mt-1 text-[11px] font-medium leading-4 text-[#66758b]">
              This item will be visible to field workers assigned to tasks within this service category.
            </p>
          </div>
        </div>
      </div>

      <footer className="flex justify-end gap-3 bg-[#f6f8fb] px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-[6px] px-4 text-[11px] font-medium text-[#334155] transition-colors hover:bg-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#2563eb] px-5 text-[11px] font-bold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          <Plus size={13} strokeWidth={2.4} />
          Add Field
        </button>
      </footer>
    </section>
  </div>
);

const ServiceChecklistDetailView = ({
  detail,
  onBack,
  onOpenChecklist,
}: {
  detail: NonNullable<ServiceDetailState>;
  onBack: () => void;
  onOpenChecklist: (categoryTitle: string) => void;
}) => (
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
            <h1 className="text-[22px] font-bold leading-7 text-[#172033]">{detail.subCategoryName}</h1>
            <span className="rounded-full bg-[#fff0d7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#e68a2e]">
              {detail.categoryTitle === 'In Person' ? 'IN PERSON' : detail.categoryTitle}
            </span>
          </div>
          <p className="mt-1 text-[12px] font-medium text-[#64748b]">
            Checklist of items required for the Home Cleaning service offering.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenChecklist(detail.categoryTitle)}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#2563eb] px-4 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-colors hover:bg-[#1d4ed8]"
      >
        <Plus size={14} strokeWidth={2.4} />
        Add New Checklist Item
      </button>
    </header>

    <div className="mt-4 border-b border-[#dfe7f2]">
      <button
        type="button"
        className="border-b-2 border-[#2563eb] px-0 pb-3 text-[13px] font-bold text-[#2563eb]"
      >
        Checklist Items (14)
      </button>
    </div>

    <DashboardPanel className="mt-8 min-h-0 flex-1 rounded-[6px] border-[#111827]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfe7f2] px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#172033]">Checklist Items</h2>
          <span className="rounded-[4px] border border-[#d9e2ef] bg-[#eef2f6] px-2 py-1 text-[10px] font-bold text-[#64748b]">
            14 Items
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative block h-9 w-[240px] max-w-full">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a98ad]"
              size={14}
              strokeWidth={2.1}
            />
            <input
              type="search"
              placeholder="Search..."
              className="h-full w-full rounded-[6px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#8a98ad] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
          </label>
          <button
            type="button"
            aria-label="Filter checklist items"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#dbe4ef] bg-white text-[#64748b] transition-colors hover:text-[#1B3061]"
          >
            <SlidersHorizontal size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
        <div className="grid min-w-[880px] grid-cols-[48px_minmax(240px,1fr)_140px_180px_90px] bg-[#f1f5f9] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#64748b]">
          <span>#</span>
          <span>CHECKLIST ITEM</span>
          <span>REQUIRED</span>
          <span>TYPE</span>
          <span className="text-right">ACTIONS</span>
        </div>

        <div className="min-w-[880px] border-t border-[#111827]">
          <div className="grid grid-cols-[48px_minmax(240px,1fr)_140px_180px_90px] items-center border-b border-[#111827] px-4 py-2 text-[12px]">
            <span className="text-[#8a98ad]">01</span>
            <span>
              <span className="inline-flex h-8 min-w-[280px] items-center rounded-[6px] border border-[#cbd5e1] bg-white px-4 text-[#64748b]">
                Service Type
              </span>
            </span>
            <span>
              <Check size={17} strokeWidth={2.4} className="text-[#16b981]" />
            </span>
            <span>
              <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-[10px] font-bold uppercase text-[#2563eb]">
                SELECTION
              </span>
            </span>
            <span className="flex justify-end">
              <Pencil size={14} strokeWidth={2.2} className="text-[#0f172a]" />
            </span>
          </div>

          <section className="border-b border-[#111827] bg-[#eef3ff] px-5 py-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[16px] font-bold text-[#172033]">Edit Checklist Item: Service Type</h3>
              <X size={16} strokeWidth={2.3} className="text-[#8a98ad]" />
            </div>
            <h4 className="mt-7 text-[11px] font-bold text-[#334155]">Options</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                { label: 'Regular cleaning', icon: Briefcase },
                { label: 'End of lease cleaning', icon: KeyRound },
              ].map((option) => {
                const OptionIcon = option.icon;

                return (
                  <div
                    key={option.label}
                    className="flex h-14 items-center justify-between gap-3 rounded-[6px] bg-white px-4 text-[13px] font-medium text-[#172033]"
                  >
                    <span className="flex items-center gap-3">
                      <OptionIcon size={16} strokeWidth={2.1} className="text-[#64748b]" />
                      {option.label}
                    </span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#ff1f2d] text-[#ff1f2d]">
                      <Minus size={10} strokeWidth={2.4} />
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <button type="button" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2563eb]">
                <Plus size={14} strokeWidth={2.3} />
                Add New Field
              </button>
              <div className="flex gap-3">
                <button type="button" className="h-9 rounded-[6px] border border-[#d5dfec] bg-white px-5 text-[12px] font-medium text-[#334155]">
                  Cancel
                </button>
                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#2563eb] px-5 text-[12px] font-bold text-white">
                  <Check size={13} strokeWidth={2.4} />
                  Save Changes
                </button>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-[6px] bg-white px-4 py-4">
              <div>
                <p className="text-[12px] font-bold text-[#172033]">Mark as Required</p>
                <p className="mt-1 text-[11px] font-medium text-[#7a8798]">
                  Providers cannot offer this service without submitting this item.
                </p>
              </div>
              <span className="relative h-7 w-12 rounded-full bg-[#16b981]">
                <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
              </span>
            </div>
          </section>

          <div className="grid grid-cols-[48px_minmax(240px,1fr)_140px_180px_90px] items-center border-b border-[#111827] px-4 py-3 text-[12px]">
            <span className="text-[#8a98ad]">02</span>
            <span className="font-medium text-[#172033]">Number of Rooms</span>
            <span>
              <Check size={17} strokeWidth={2.4} className="text-[#16b981]" />
            </span>
            <span>
              <span className="rounded-full bg-[#ffedd5] px-3 py-1 text-[10px] font-bold uppercase text-[#e68a2e]">
                COUNTER
              </span>
            </span>
            <span className="flex justify-end">
              <Pencil size={14} strokeWidth={2.2} className="text-[#0f172a]" />
            </span>
          </div>

          <section className="bg-[#eef3ff] px-5 py-8">
            <h3 className="text-[16px] font-bold text-[#172033]">Edit Checklist Item: Number of Rooms</h3>
            <h4 className="mt-7 text-[11px] font-bold text-[#334155]">Room Counters</h4>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Bedrooms', value: '2', icon: BedDouble },
                { label: 'Bathrooms', value: '1', icon: Bath },
              ].map((counter) => {
                const CounterIcon = counter.icon;

                return (
                  <div
                    key={counter.label}
                    className="flex h-14 items-center justify-between gap-4 rounded-[6px] bg-white px-4 text-[13px] font-medium text-[#172033]"
                  >
                    <span className="flex items-center gap-3">
                      <CounterIcon size={16} strokeWidth={2.1} className="text-[#64748b]" />
                      {counter.label}
                    </span>
                    <span className="flex items-center gap-4">
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#d5dfec] text-[#64748b]">
                        <Minus size={13} strokeWidth={2.3} />
                      </button>
                      <span className="text-[16px] font-bold">{counter.value}</span>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#172033] text-white">
                        <Plus size={13} strokeWidth={2.3} />
                      </button>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#ff1f2d] text-[#ff1f2d]">
                        <Minus size={10} strokeWidth={2.4} />
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
            <button type="button" className="mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-[#2563eb]">
              <Plus size={14} strokeWidth={2.3} />
              Add New Field
            </button>
            <div className="mt-6 flex items-center justify-between rounded-[6px] bg-white px-4 py-4">
              <div>
                <p className="text-[12px] font-bold text-[#172033]">Mark as Required</p>
                <p className="mt-1 text-[11px] font-medium text-[#7a8798]">
                  Providers cannot offer this service without submitting this item.
                </p>
              </div>
              <span className="relative h-7 w-12 rounded-full bg-[#16b981]">
                <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
              </span>
            </div>
          </section>
        </div>
      </div>
    </DashboardPanel>
  </div>
);

const CategoryCard = ({
  category,
  onOpenChecklist,
  onOpenDetail,
  onOpenKeywords,
}: {
  category: ServiceCategory;
  onOpenChecklist: (categoryTitle: string) => void;
  onOpenDetail: (categoryTitle: string, subCategoryName: string) => void;
  onOpenKeywords: (categoryTitle: string, subCategoryName: string) => void;
}) => {
  const Icon = category.icon;
  const firstSubCategory = category.subCategories[0];

  return (
    <DashboardPanel
      className="flex min-h-[360px] flex-col rounded-[10px]"
    >
      <div className="space-y-5 p-5">
        <Grip className="text-[#a8b3c4]" size={15} strokeWidth={2} aria-hidden="true" />

        <div className="flex items-center gap-4">
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]', category.iconWrapClass)}>
            <Icon size={16} strokeWidth={2.2} className={category.iconClass} />
          </span>
          <h2 className="min-w-0 flex-1 text-[21px] font-bold leading-7 text-[#172033]">{category.title}</h2>
          {category.canAddKeyword ? (
            <button
              type="button"
              onClick={() => onOpenKeywords(category.title, firstSubCategory?.name ?? category.title)}
              className="inline-flex h-7 shrink-0 items-center justify-center rounded-[4px] bg-[#df8226] px-3 text-[10px] font-bold text-white transition-colors hover:bg-[#c96f1c]"
            >
              + Add Keyword
            </button>
          ) : null}
        </div>

        <p className="text-[12px] font-medium leading-5 text-[#536b8b]">{category.description}</p>
      </div>

      <div className="border-t border-[#eef2f6] px-5 py-4">
        <div className="space-y-3">
          {category.subCategories.map((subCategory, index) => (
            <button
              key={`${category.title}-${subCategory.name}-${index}`}
              type="button"
              aria-label={`Drag ${subCategory.name}`}
              onClick={() => onOpenDetail(category.title, subCategory.name)}
              className="flex h-6 w-full items-center gap-3 rounded-[4px] px-0 text-left text-[13px] font-medium text-[#334155]"
            >
              <span className={cn('h-[5px] w-[5px] shrink-0 rounded-full', category.dotClass)} />
              <span className="truncate">{subCategory.name}</span>
            </button>
          ))}
          </div>
      </div>

      <div className="mt-auto p-5 pt-4">
        <button
          type="button"
          aria-label={`Add sub-category to ${category.title}`}
          onClick={() => onOpenChecklist(category.title)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-[5px] border border-dashed border-[#2f74ff] bg-white text-[12px] font-medium text-[#2563eb] transition-colors hover:bg-[#f8fbff]"
        >
          <Plus size={15} strokeWidth={2.2} />
          Add Sub-Category
        </button>
      </div>
    </DashboardPanel>
  );
};

const ServiceCategoriesPage = () => {
  const [checklistModal, setChecklistModal] = useState<ChecklistModalState>(null);
  const [keywordModal, setKeywordModal] = useState<KeywordModalState>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailState>(null);

  const openKeywordModal = (categoryTitle: string, subCategoryName: string) => {
    setKeywordModal({
      categoryTitle,
      subCategoryName,
      draftKeyword: '',
      activeKeywords: defaultActiveKeywords,
    });
  };

  const openServiceDetail = (categoryTitle: string, subCategoryName: string) => {
    setServiceDetail({ categoryTitle, subCategoryName });
  };

  const handleAddKeyword = () => {
    if (!keywordModal) return;

    const nextKeyword = keywordModal.draftKeyword.trim();

    if (!nextKeyword) return;

    setKeywordModal((currentModal) =>
      currentModal
        ? {
            ...currentModal,
            draftKeyword: '',
            activeKeywords: [nextKeyword, ...currentModal.activeKeywords],
          }
        : currentModal,
    );
  };

  return (
    <DashboardPageShell contentClassName="px-4 pb-10 pt-4">
      {serviceDetail ? (
        <ServiceChecklistDetailView
          detail={serviceDetail}
          onBack={() => setServiceDetail(null)}
          onOpenChecklist={(categoryTitle) =>
            setChecklistModal({
              categoryTitle,
              fieldType: 'Text field',
              fieldName: '',
            })
          }
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
            <SearchField />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <CategoryCard
                key={category.title}
                category={category}
                onOpenChecklist={(categoryTitle) =>
                  setChecklistModal({
                    categoryTitle,
                    fieldType: 'Text field',
                    fieldName: '',
                  })
                }
                onOpenDetail={openServiceDetail}
                onOpenKeywords={openKeywordModal}
              />
            ))}
          </div>
        </div>
      )}
      {checklistModal ? (
        <AddChecklistItemModal
          modal={checklistModal}
          onClose={() => setChecklistModal(null)}
          onSave={() => setChecklistModal(null)}
          onFieldTypeChange={(fieldType) =>
            setChecklistModal((currentModal) =>
              currentModal ? { ...currentModal, fieldType } : currentModal,
            )
          }
          onFieldNameChange={(fieldName) =>
            setChecklistModal((currentModal) =>
              currentModal ? { ...currentModal, fieldName } : currentModal,
            )
          }
        />
      ) : null}
      {keywordModal ? (
        <ManageKeywordsModal
          modal={keywordModal}
          onClose={() => setKeywordModal(null)}
          onSave={() => setKeywordModal(null)}
          onAddKeyword={handleAddKeyword}
          onUpdateDraft={(draftKeyword) =>
            setKeywordModal((currentModal) =>
              currentModal ? { ...currentModal, draftKeyword } : currentModal,
            )
          }
        />
      ) : null}
    </DashboardPageShell>
  );
};

export default ServiceCategoriesPage;
