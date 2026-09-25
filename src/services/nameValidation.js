const lettersOnly = (value) => value.replace(/[^\p{L}\p{M}]/gu, '');

const validateName = (value, requiredMessage) => {
  if (!value.trim()) return requiredMessage;
  if (!/^\p{L}[\p{L}\p{M}]*$/u.test(value)) return 'Use letters only.';
  return '';
};

module.exports = { lettersOnly, validateName };
