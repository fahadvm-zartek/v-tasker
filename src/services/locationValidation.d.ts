export function validateLocationForm(kind: 'country' | 'state' | 'suburb', values: { name: string; code?: string; postcode?: string; regionId?: string }): Record<string, string>;
