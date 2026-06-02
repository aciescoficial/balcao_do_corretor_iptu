
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { User, UserRole, UserTag } from '../types';
import { getTagBadgeColor } from '../utils/roleUtils';
import { Edit } from 'lucide-react';

interface UserListProps {
  loading: boolean;
  filteredUsers: User[];
  onEdit: (user: User) => void;
  onToggleActive: (userId: string, active: boolean) => void;
  getRoleBadgeColor: (role: UserRole) => string;
  getRoleLabel: (role: UserRole) => string;
  isMobile?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  loading,
  filteredUsers,
  onEdit,
  onToggleActive,
  getRoleBadgeColor,
  getRoleLabel,
  isMobile = false
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableCaption>Lista de usuários do sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Email</TableHead>
            <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Tipo</TableHead>
            <TableHead className={isMobile ? "hidden lg:table-cell" : ""}>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <LoadingSpinner size="medium" text="Carregando usuários..." />
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow 
                key={user.id} 
                className="transition-colors hover:bg-muted/40 group"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className={isMobile ? "hidden md:table-cell" : ""}>{user.email}</TableCell>
                <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                  <Badge className={`font-normal ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className={isMobile ? "hidden lg:table-cell" : ""}>
                  <div className="flex flex-wrap gap-1">
                    {user.tags && user.tags.length > 0 ? (
                      user.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className={`text-xs ${getTagBadgeColor(tag)}`}
                        >
                          {tag.replace(/_/g, ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem tags</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Switch
                      checked={user.active}
                      onCheckedChange={(checked) => onToggleActive(user.id, checked)}
                      className="transition-opacity opacity-70 group-hover:opacity-100"
                    />
                    <span className="ml-2">{user.active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4 mr-1" /> {isMobile ? "" : "Editar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
