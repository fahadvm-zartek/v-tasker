const validateLocationForm = (kind, values) => {
  const errors = {};
  if (!String(values.name ?? '').trim()) errors.name = `${kind === 'country' ? 'Country' : kind === 'state' ? 'State / Region' : 'Suburb'} name is required.`;
  if (kind === 'suburb') {
    if (!/^\d{4}$/.test(String(values.postcode ?? '').trim())) errors.postcode = 'Postcode must contain exactly 4 digits.';
    if (!String(values.regionId ?? '').trim()) errors.regionId = 'Select a state/region.';
  } else if (!String(values.code ?? '').trim()) {
    errors.code = kind === 'country' ? 'Country code is required.' : 'State abbreviation is required.';
  }
  return errors;
};

module.exports = { validateLocationForm };
