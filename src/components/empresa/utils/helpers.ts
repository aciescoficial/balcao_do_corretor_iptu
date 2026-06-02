
/**
 * Get badge colors for company nicho (category)
 */
export const getBadgeColors = (nicho: string): [string, string] => {
  const nichoColorMap: Record<string, [string, string]> = {
    'Alimentação': ['#7c2d12', '#ffedd5'],
    'Saúde': ['#14532d', '#dcfce7'],
    'Educação': ['#172554', '#dbeafe'],
    'Serviços': ['#4c1d95', '#f3e8ff'],
    'Comércio': ['#713f12', '#fef3c7'],
    'Lazer': ['#0f766e', '#ccfbf1'],
    'Tecnologia': ['#7e22ce', '#f3e8ff'],
    'Outro': ['#374151', '#f3f4f6']
  };
  
  return nichoColorMap[nicho] || ['#374151', '#f3f4f6'];
};

/**
 * Format phone number in Brazilian format
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleanNumber = phone.replace(/\D/g, '');
  
  // Check if it's a mobile number (11 digits) or landline (10 digits)
  if (cleanNumber.length === 11) {
    // Mobile: (XX) XXXXX-XXXX
    return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 7)}-${cleanNumber.substring(7)}`;
  } else if (cleanNumber.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6)}`;
  }
  
  // Return original if format doesn't match
  return phone;
};
