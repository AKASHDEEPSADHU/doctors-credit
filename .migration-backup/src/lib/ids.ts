const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function bytes(n: number) {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

export function randomToken(length: number) {
  const buf = bytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[buf[i] % ALPHABET.length];
  return out;
}

export function formatApplicationId(seq: number) {
  if (!Number.isInteger(seq) || seq < 1) {
    throw new Error("Application sequence must be a positive integer.");
  }
  return `DC-${String(seq).padStart(6, "0")}`;
}

export function newConversationVerificationId() {
  return `CV-${randomToken(5)}`;
}

export function newCallVerificationId() {
  return `CALL-${randomToken(5)}`;
}

export function newInternalId() {
  return crypto.randomUUID();
}

export function isApplicationId(value: string) {
  return /^DC-\d{6}$/.test(value.trim().toUpperCase());
}

export function isConversationVerificationId(value: string) {
  return /^CV-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/.test(value.trim().toUpperCase());
}

export function isCallVerificationId(value: string) {
  return /^CALL-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/.test(value.trim().toUpperCase());
}

export function normalizePublicId(value: string) {
  return value.trim().toUpperCase();
}
