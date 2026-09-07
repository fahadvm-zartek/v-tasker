import React from 'react';
import { Briefcase, Grip, MapPin, Monitor, Plus, Search } from 'lucide-react';
import { DashboardPageShell, DashboardPanel, cn } from '../components';

type ServiceMetric = {
  value: string;
  label: string;
  dotClass: string;
};

type ServiceSubCategory = {
  name: string;
  ghost?: boolean;
};

type ServiceCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  dotClass: string;
  canAddKeyword?: boolean;
  isActive?: boolean;
  subCategories: ServiceSubCategory[];
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
    isActive: true,
    subCategories: [
      { name: 'Home Cleaning' },
      { name: 'Reserved drop area', ghost: true },
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

const CategoryCard = ({ category }: { category: ServiceCategory }) => {
  const Icon = category.icon;

  return (
    <DashboardPanel
      className={cn(
        'flex min-h-[360px] flex-col rounded-[10px]',
        category.isActive && 'border-[#2f74ff] shadow-[0_0_0_1px_rgba(47,116,255,0.06)]',
      )}
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
          {category.subCategories.map((subCategory, index) =>
            subCategory.ghost ? (
              <div
                key={`${category.title}-${subCategory.name}-${index}`}
                className="h-8 rounded-[4px] border border-dashed border-[#2f74ff] bg-[#f8fbff]"
                aria-hidden="true"
              />
            ) : (
              <button
                key={`${category.title}-${subCategory.name}-${index}`}
                type="button"
                aria-label={`Drag ${subCategory.name}`}
                className={cn(
                  'flex h-6 w-full items-center gap-3 rounded-[4px] text-left text-[13px] font-medium text-[#334155]',
                  category.isActive && index === 0
                    ? 'border border-[#2f74ff] bg-white px-0 shadow-[0_0_0_1px_rgba(47,116,255,0.04)]'
                    : 'px-0',
                )}
              >
                <span className={cn('h-[5px] w-[5px] shrink-0 rounded-full', category.dotClass)} />
                <span className="truncate">{subCategory.name}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-auto p-5 pt-4">
        <button
          type="button"
          aria-label={`Add sub-category to ${category.title}`}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-[5px] border border-dashed border-[#2f74ff] bg-white text-[12px] font-medium text-[#2563eb] transition-colors hover:bg-[#f8fbff]"
        >
          <Plus size={15} strokeWidth={2.2} />
          Add Sub-Category
        </button>
      </div>
    </DashboardPanel>
  );
};

const ServiceCategoriesPage = () => (
  <DashboardPageShell contentClassName="px-4 pb-10 pt-4">
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
          <CategoryCard key={category.title} category={category} />
        ))}
      </div>
    </div>
  </DashboardPageShell>
);

export default ServiceCategoriesPage;
