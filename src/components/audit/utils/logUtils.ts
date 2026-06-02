
/**
 * Maps entity type to human-readable labels
 */
export const getEntityLabel = (entityType: string): string => {
  switch (entityType) {
    case 'associado':
      return 'Associados';
    case 'conveniado':
      return 'Conveniados';
    case 'empresa':
      return 'Empresas';
    default:
      return entityType;
  }
};
