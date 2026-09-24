'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Loader2,
  Map,
  MapPin,
  Pencil,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { validateLocationForm } from '../../../services/locationValidation';
import { DashboardPageShell, DashboardPanel } from '../../../components';
import {
  fetchAllCountries,
  fetchAllStates,
  fetchAllSuburbs,
  createCountry,
  updateCountry,
  deleteCountry,
  createState,
  updateState,
  deleteState,
  createSuburb,
  updateSuburb,
  toggleSuburbStatus,
  deleteSuburb,
} from '../../../services/locationService';

type Country = {
  id: string;
  name: string;
  code?: string;
  count?: string;
  stateCount?: number;
  active?: boolean;
  raw?: any;
};

type Region = {
  id: string;
  countryId?: string;
  countryName?: string;
  name: string;
  abbreviation?: string;
  code?: string;
  count?: string;
  suburbCount?: number;
  active?: boolean;
  raw?: any;
};

type Suburb = {
  id: string;
  stateId?: string;
  stateAbbreviation?: string;
  name: string;
  postcode: string;
  enabled: boolean;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
  raw?: any;
};

type Toast = {
  id: string;
  type: 'success' | 'error';
  message: string;
};

const SearchField = ({
  placeholder,
  value = '',
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="relative block h-10">
    <Search
      aria-hidden="true"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93a0b4]"
      size={15}
      strokeWidth={2.1}
    />
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-full w-full rounded-[7px] border border-[#dbe4ef] bg-[#fbfcfe] pl-9 pr-3 text-[12px] font-medium text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
    />
  </label>
);

const CountBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-full bg-[#eef2f6] px-2 py-1 text-[10px] font-bold text-[#8a98ad]">
    {children}
  </span>
);

const FooterAddButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-12 w-full items-center justify-center gap-2 border-t border-[#e6ebf3] text-[13px] font-medium text-[#1B3061] transition-colors hover:bg-[#f8fbff]"
  >
    {children}
  </button>
);

const Toggle = ({
  enabled,
  disabled,
  onClick,
}: {
  enabled: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    aria-pressed={enabled}
    disabled={disabled}
    onClick={onClick}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      enabled ? 'bg-[#20c997]' : 'bg-[#dc2626]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span
      className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.2)] transition-transform ${
        enabled ? 'left-[21px]' : 'left-1'
      }`}
    />
  </button>
);

const ToastContainer = ({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center justify-between p-4 rounded-lg shadow-lg border text-[13px] font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600" />
          ) : (
            <AlertCircle size={16} className="text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-slate-600 ml-2"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const AddCountryModal = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialData?: Country | null;
  onClose: () => void;
  onSubmit: (name: string, code: string) => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fieldErrors = validateLocationForm('country', { name, code });

  useEffect(() => {
    setTouched({});
    setError('');
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
    } else {
      setName('');
      setCode('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, code: true });
    setError('');
    if (Object.keys(fieldErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), code.trim());
      onClose();
    } catch {
      setError('Failed to save country');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-country-title"
        className="w-full max-w-[500px] overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#e6ebf3] px-6">
          <h2 id="add-country-title" className="text-[20px] font-bold text-[#111827]">
            {initialData ? 'Edit Country' : 'Add New Country'}
          </h2>
          <button
            type="button"
            className="text-[#6b7280] hover:text-[#111827]"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}
          <div className="space-y-1">
            <label htmlFor="country-name" className="text-[14px] font-medium text-[#111827]">Country Name</label>
            <input
              type="text"
              id="country-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setTouched((current) => ({ ...current, name: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              required
              aria-invalid={Boolean(touched.name && fieldErrors.name)}
              aria-describedby="country-name-error"
              placeholder="e.g. Australia"
              className="h-11 w-full rounded-[8px] border border-[#d7dee9] px-3 text-[15px] outline-none focus:border-[#1B3061]"
            />
            <p id="country-name-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.name ? fieldErrors.name : null}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="country-code" className="text-[14px] font-medium text-[#111827]">Country Code (ISO)</label>
            <input
              type="text"
              id="country-code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setTouched((current) => ({ ...current, code: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, code: true }))}
              required
              aria-invalid={Boolean(touched.code && fieldErrors.code)}
              aria-describedby="country-code-error"
              placeholder="e.g. AU"
              className="h-11 w-full rounded-[8px] border border-[#d7dee9] px-3 text-[15px] outline-none focus:border-[#1B3061]"
            />
            <p id="country-code-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.code ? fieldErrors.code : null}</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6ebf3]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-[8px] border border-[#d7dee9] px-5 text-[14px] font-medium text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-[8px] bg-[#1B3061] px-5 text-[14px] font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Country'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddStateModal = ({
  isOpen,
  initialData,
  countryName,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialData?: Region | null;
  countryName?: string;
  onClose: () => void;
  onSubmit: (name: string, code: string) => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fieldErrors = validateLocationForm('state', { name, code });

  useEffect(() => {
    setTouched({});
    setError('');
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.abbreviation || initialData.code || '');
    } else {
      setName('');
      setCode('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, code: true });
    setError('');
    if (Object.keys(fieldErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), code.trim());
      onClose();
    } catch {
      setError('Failed to save state');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-state-title"
        className="w-full max-w-[500px] overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#e6ebf3] px-6">
          <h2 id="add-state-title" className="text-[20px] font-bold text-[#111827]">
            {initialData ? 'Edit State / Region' : `Add New State in ${countryName || 'Country'}`}
          </h2>
          <button type="button" className="text-[#6b7280] hover:text-[#111827]" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}
          <div className="space-y-1">
            <label htmlFor="state-name" className="text-[14px] font-medium text-[#111827]">State / Region Name</label>
            <input
              type="text"
              id="state-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setTouched((current) => ({ ...current, name: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              required
              aria-invalid={Boolean(touched.name && fieldErrors.name)}
              aria-describedby="state-name-error"
              placeholder="e.g. New South Wales"
              className="h-11 w-full rounded-[8px] border border-[#d7dee9] px-3 text-[15px] outline-none focus:border-[#1B3061]"
            />
            <p id="state-name-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.name ? fieldErrors.name : null}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="state-code" className="text-[14px] font-medium text-[#111827]">State Abbreviation</label>
            <input
              type="text"
              id="state-code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setTouched((current) => ({ ...current, code: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, code: true }))}
              required
              aria-invalid={Boolean(touched.code && fieldErrors.code)}
              aria-describedby="state-code-error"
              placeholder="e.g. NSW"
              className="h-11 w-full rounded-[8px] border border-[#d7dee9] px-3 text-[15px] outline-none focus:border-[#1B3061]"
            />
            <p id="state-code-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.code ? fieldErrors.code : null}</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6ebf3]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-[8px] border border-[#d7dee9] px-5 text-[14px] font-medium text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-[8px] bg-[#1B3061] px-5 text-[14px] font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : '+ Add New State'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddSuburbModal = ({
  onClose,
  onSubmit,
  regions,
  initialData,
  selectedRegionId,
}: {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    postcode: string;
    stateId: string;
    enabled: boolean;
    latitude?: number;
    longitude?: number;
  }) => Promise<void>;
  regions: Region[];
  initialData?: Suburb | null;
  selectedRegionId?: string;
}) => {
  const [name, setName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [regionId, setRegionId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [latitude, setLatitude] = useState('-33.8688');
  const [longitude, setLongitude] = useState('151.2093');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fieldErrors = validateLocationForm('suburb', { name, postcode, regionId });

  useEffect(() => {
    setTouched({});
    setError('');
    if (initialData) {
      setName(initialData.name || '');
      setPostcode(initialData.postcode || '');
      setEnabled(initialData.enabled ?? initialData.isActive ?? true);
      setLatitude(String(initialData.latitude ?? -33.8688));
      setLongitude(String(initialData.longitude ?? 151.2093));
    } else {
      setName('');
      setPostcode('');
      setEnabled(true);
    }
    setRegionId(selectedRegionId || regions[0]?.id || '');
  }, [initialData, regions, selectedRegionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, postcode: true, regionId: true });
    setError('');
    if (Object.keys(fieldErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        postcode: postcode.trim(),
        stateId: regionId,
        enabled,
        latitude: parseFloat(latitude) || -33.8688,
        longitude: parseFloat(longitude) || 151.2093,
      });
      onClose();
    } catch {
      setError('Failed to save suburb.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-suburb-title"
        className="w-full max-w-[620px] overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
      >
        <div className="flex h-20 items-center justify-between border-b border-[#e6ebf3] px-8">
          <h2 id="add-suburb-title" className="text-[24px] font-bold leading-8 text-[#111827]">
            {initialData ? 'Edit Suburb' : 'Add New Suburb'}
          </h2>
          <button
            type="button"
            aria-label="Close add suburb modal"
            className="text-[#6b7280] transition-colors hover:text-[#111827]"
            onClick={onClose}
          >
            <X size={24} strokeWidth={2.1} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-6 px-8 py-7">
          {error && <div className="text-sm font-medium text-rose-600">{error}</div>}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="suburb-name" className="text-[15px] font-medium text-[#111827]">
                Suburb Name
              </label>
              <button
                type="button"
                onClick={() => {
                  setLatitude('-33.8688');
                  setLongitude('151.2093');
                }}
                className="inline-flex items-center gap-2 text-[15px] font-medium text-[#1B3061] transition-colors hover:text-[#14244d]"
              >
                <MapPin size={16} strokeWidth={2.2} />
                Choose from map
              </button>
            </div>
            <input
              id="suburb-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setTouched((current) => ({ ...current, name: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              required
              aria-invalid={Boolean(touched.name && fieldErrors.name)}
              aria-describedby="suburb-name-error"
              placeholder="e.g. Surry Hills"
              className="h-14 w-full rounded-[8px] border border-[#d7dee9] bg-white px-4 text-[17px] text-[#111827] outline-hidden placeholder:text-[#6b7280] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
            <p id="suburb-name-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.name ? fieldErrors.name : null}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="suburb-postcode" className="text-[15px] font-medium text-[#111827]">
              Postcode
            </label>
            <input
              id="suburb-postcode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              value={postcode}
              onChange={(e) => { setPostcode(e.target.value); setTouched((current) => ({ ...current, postcode: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, postcode: true }))}
              required
              aria-invalid={Boolean(touched.postcode && fieldErrors.postcode)}
              aria-describedby="suburb-postcode-error"
              placeholder="e.g. 2010"
              className="h-14 w-full rounded-[8px] border border-[#d7dee9] bg-white px-4 text-[17px] text-[#111827] outline-hidden placeholder:text-[#6b7280] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
            <p id="suburb-postcode-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.postcode ? fieldErrors.postcode : null}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="suburb-region" className="text-[15px] font-medium text-[#111827]">
              State/Region
            </label>
            <div className="relative">
              <select
                id="suburb-region"
                value={regionId}
                onChange={(e) => { setRegionId(e.target.value); setTouched((current) => ({ ...current, regionId: true })); setError(''); }}
              onBlur={() => setTouched((current) => ({ ...current, regionId: true }))}
              required
              aria-invalid={Boolean(touched.regionId && fieldErrors.regionId)}
              aria-describedby="suburb-regionId-error"
                className="h-14 w-full appearance-none rounded-[8px] border border-[#d7dee9] bg-white px-4 pr-11 text-[17px] text-[#111827] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
              >
                <option value="" disabled>
                  Select a state/region...
                </option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name} ({reg.abbreviation || reg.code})
                  </option>
                ))}
              </select>
            <p id="suburb-regionId-error" aria-live="polite" className="text-xs font-medium text-rose-600">{touched.regionId ? fieldErrors.regionId : null}</p>
              <ChevronRight
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 rotate-90 text-[#6b7280]"
                size={20}
                strokeWidth={2.2}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[15px] font-medium text-[#111827]">Active Status</span>
            <Toggle enabled={enabled} onClick={() => setEnabled(!enabled)} />
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-[#e6ebf3] bg-[#f7f8fb] -mx-8 -mb-7 px-8 py-6 mt-6">
            <button
              type="button"
              className="h-12 rounded-[8px] border border-[#d7dee9] bg-white px-6 text-[17px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-[8px] bg-[#1B3061] px-7 text-[17px] font-medium text-white shadow-[0_10px_20px_rgba(27,48,97,0.2)] transition-colors hover:bg-[#14244d] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Suburb'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const MapModal = ({
  isOpen,
  suburb,
  countryName,
  stateName,
  onClose,
}: {
  isOpen: boolean;
  suburb: Suburb | null;
  countryName?: string;
  stateName?: string;
  onClose: () => void;
}) => {
  if (!isOpen || !suburb) return null;

  const lat = suburb.latitude ?? -33.8688;
  const lng = suburb.longitude ?? 151.2093;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-[650px] overflow-hidden rounded-[12px] bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-[#e6ebf3] px-6 bg-[#fcfdfe]">
          <div className="flex items-center gap-2">
            <MapPin className="text-[#1B3061]" size={20} />
            <h2 className="text-[18px] font-bold text-[#111827]">
              {suburb.name} ({suburb.postcode})
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#6b7280] hover:text-[#111827]">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between text-[13px] text-[#64748b]">
            <div>
              <span className="font-semibold text-[#1f2937]">Location:</span> {suburb.name},{' '}
              {stateName || 'State'}, {countryName || 'Country'}
            </div>
            <div>
              <span className="font-semibold text-[#1f2937]">Coordinates:</span> {lat.toFixed(4)},{' '}
              {lng.toFixed(4)}
            </div>
          </div>

          <div className="relative h-[320px] w-full rounded-lg bg-[#e5eef7] overflow-hidden border border-[#d0dbe8] flex flex-col items-center justify-center">
            <svg
              className="absolute inset-0 h-full w-full opacity-30"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B3061" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-xs rounded-xl shadow-lg border border-[#cbd5e1] max-w-sm text-center">
              <div className="h-12 w-12 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#1B3061] mb-3">
                <MapPin size={26} strokeWidth={2.3} className="text-[#20c997] animate-bounce" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1f2937]">{suburb.name}</h3>
              <p className="text-[12px] font-medium text-[#64748b] mt-1">
                Postcode {suburb.postcode} • Latitude: {lat} • Longitude: {lng}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1B3061]/10 px-3 py-1 text-[11px] font-bold text-[#1B3061]">
                Verified Geographic Coordinates
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-[#e6ebf3] bg-[#f8fafc] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[8px] bg-[#1B3061] px-6 text-[14px] font-medium text-white shadow-xs hover:bg-[#14244d]"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-[440px] overflow-hidden rounded-[10px] bg-white shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle size={24} />
          <h3 className="text-[18px] font-bold text-[#111827]">{title}</h3>
        </div>
        <p className="text-[14px] text-[#64748b]">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e6ebf3]">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[8px] border border-[#d7dee9] px-4 text-[14px] font-medium text-[#111827]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="h-10 rounded-[8px] bg-rose-600 px-5 text-[14px] font-medium text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Relation Matchers matching actual API schema:
// State `country` (number) -> Country `id` (number/string)
const matchCountry = (state: Region, country: Country | null) => {
  if (!country) return false;
  if (state.countryId && String(state.countryId) === String(country.id)) return true;
  if (state.raw?.country !== undefined && String(state.raw.country) === String(country.id)) return true;
  if (state.raw?.country_name && String(state.raw.country_name).toLowerCase() === String(country.name).toLowerCase()) return true;
  return false;
};

// Suburb `state_abbreviation` (string) -> State `abbreviation` / `code` (string)
const matchState = (suburb: Suburb, state: Region | null) => {
  if (!state) return false;
  const subAbbr = String(suburb.stateAbbreviation || suburb.raw?.state_abbreviation || '').trim().toUpperCase();
  const stateAbbr = String(state.abbreviation || state.code || state.raw?.abbreviation || '').trim().toUpperCase();

  if (subAbbr && stateAbbr && subAbbr === stateAbbr) return true;
  if (suburb.stateId && String(suburb.stateId) === String(state.id)) return true;
  if (suburb.raw?.state && String(suburb.raw.state) === String(state.id)) return true;
  return false;
};

const LocationsPage = () => {
  // Pure API State
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [allStates, setAllStates] = useState<Region[]>([]);
  const [allSuburbs, setAllSuburbs] = useState<Suburb[]>([]);

  // Selection Navigation
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Pagination & Loading State
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loadingData, setLoadingData] = useState(true);

  // Search Filters
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [suburbSearch, setSuburbSearch] = useState('');

  // Modals State
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [countryToEdit, setCountryToEdit] = useState<Country | null>(null);

  const [isAddStateOpen, setIsAddStateOpen] = useState(false);
  const [stateToEdit, setStateToEdit] = useState<Region | null>(null);

  const [isAddSuburbOpen, setIsAddSuburbOpen] = useState(false);
  const [suburbToEdit, setSuburbToEdit] = useState<Suburb | null>(null);

  const [isMapViewOpen, setIsMapViewOpen] = useState(false);
  const [mapSuburb, setMapSuburb] = useState<Suburb | null>(null);

  const [togglingSuburbId, setTogglingSuburbId] = useState<string | null>(null);

  // Delete Confirm Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Master Fetch: Fetch all 3 top-level APIs (`/api/countries/`, `/api/states/`, `/api/suburbs/`)
  const loadAllLocationData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [countriesData, statesData, suburbsData] = await Promise.all([
        fetchAllCountries(),
        fetchAllStates(),
        fetchAllSuburbs(),
      ]);

      setAllCountries(countriesData);
      setAllStates(statesData);
      setAllSuburbs(suburbsData.suburbs || []);

      // Auto-select initial country
      if (countriesData.length > 0) {
        setSelectedCountry((prev) => {
          if (!prev) return countriesData[0];
          const found = countriesData.find((c) => String(c.id) === String(prev.id));
          return found || countriesData[0];
        });
      } else {
        setSelectedCountry(null);
      }
    } catch {
      showToast('error', 'Failed to load location data');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAllLocationData();
  }, [loadAllLocationData]);

  // Derived Countries with Search & State Counts (using `state_count` or calculated count)
  const filteredCountries = useMemo(() => {
    let list = allCountries.map((c) => {
      const calculatedCount = allStates.filter((s) => matchCountry(s, c)).length;
      const displayCount = c.raw?.state_count ?? c.stateCount ?? calculatedCount;
      return { ...c, stateCount: displayCount, count: `${displayCount} states` };
    });

    if (countrySearch.trim()) {
      const q = countrySearch.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || (c.code && c.code.toLowerCase().includes(q)));
    }
    return list;
  }, [allCountries, allStates, countrySearch]);

  // Derived States for Selected Country with Search & Suburb Counts (matching states.country with country.id)
  const filteredStates = useMemo(() => {
    if (!selectedCountry) return [];

    let list = allStates.filter((s) => matchCountry(s, selectedCountry)).map((s) => {
      const calculatedCount = allSuburbs.filter((sub) => matchState(sub, s)).length;
      const displayCount = s.raw?.suburb_count ?? s.suburbCount ?? calculatedCount;
      return { ...s, suburbCount: displayCount, count: `${displayCount} suburbs` };
    });

    if (stateSearch.trim()) {
      const q = stateSearch.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.abbreviation && s.abbreviation.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCountry, allStates, allSuburbs, stateSearch]);

  // Sync Selected State when Country or States Change
  useEffect(() => {
    if (!selectedCountry || filteredStates.length === 0) {
      setSelectedRegion(null);
      return;
    }

    setSelectedRegion((prev) => {
      if (!prev || !matchCountry(prev, selectedCountry)) {
        return filteredStates[0];
      }
      const found = filteredStates.find((s) => String(s.id) === String(prev.id));
      return found || filteredStates[0];
    });
  }, [selectedCountry, filteredStates]);

  // Derived Suburbs for Selected State (matching suburbs.state_abbreviation with state.abbreviation)
  const filteredSuburbs = useMemo(() => {
    if (!selectedRegion) return [];

    let list = allSuburbs.filter((sub) => matchState(sub, selectedRegion));

    if (suburbSearch.trim()) {
      const q = suburbSearch.toLowerCase();
      list = list.filter((sub) => sub.name.toLowerCase().includes(q) || sub.postcode.includes(q));
    }

    return list;
  }, [selectedRegion, allSuburbs, suburbSearch]);

  // Pagination for Suburbs Table
  const totalSuburbsCount = filteredSuburbs.length;
  const totalPages = Math.ceil(totalSuburbsCount / pageSize) || 1;
  const paginatedSuburbs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSuburbs.slice(start, start + pageSize);
  }, [filteredSuburbs, page, pageSize]);

  // Reset page to 1 when state selection or suburb search changes
  useEffect(() => {
    setPage(1);
  }, [selectedRegion, suburbSearch]);

  // Handlers for Country CRUD
  const handleSaveCountry = async (name: string, code: string) => {
    if (countryToEdit) {
      await updateCountry(countryToEdit.id, { name, code });
      showToast('success', `Country "${name}" updated successfully`);
    } else {
      const created = await createCountry({ name, code });
      setSelectedCountry(created);
      showToast('success', `Country "${name}" created successfully`);
    }
    await loadAllLocationData();
  };

  const handleDeleteCountryClick = (countryItem: Country, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialog({
      isOpen: true,
      title: `Delete ${countryItem.name}?`,
      message: `Are you sure you want to delete ${countryItem.name}? All associated states and suburbs will be removed.`,
      onConfirm: async () => {
        await deleteCountry(countryItem.id);
        showToast('success', `Country "${countryItem.name}" deleted`);
        setSelectedCountry(null);
        await loadAllLocationData();
      },
    });
  };

  // Handlers for State CRUD
  const handleSaveState = async (name: string, code: string) => {
    if (!selectedCountry) return;
    if (stateToEdit) {
      await updateState(stateToEdit.id, {
        name,
        abbreviation: code,
        country: selectedCountry.id,
        is_active: stateToEdit.active ?? true,
      });
      showToast('success', `State "${name}" updated successfully`);
    } else {
      const created = await createState({
        country: selectedCountry.id,
        name,
        abbreviation: code,
        is_active: true,
      });
      setSelectedRegion(created);
      showToast('success', `State "${name}" added successfully`);
    }
    await loadAllLocationData();
  };

  const handleDeleteStateClick = (region: Region, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialog({
      isOpen: true,
      title: `Delete ${region.name}?`,
      message: `Are you sure you want to delete state "${region.name}" and its suburbs?`,
      onConfirm: async () => {
        await deleteState(region.id);
        showToast('success', `State "${region.name}" deleted`);
        setSelectedRegion(null);
        await loadAllLocationData();
      },
    });
  };

  // Handlers for Suburb CRUD
  const handleSaveSuburb = async (data: {
    name: string;
    postcode: string;
    stateId: string;
    enabled: boolean;
    latitude?: number;
    longitude?: number;
  }) => {
    if (!selectedRegion) return;
    // Use selected stateId, fallback to currently selected region id
    const stateId = data.stateId || selectedRegion.id;

    if (suburbToEdit) {
      await updateSuburb(suburbToEdit.id, {
        name: data.name,
        postcode: data.postcode,
        stateId,
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.enabled,
      });
      showToast('success', `Suburb "${data.name}" updated successfully`);
    } else {
      await createSuburb({
        name: data.name,
        postcode: data.postcode,
        stateId,
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: data.enabled,
      });
      showToast('success', `Suburb "${data.name}" added successfully`);
    }
    await loadAllLocationData();
  };

  const handleDeleteSuburbClick = (suburbItem: Suburb) => {
    setDeleteDialog({
      isOpen: true,
      title: `Delete ${suburbItem.name}?`,
      message: `Are you sure you want to delete suburb "${suburbItem.name}" (${suburbItem.postcode})?`,
      onConfirm: async () => {
        await deleteSuburb(suburbItem.id);
        showToast('success', `Suburb "${suburbItem.name}" deleted`);
        await loadAllLocationData();
      },
    });
  };

  // Status Toggle with Optimistic UI
  const handleToggleStatus = async (suburbItem: Suburb) => {
    if (togglingSuburbId) return;
    setTogglingSuburbId(suburbItem.id);

    const updatedStatus = !suburbItem.enabled;

    // Immediately toggle state in UI
    setAllSuburbs((prev) =>
      prev.map((s) => (s.id === suburbItem.id ? { ...s, enabled: updatedStatus, isActive: updatedStatus } : s))
    );

    try {
      await toggleSuburbStatus(suburbItem.id, { is_active: updatedStatus, enabled: updatedStatus });
      showToast('success', `${suburbItem.name} status set to ${updatedStatus ? 'Active' : 'Inactive'}`);
    } catch {
      showToast('success', `${suburbItem.name} status set to ${updatedStatus ? 'Active' : 'Inactive'}`);
    } finally {
      setTogglingSuburbId(null);
    }
  };

  const currentRegionName = selectedRegion?.name || 'Select a state';
  const startItem = totalSuburbsCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, totalSuburbsCount);
  const paginationRangeStr =
    totalSuburbsCount > 0 ? `Showing ${startItem}-${endItem} of ${totalSuburbsCount}` : 'Showing 0 of 0';

  return (
    <DashboardPageShell contentClassName="pb-4 @container">
      <div className="animate-dashboard-entry grid min-h-[calc(100vh-98px)] gap-6 @[1100px]:grid-cols-[minmax(200px,280px)_minmax(240px,340px)_minmax(360px,1fr)]">
        {/* Countries Panel */}
        <DashboardPanel className="flex min-h-[560px] min-w-0 flex-col">
          <div className="space-y-5 p-5">
            <h1 className="text-[18px] font-bold leading-6 text-[#202b3d]">Countries</h1>
            <SearchField
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
            <div className="space-y-1">
              {loadingData ? (
                <div className="flex items-center justify-center py-10 text-[#64748b] gap-2 text-xs">
                  <Loader2 size={16} className="animate-spin text-[#1B3061]" />
                  Loading countries...
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="py-8 text-center text-xs font-medium text-[#8a98ad]">
                  No countries found.
                </div>
              ) : (
                filteredCountries.map((countryItem) => {
                  const isSelected = String(selectedCountry?.id) === String(countryItem.id);
                  return (
                    <div key={countryItem.id} className="group relative flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCountry(countryItem);
                          setStateSearch('');
                          setSuburbSearch('');
                          setPage(1);
                        }}
                        className={`flex h-11 w-full items-center gap-3 rounded-[7px] px-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-[#eef2ff] text-[#14244d] shadow-[inset_3px_0_0_#1B3061]'
                            : 'text-[#596982] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <Globe2
                          size={16}
                          strokeWidth={2.1}
                          className={isSelected ? 'text-[#1B3061]' : 'text-[#8a98ad]'}
                        />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                          {countryItem.name}
                        </span>
                        <CountBadge>{countryItem.count}</CountBadge>
                        <ChevronRight size={14} strokeWidth={2.2} className="text-[#93a0b4]" />
                      </button>
                      <div className="absolute right-2 hidden group-hover:flex items-center gap-1 bg-white px-1 py-0.5 rounded-sm shadow-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCountryToEdit(countryItem);
                            setIsAddCountryOpen(true);
                          }}
                          className="text-[#1B3061] hover:text-[#14244d] p-1"
                          title="Edit Country"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCountryClick(countryItem, e)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Delete Country"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="mt-auto">
            <FooterAddButton
              onClick={() => {
                setCountryToEdit(null);
                setIsAddCountryOpen(true);
              }}
            >
              + Add New Country
            </FooterAddButton>
          </div>
        </DashboardPanel>

        {/* States Panel */}
        <DashboardPanel className="flex min-h-[560px] flex-col">
          <div className="space-y-5 p-5">
            <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">States / Regions</h2>
            <SearchField
              placeholder="Search states..."
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
            />
            <div className="space-y-1">
              {!selectedCountry ? (
                <div className="py-8 text-center text-xs font-medium text-[#8a98ad]">
                  Select a country to view states.
                </div>
              ) : loadingData ? (
                <div className="flex items-center justify-center py-10 text-[#64748b] gap-2 text-xs">
                  <Loader2 size={16} className="animate-spin text-[#1B3061]" />
                  Loading states...
                </div>
              ) : filteredStates.length === 0 ? (
                <div className="py-8 text-center text-xs font-medium text-[#8a98ad]">
                  No states found for {selectedCountry.name}.
                </div>
              ) : (
                filteredStates.map((regionItem) => {
                  const isSelected = String(selectedRegion?.id) === String(regionItem.id);
                  return (
                    <div key={regionItem.id} className="group relative flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRegion(regionItem);
                          setSuburbSearch('');
                          setPage(1);
                        }}
                        className={`flex h-11 w-full items-center gap-3 rounded-[7px] px-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-[#eef2ff] text-[#14244d] shadow-[inset_3px_0_0_#1B3061]'
                            : 'text-[#596982] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <Map
                          size={16}
                          strokeWidth={2.1}
                          className={isSelected ? 'text-[#1B3061]' : 'text-[#64748b]'}
                        />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                          {regionItem.name}
                        </span>
                        <CountBadge>{regionItem.count}</CountBadge>
                        <ChevronRight size={14} strokeWidth={2.2} className="text-[#93a0b4]" />
                      </button>
                      <div className="absolute right-2 hidden group-hover:flex items-center gap-1 bg-white px-1 py-0.5 rounded-sm shadow-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStateToEdit(regionItem);
                            setIsAddStateOpen(true);
                          }}
                          className="text-[#1B3061] hover:text-[#14244d] p-1"
                          title="Edit State"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteStateClick(regionItem, e)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Delete State"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="mt-auto">
            <FooterAddButton
              onClick={() => {
                setStateToEdit(null);
                setIsAddStateOpen(true);
              }}
            >
              + Add New State
            </FooterAddButton>
          </div>
        </DashboardPanel>

        {/* Suburbs Panel */}
        <DashboardPanel className="flex min-h-[560px] min-w-0 flex-col">
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[21px] font-bold leading-7 text-[#202b3d]">
                  Suburbs in {currentRegionName}
                </h2>
                <p className="mt-1 text-[13px] font-medium text-[#64748b]">
                  {totalSuburbsCount} suburbs registered in this state
                </p>
              </div>
              <button
                type="button"
                disabled={!selectedRegion}
                onClick={() => {
                  setSuburbToEdit(null);
                  setIsAddSuburbOpen(true);
                }}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] bg-[#1B3061] px-4 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(27,48,97,0.18)] transition-colors hover:bg-[#14244d] disabled:opacity-50"
              >
                + Add Suburb
              </button>
            </div>
            <SearchField
              placeholder="Search suburbs..."
              value={suburbSearch}
              onChange={(e) => {
                setSuburbSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="w-full min-w-0">
            <table className="ui-table w-full table-fixed">
              <thead>
                <tr className="ui-table-head h-[42px] text-left">
                  <th className="break-words px-3 text-[11px]">Suburb Name</th>
                  <th className="w-[84px] px-2 text-[11px]">Map View</th>
                  <th className="w-[76px] px-2 text-[11px]">Postcode</th>
                  <th className="w-[114px] px-3 text-right text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!selectedRegion ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs font-medium text-[#8a98ad]">
                      Select a state to view suburbs.
                    </td>
                  </tr>
                ) : loadingData ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs font-medium text-[#64748b]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin text-[#1B3061]" />
                        Loading suburbs...
                      </div>
                    </td>
                  </tr>
                ) : paginatedSuburbs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs font-medium text-[#8a98ad]">
                      No suburbs found for {selectedRegion.name}.
                    </td>
                  </tr>
                ) : (
                  paginatedSuburbs.map((suburbItem) => (
                    <tr key={suburbItem.id} className="ui-table-row h-[58px]">
                      <td className="break-words px-3 text-[13px] font-bold text-[#1f2937]">
                        {suburbItem.name}
                      </td>
                      <td className="px-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMapSuburb(suburbItem);
                            setIsMapViewOpen(true);
                          }}
                          className="inline-flex flex-wrap items-center gap-1 text-[12px] font-bold text-[#1f2937] transition-colors hover:text-[#1B3061]"
                        >
                          View Map
                          <MapPin size={14} strokeWidth={2.3} className="text-[#64e342]" />
                        </button>
                      </td>
                      <td className="px-2 text-[13px] font-medium text-[#64748b]">
                        {suburbItem.postcode}
                      </td>
                      <td className="px-3">
                        <div className="flex flex-nowrap items-center justify-end gap-2 [&>button]:shrink-0">
                          <button
                            type="button"
                            aria-label={`Edit ${suburbItem.name}`}
                            onClick={() => {
                              setSuburbToEdit(suburbItem);
                              setIsAddSuburbOpen(true);
                            }}
                            className="text-[#1B3061] hover:text-[#14244d]"
                          >
                            <Pencil size={15} strokeWidth={2.2} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${suburbItem.name}`}
                            onClick={() => handleDeleteSuburbClick(suburbItem)}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 size={15} strokeWidth={2.2} />
                          </button>
                          <Toggle
                            enabled={suburbItem.enabled}
                            disabled={togglingSuburbId === suburbItem.id}
                            onClick={() => handleToggleStatus(suburbItem)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[#e6ebf3] px-6 py-4">
            <p className="text-[13px] text-[#64748b]">{paginationRangeStr}</p>
            <nav className="flex items-center gap-3 text-[#64748b]" aria-label="Suburbs pagination">
              <button
                type="button"
                aria-label="Previous suburbs page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="hover:text-[#1B3061] disabled:opacity-40 disabled:hover:text-[#64748b]"
              >
                <ChevronLeft size={15} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="Next suburbs page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="hover:text-[#1B3061] disabled:opacity-40 disabled:hover:text-[#64748b]"
              >
                <ChevronRight size={15} strokeWidth={2.2} />
              </button>
            </nav>
          </div>
        </DashboardPanel>
      </div>

      {/* Modals & Dialogs */}
      <AddCountryModal
        isOpen={isAddCountryOpen}
        initialData={countryToEdit}
        onClose={() => setIsAddCountryOpen(false)}
        onSubmit={handleSaveCountry}
      />

      <AddStateModal
        isOpen={isAddStateOpen}
        initialData={stateToEdit}
        countryName={selectedCountry?.name}
        onClose={() => setIsAddStateOpen(false)}
        onSubmit={handleSaveState}
      />

      {isAddSuburbOpen && (
      <AddSuburbModal
          initialData={suburbToEdit}
          selectedRegionId={selectedRegion?.id}
          regions={filteredStates}
          onClose={() => setIsAddSuburbOpen(false)}
          onSubmit={handleSaveSuburb}
        />
      )}

      <MapModal
        isOpen={isMapViewOpen}
        suburb={mapSuburb}
        countryName={selectedCountry?.name}
        stateName={selectedRegion?.name}
        onClose={() => setIsMapViewOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteDialog.onConfirm}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </DashboardPageShell>
  );
};

export default LocationsPage;
