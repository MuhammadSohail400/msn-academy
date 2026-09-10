// Pakistani phone regex, email normalization, and other shared validators

export const PK_PHONE_REGEX = /^03[0-9]{9}$/; // e.g. 03001234567

export function isValidPkPhone(value) {
  return PK_PHONE_REGEX.test(value);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
