const formatLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && formatLocalDate(date) === value;
};

// Date-only bounds are inclusive calendar dates in the user's local timezone.
const getTaskDateRange = (preset, start = '', end = '', now = new Date()) => {
  if (preset === 'custom') {
    if (!isValidDate(start) || !isValidDate(end)) throw new Error('Choose a valid start and end date.');
    if (start > end) throw new Error('End date must be on or after start date.');
    return { dateCreatedAfter: start, dateCreatedBefore: end };
  }
  if (!['today', '7', '30'].includes(preset)) return {};
  const after = new Date(now);
  after.setDate(after.getDate() - (preset === 'today' ? 0 : Number(preset) - 1));
  return { dateCreatedAfter: formatLocalDate(after), dateCreatedBefore: formatLocalDate(now) };
};

module.exports = { getTaskDateRange };
