import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'hs_admin_session';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || `${getAdminUsername()}:${getAdminPassword()}:dev-secret`;
}

function secureEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function sign(username: string) {
  return crypto.createHmac('sha256', getSessionSecret()).update(username).digest('hex');
}

export function isValidAdminLogin(username: string, password: string) {
  return secureEqual(username, getAdminUsername()) && secureEqual(password, getAdminPassword());
}

export function createAdminSessionToken(username = getAdminUsername()) {
  return `${username}.${sign(username)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  const separatorIndex = token.indexOf('.');
  if (separatorIndex <= 0) return false;

  const username = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (!secureEqual(username, getAdminUsername())) return false;
  return secureEqual(signature, sign(username));
}

export function shouldUseSecureCookie() {
  return process.env.NODE_ENV === 'production';
}
