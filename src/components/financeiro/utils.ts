import type { PaymentMethod, InterestPaymentBy } from './types';

/**
 * Format a number as currency in Brazilian format
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a string as CPF (Brazilian individual taxpayer registry)
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove non-numeric characters and ensure it's not too long
  const cleanCPF = cpf.replace(/\D/g, '').slice(0, 11);
  
  // Apply CPF mask
  return cleanCPF
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Format a string as Brazilian phone number
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove non-numeric characters and ensure it's not too long
  const cleanPhone = phone.replace(/\D/g, '').slice(0, 11);
  
  // Apply phone mask based on length (with or without area code)
  if (cleanPhone.length <= 8) {
    return cleanPhone.replace(/(\d{4})(\d)/, '$1-$2');
  } else if (cleanPhone.length <= 10) {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

/**
 * Validate CPF (Brazilian individual taxpayer registry)
 * Returns true if the CPF is valid
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  
  if (parseInt(cleanCPF.charAt(9)) !== checkDigit) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  
  if (parseInt(cleanCPF.charAt(10)) !== checkDigit) return false;
  
  return true;
}

/**
 * Format a date in Brazilian format (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('pt-BR');
}

export type PaymentMethodOption = {
  value: PaymentMethod;
  label: string;
  description?: string;
};

export type InterestPaymentByOption = {
  value: InterestPaymentBy;
  label: string;
};
