'use client';

import { useState } from 'react';
import {
  ArrowUp,
  Ban,
  ChevronDown,
  Flag,
  Plus,
  ShieldAlert,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSecondaryButton,
  DashboardSelectButton,
} from '../../components';

type RuleMetricCard = {
  title: string;
  value: string;
  helper?: string;
  trend?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  glowClass: string;
};

type RestrictedKeyword = {
  keyword: string;
  category: string;
  categoryClass: string;
  frequency: string;
  lastDetected: string;
  enabled: boolean;
  muted?: boolean;
};

type TopFlaggedKeyword = {
  rank: number;
  keyword: string;
  hits: string;
  rankClass: string;
};

type NewKeywordForm = {
  keywordName: string;
  category: string;
  matchType: string;
  moderationScore: string;
  isActive: boolean;
};

type AddKeywordDropdown = 'category' | 'matchType' | null;

const defaultNewKeywordForm: NewKeywordForm = {
  keywordName: '',
  category: 'Select Category...',
  matchType: 'Exact Match',
  moderationScore: '50',
  isActive: true,
};

const categoryOptions = [
  'Scam / Spam',
  'Phone',
  'Email',
  'URL',
  'Social Media',
  'Payment',
  'Abuse',
  'Threat',
  'Scam',
  'Platform Bypass',
];

const matchTypeOptions = ['Exact Match', 'Contains'];

const ruleMetricCards: RuleMetricCard[] = [
  {
    title: 'Total Flagged Content',
    value: '1,248',
    trend: '+12%',
    icon: Flag,
    iconClass: 'text-[#ff365f]',
    glowClass: 'from-[#fff1f4] to-white',
  },
  {
    title: 'Restricted Keywords',
    value: '342',
    helper: 'Active rules',
    icon: Ban,
    iconClass: 'text-[#1B3061]',
    glowClass: 'from-[#f2f6ff] to-white',
  },
  {
    title: 'Daily Flag Volume',
    value: '45',
    trend: '+5%',
    icon: TrendingUp,
    iconClass: 'text-[#f59e0b]',
    glowClass: 'from-[#fff7e6] to-white',
  },
];

const restrictedKeywords: RestrictedKeyword[] = [
  {
    keyword: 'urgent payment',
    category: 'Scam / Spam',
    categoryClass: 'bg-[#fff0d7] text-[#70440a]',
    frequency: '1,402',
    lastDetected: '2 mins ago',
    enabled: true,
  },
  {
    keyword: 'crypto wallet',
    category: 'Scam / Spam',
    categoryClass: 'bg-[#fff0d7] text-[#70440a]',
    frequency: '845',
    lastDetected: '1 hour ago',
    enabled: true,
  },
  {
    keyword: 'f***',
    category: 'Profanity',
    categoryClass: 'bg-[#ffe1e6] text-[#e11d48]',
    frequency: '523',
    lastDetected: '4 hours ago',
    enabled: true,
  },
  {
    keyword: 'competitor_app_name',
    category: 'Competitor',
    categoryClass: 'bg-[#e9edf3] text-[#7b8798]',
    frequency: '12',
    lastDetected: '2 days ago',
    enabled: false,
    muted: true,
  },
];

const topFlaggedKeywords: TopFlaggedKeyword[] = [
  { rank: 1, keyword: 'urgent payment', hits: '1,402 hits', rankClass: 'bg-[#ffe7e9] text-[#ef4444]' },
  { rank: 2, keyword: 'crypto wallet', hits: '845 hits', rankClass: 'bg-[#fff2d9] text-[#b7791f]' },
  { rank: 3, keyword: 'f***', hits: '523 hits', rankClass: 'bg-[#e5edff] text-[#3159c8]' },
  { rank: 4, keyword: 'wire transfer', hits: '312 hits', rankClass: 'bg-[#eef2f7] text-[#7b8798]' },
];

const RuleMetricCardView = ({ metric }: { metric: RuleMetricCard }) => {
  const Icon = metric.icon;

  return (
    <DashboardMetricCard
      title={metric.title}
      value={metric.value}
      icon={Icon}
      iconClass={metric.iconClass}
      iconWrapClass="bg-[#eaf0ff]"
    >
      <div className="mt-1 flex items-center gap-2">
        {metric.helper ? <span className="text-[11px] font-medium text-[#8a98ad]">{metric.helper}</span> : null}
        {metric.trend ? (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#10a873]">
            <ArrowUp size={11} strokeWidth={2.4} />
            {metric.trend}
          </span>
        ) : null}
      </div>
    </DashboardMetricCard>
  );
};

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    type="button"
    aria-pressed={enabled}
    onClick={() => onToggle()}
    className={`relative h-[22px] w-[38px] rounded-full transition-colors ${enabled ? 'bg-[#1dbf91]' : 'bg-[#e7ebf1]'}`}
  >
    <span
      className={`absolute left-[3px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.18)] transition-transform ${
        enabled ? 'translate-x-[16px]' : 'translate-x-0'
      }`}
    />
  </button>
);

const AddKeywordField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="block">
    <span className="mb-2 block text-[14px] font-medium text-[#2f3b4f]">{label}</span>
    {children}
  </div>
);

const DropdownField = ({
  id,
  value,
  options,
  openDropdown,
  onSelect,
  onToggle,
}: {
  id: Exclude<AddKeywordDropdown, null>;
  value: string;
  options: string[];
  openDropdown: AddKeywordDropdown;
  onSelect: (value: string) => void;
  onToggle: (id: Exclude<AddKeywordDropdown, null>) => void;
}) => (
  <div className="relative">
    <DashboardSelectButton
      ariaExpanded={openDropdown === id}
      className="h-11 w-full rounded-[7px] px-4 text-left text-[14px]"
      onClick={() => onToggle(id)}
    >
      {value}
      <ChevronDown size={16} className={`text-[#66758b] transition-transform ${openDropdown === id ? 'rotate-180' : ''}`} />
    </DashboardSelectButton>
    {openDropdown === id ? (
      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[70] max-h-[360px] overflow-y-auto rounded-[7px] border border-[#c6d2e2] bg-white py-1 shadow-[0_14px_32px_rgba(15,23,42,0.16)]">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`flex h-9 w-full items-center justify-between px-4 text-left text-[14px] font-medium transition-colors ${
              option === value ? 'bg-[#f1f3f5] text-[#111827]' : 'text-[#2f3b4f] hover:bg-[#f7f8fa]'
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
            {option === value ? <span className="text-[#1B3061]">Selected</span> : null}
          </button>
        ))}
      </div>
    ) : null}
  </div>
);

const AddRestrictedKeywordModal = ({
  form,
  openDropdown,
  onClose,
  onSave,
  onToggleActive,
  onToggleDropdown,
  onUpdate,
}: {
  form: NewKeywordForm;
  openDropdown: AddKeywordDropdown;
  onClose: () => void;
  onSave: () => void;
  onToggleActive: () => void;
  onToggleDropdown: (id: Exclude<AddKeywordDropdown, null>) => void;
  onUpdate: (updates: Partial<NewKeywordForm>) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-[1px]">
    <section className="max-h-[calc(100vh-32px)] w-full max-w-[620px] overflow-visible rounded-[10px] border border-[#cbd5e1] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.32)]">
      <header className="flex items-center justify-between border-b border-[#dfe6f0] px-7 py-5">
        <h2 className="text-[20px] font-bold leading-7 text-[#111827]">Add Restricted Keyword</h2>
        <button
          type="button"
          aria-label="Close add restricted keyword modal"
          onClick={onClose}
          className="text-[#8a98ad] transition hover:text-[#111827]"
        >
          <X size={22} strokeWidth={2.2} />
        </button>
      </header>

      <div className="space-y-5 px-7 py-6">
        <AddKeywordField label="Keyword Name">
          <input
            value={form.keywordName}
            onChange={(event) => onUpdate({ keywordName: event.target.value })}
            className="h-11 w-full rounded-[7px] border border-[#c6d2e2] bg-white px-4 text-[14px] font-medium text-[#172033] outline-none placeholder:text-[#7b8798] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            placeholder="Enter keyword or phrase"
          />
        </AddKeywordField>

        <AddKeywordField label="Category">
          <DropdownField
            id="category"
            value={form.category}
            options={categoryOptions}
            openDropdown={openDropdown}
            onToggle={onToggleDropdown}
            onSelect={(category) => onUpdate({ category })}
          />
        </AddKeywordField>

        <AddKeywordField label="Match Type">
          <DropdownField
            id="matchType"
            value={form.matchType}
            options={matchTypeOptions}
            openDropdown={openDropdown}
            onToggle={onToggleDropdown}
            onSelect={(matchType) => onUpdate({ matchType })}
          />
        </AddKeywordField>

        <AddKeywordField label="Moderation Score">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_96px] sm:items-center">
            <input
              value={form.moderationScore}
              onChange={(event) => onUpdate({ moderationScore: event.target.value })}
              className="h-11 w-full rounded-[7px] border border-[#c6d2e2] bg-white px-4 text-[14px] font-medium text-[#172033] outline-none focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
            <span className="inline-flex h-8 items-center justify-center rounded-full bg-[#ffeed6] px-5 text-[12px] font-bold text-[#f59e0b]">
              FLAG
            </span>
          </div>
        </AddKeywordField>

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#2f3b4f]">Active Status</span>
          <Toggle enabled={form.isActive} onToggle={onToggleActive} />
        </div>
      </div>

      <footer className="flex justify-end gap-3 border-t border-[#dfe6f0] bg-[#f4f6f8] px-7 py-5">
        <DashboardSecondaryButton
          onClick={onClose}
          className="h-11 rounded-[8px] px-6 text-[14px]"
        >
          Cancel
        </DashboardSecondaryButton>
        <DashboardPrimaryButton
          onClick={onSave}
          className="h-11 rounded-[8px] px-7 text-[14px]"
        >
          Save Keyword
        </DashboardPrimaryButton>
      </footer>
    </section>
  </div>
);

const RulesPage = () => {
  const [keywordRules, setKeywordRules] = useState(restrictedKeywords);
  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState(defaultNewKeywordForm);
  const [openDropdown, setOpenDropdown] = useState<AddKeywordDropdown>(null);

  const toggleKeywordRule = (keywordToToggle: string) => {
    setKeywordRules((currentRules) =>
      currentRules.map((keyword) =>
        keyword.keyword === keywordToToggle
          ? { ...keyword, enabled: !keyword.enabled }
          : keyword,
      ),
    );
  };

  const handleSaveKeyword = () => {
    const savedCategory = newKeyword.category === 'Select Category...' ? 'Scam / Spam' : newKeyword.category;
    const categoryClass =
      savedCategory === 'Profanity'
        ? 'bg-[#ffe1e6] text-[#e11d48]'
        : savedCategory === 'Competitor'
          ? 'bg-[#e9edf3] text-[#7b8798]'
          : 'bg-[#fff0d7] text-[#70440a]';
    const newRule: RestrictedKeyword = {
      keyword: newKeyword.keywordName || 'New restricted keyword',
      category: savedCategory,
      categoryClass,
      frequency: '0',
      lastDetected: 'Just now',
      enabled: newKeyword.isActive,
    };

    setKeywordRules((currentRules) => [newRule, ...currentRules]);
    setNewKeyword(defaultNewKeywordForm);
    setOpenDropdown(null);
    setIsAddKeywordOpen(false);
  };

  return (
    <DashboardPageShell contentClassName="px-4 pb-10 pt-4">
          <div className="space-y-4">
            <header>
              <h1 className="text-[22px] font-bold leading-7 text-[#172033]">Rules</h1>
              <p className="mt-1 text-[12px] font-medium text-[#536173]">
                Monitor and manage flagged content and restricted keywords across the platform.
              </p>
            </header>

            <div className="grid gap-4 lg:grid-cols-3">
              {ruleMetricCards.map((metric) => (
                <RuleMetricCardView key={metric.title} metric={metric} />
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
              <DashboardPanel>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5f1] px-4 py-4">
                  <h2 className="text-[18px] font-bold text-[#172033]">Restricted Keywords</h2>
                  <div className="flex min-w-0 flex-1 justify-end gap-3">
                    <DashboardSearchField placeholder="Search keywords..." className="h-9 min-w-[220px] max-w-[280px] flex-1" />
                    <DashboardPrimaryButton
                      onClick={() => setIsAddKeywordOpen(true)}
                      className="h-9 gap-1.5 px-4 text-[12px]"
                    >
                      <Plus size={13} strokeWidth={2.3} />
                      Add New
                    </DashboardPrimaryButton>
                  </div>
                </div>

                <div className="hidden grid-cols-[minmax(150px,1.2fr)_120px_100px_100px_90px] bg-[#f5f7fa] md:grid">
                  {['Keyword', 'Category', 'Frequency', 'Last Detected', 'Action'].map((heading) => (
                    <div key={heading} className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#66758b]">
                      {heading}
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-[#dfe7f2]">
                  {keywordRules.map((keyword) => (
                    <div
                      key={keyword.keyword}
                      className={`grid gap-3 px-4 py-3 text-[12px] md:grid-cols-[minmax(150px,1.2fr)_120px_100px_100px_90px] md:items-center md:gap-0 ${
                        keyword.muted ? 'bg-[#fbfcfe] text-[#9aa6b7]' : 'text-[#172033]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <ShieldAlert size={13} strokeWidth={2.1} className={keyword.muted ? 'text-[#c8d2df]' : 'text-[#ff365f]'} />
                        {keyword.keyword}
                      </div>
                      <div>
                        <span className={`inline-flex min-h-6 items-center rounded-full px-3 text-[10px] font-medium ${keyword.categoryClass}`}>
                          {keyword.category}
                        </span>
                      </div>
                      <div className="font-bold">{keyword.frequency}</div>
                      <div className="font-medium text-[#66758b]">{keyword.lastDetected}</div>
                      <div className="flex items-center gap-3">
                        <Toggle enabled={keyword.enabled} onToggle={() => toggleKeywordRule(keyword.keyword)} />
                        <button type="button" aria-label={`Delete ${keyword.keyword}`} className="text-[#9aa6b7] transition hover:text-[#dc2626]">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe7f2] px-4 py-3">
                  <p className="text-[12px] font-medium text-[#66758b]">Showing 1 to 4 of 342 entries</p>
                  <nav className="flex items-center gap-1.5 text-[12px] font-medium text-[#536173]" aria-label="Restricted keywords pagination">
                    <button type="button" className="h-8 rounded-[4px] border border-[#d9e2ef] px-3 text-[#c5ccd6]">Prev</button>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1B3061] font-bold text-white">1</button>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#d9e2ef]">2</button>
                    <button type="button" className="h-8 rounded-[4px] border border-[#d9e2ef] px-3">Next</button>
                  </nav>
                </div>
              </DashboardPanel>

              <DashboardPanel className="p-5">
                <h2 className="text-[18px] font-bold text-[#172033]">Top Flagged Keywords</h2>
                <div className="mt-5 space-y-5">
                  {topFlaggedKeywords.map((keyword) => (
                    <div key={keyword.keyword} className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${keyword.rankClass}`}>
                          {keyword.rank}
                        </span>
                        <span className="truncate text-[14px] font-bold text-[#172033]">{keyword.keyword}</span>
                      </div>
                      <span className="shrink-0 rounded-[5px] border border-[#dce5f1] bg-[#f8fafc] px-3 py-1 text-[11px] font-medium text-[#536173]">
                        {keyword.hits}
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            </div>
          </div>
      {isAddKeywordOpen ? (
        <AddRestrictedKeywordModal
          form={newKeyword}
          openDropdown={openDropdown}
          onClose={() => {
            setOpenDropdown(null);
            setIsAddKeywordOpen(false);
          }}
          onSave={handleSaveKeyword}
          onToggleActive={() => setNewKeyword((current) => ({ ...current, isActive: !current.isActive }))}
          onToggleDropdown={(dropdown) => setOpenDropdown((current) => (current === dropdown ? null : dropdown))}
          onUpdate={(updates) => {
            setNewKeyword((current) => ({ ...current, ...updates }));
            setOpenDropdown(null);
          }}
        />
      ) : null}
    </DashboardPageShell>
  );
};

export default RulesPage;
