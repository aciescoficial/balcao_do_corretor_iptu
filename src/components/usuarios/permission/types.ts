
import { UserRole, UserTag } from '../types';

export interface MenuPermission {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  subPermissions: {
    id: string;
    description: string;
    enabled: boolean;
  }[];
}

export interface SubPermission {
  id: string;
  description: string;
  enabled: boolean;
}

export interface SaveLoadingState {
  [key: string]: boolean;
}
