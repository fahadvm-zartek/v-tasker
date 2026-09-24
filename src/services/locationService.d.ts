export interface Country {
  id: string;
  name: string;
  code?: string;
  count: string;
  stateCount?: number;
  active?: boolean;
  raw?: any;
}

export interface StateRegion {
  id: string;
  countryId?: string;
  name: string;
  code?: string;
  count: string;
  suburbCount?: number;
  active?: boolean;
  raw?: any;
}

export interface Suburb {
  id: string;
  stateId?: string;
  name: string;
  postcode: string;
  enabled: boolean;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
  raw?: any;
}

export interface FetchSuburbsResponse {
  suburbs: Suburb[];
  count: number;
  page: number;
  totalPages: number;
}

export declare const LOCATION_API_PATHS: {
  countries: string;
  countryDetail: (id: string | number) => string;
  states: string;
  stateDetail: (id: string | number) => string;
  suburbs: string;
  suburbDetail: (id: string | number) => string;
  suburbStatus: (id: string | number) => string;
};

export declare function normalizeCountry(country: any, index?: number): Country;
export declare function normalizeState(state: any, index?: number): StateRegion;
export declare function normalizeSuburb(suburb: any, index?: number): Suburb;

export declare function fetchAllCountries(options?: {
  baseUrl?: string;
  search?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<Country[]>;

export declare function fetchAllStates(options?: {
  baseUrl?: string;
  search?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<StateRegion[]>;

export declare function fetchAllSuburbs(options?: {
  baseUrl?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  authenticatedFetch?: typeof fetch;
}): Promise<FetchSuburbsResponse>;

export declare function fetchCountries(options?: {
  baseUrl?: string;
  search?: string;
  authenticatedFetch?: typeof fetch;
}): Promise<Country[]>;

export declare function createCountry(
  data: { name: string; code?: string },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<Country>;

export declare function updateCountry(
  id: string,
  data: { name: string; code?: string },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<Country>;

export declare function deleteCountry(
  id: string,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<void>;

export declare function fetchStatesByCountry(
  countryId: string,
  options?: { baseUrl?: string; search?: string; authenticatedFetch?: typeof fetch }
): Promise<StateRegion[]>;

export declare function createState(
  data: { countryId?: string; country_id?: string; country?: string | number; countryName?: string; country_name?: string; name: string; code?: string; abbreviation?: string; is_active?: boolean },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<StateRegion>;

export declare function updateState(
  id: string,
  data: { name: string; abbreviation: string; country: string | number; is_active: boolean },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<StateRegion>;

export declare function deleteState(
  id: string,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<void>;

export declare function fetchSuburbsByState(
  stateId: string,
  options?: { baseUrl?: string; search?: string; page?: number; pageSize?: number; authenticatedFetch?: typeof fetch }
): Promise<FetchSuburbsResponse>;

export declare function createSuburb(
  data: { stateId?: string; state_id?: string; state?: string; stateAbbreviation?: string; name: string; postcode: string; enabled?: boolean; is_active?: boolean; isActive?: boolean; latitude?: number; longitude?: number },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<Suburb>;

export declare function updateSuburb(
  id: string,
  data: { name: string; postcode: string; stateAbbreviation?: string; state?: string; stateId?: string; enabled?: boolean; is_active?: boolean; isActive?: boolean; latitude?: number; longitude?: number },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<Suburb>;

export declare function toggleSuburbStatus(
  id: string,
  data?: { is_active?: boolean; enabled?: boolean },
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<Suburb>;

export declare function deleteSuburb(
  id: string,
  options?: { baseUrl?: string; authenticatedFetch?: typeof fetch }
): Promise<void>;
