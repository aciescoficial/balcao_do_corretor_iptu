
export type UserRole = "user" | "admin" | "empresa" | "diretoria";

export type UserTag = 
  | "corretor" 
  | "corretor_autonomo" 
  | "empresa_conveniada" 
  | "diretoria_aciesc" 
  | "administrador" 
  | "financeiro" 
  | "proprietario_imobiliaria"
  | "imobiliaria"
  | "aciesc";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  tags?: UserTag[];
  created_at?: string;
  avatar_url?: string;
  active?: boolean;
  last_sign_in?: string;
  associado_id?: string;
  empresa_id?: string;
}

export interface RoleInfo {
  id: UserRole;
  name: string;
  description: string;
  icon: JSX.Element;
}

export interface TagInfo {
  id: UserTag;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'associados' | 'financeiro' | 'sistema' | 'empresas';
  roles: UserRole[];
}

// Tipo de permissão de menu
export interface MenuPermission {
  menuId: string;
  role: UserRole;
  enabled: boolean;
  subPermissions: Record<string, boolean>;
}

// User type for user management
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tags?: UserTag[];
  active: boolean;
  createdAt: Date;
  associado_id?: string;
  associado_cpf?: string; // To display the linked associado's CPF
  empresa_id?: string;
  empresa_cnpj?: string; // To display the linked empresa's CNPJ
}
