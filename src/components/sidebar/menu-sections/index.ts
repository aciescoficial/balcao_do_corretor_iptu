
import { MenuItem } from '../types/MenuItem';
import { getDashboardMenuItems } from './DashboardMenu';
import { getAdminMenuItems } from './AdminMenu';
import { getAssociadosMenuItems } from './AssociadosMenu';
import { getEmpresasMenuItems } from './EmpresasMenu';
import { getFinanceiroMenuItems } from './FinanceiroMenu';
import { getConfiguracoesMenuItems } from './ConfiguracoesMenu';
import { getUserMenuItems } from './UserMenu';
import { getEmpresaMenuItems } from './EmpresaMenu';
import { getComunicacaoMenuItems } from './ComunicacaoMenu';

export const getAllMenuItems = (): MenuItem[] => {
  return [
    ...getDashboardMenuItems(), // Block 1
    ...getAdminMenuItems(),     // Block 3
    ...getAssociadosMenuItems(), // Block 3
    ...getEmpresasMenuItems(),  // Block 3
    ...getFinanceiroMenuItems(), // Block 3
    ...getUserMenuItems(),      // Block 4
    ...getEmpresaMenuItems(),   // Block 4
    ...getConfiguracoesMenuItems(), // Block 5
    ...getComunicacaoMenuItems(), // Block 3
  ];
};
