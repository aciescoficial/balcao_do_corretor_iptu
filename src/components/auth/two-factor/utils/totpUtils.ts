
import * as OTPAuth from 'otpauth';

/**
 * Generates a random secret for TOTP authentication
 * @returns A base32 encoded secret string
 */
export const generateSecret = (): string => {
  // Generate a random secret for TOTP
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates backup codes for 2FA recovery
 * @returns An array of 10 backup codes
 */
export const generateBackupCodes = (): string[] => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += Math.floor(Math.random() * 10);
    }
    codes.push(code);
  }
  return codes;
};

/**
 * Generates a QR code URL for TOTP setup
 * @param secret TOTP secret
 * @param email User email
 * @returns URL for QR code image
 */
export const generateQrCodeUrl = (secret: string, email: string): string => {
  const totp = new OTPAuth.TOTP({
    issuer: 'ACIESC',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });

  return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(totp.toString())}`;
};

/**
 * Verifies a TOTP token
 * @param secret TOTP secret
 * @param token Token to verify
 * @returns Whether the token is valid
 */
export const verifyTotp = (secret: string, token: string): boolean => {
  const totp = new OTPAuth.TOTP({
    issuer: 'ACIESC',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });

  return totp.validate({ token, window: 1 }) !== null;
};
