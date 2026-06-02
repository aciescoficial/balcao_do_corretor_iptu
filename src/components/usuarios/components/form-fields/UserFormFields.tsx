
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole, UserTag } from '../../types';
import { getUserTags } from '../../utils/roleUtils';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const NameField: React.FC<NameFieldProps> = ({ value, onChange, id = 'name' }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Nome</Label>
    <Input
      id={id}
      placeholder="Digite o nome completo"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, id = 'email' }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Email</Label>
    <Input
      id={id}
      type="email"
      placeholder="Digite o email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

interface RoleSelectProps {
  value: UserRole | undefined;
  onChange: (value: UserRole) => void;
  id?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, id = 'role' }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Tipo de Usuário</Label>
    <Select
      value={value}
      onValueChange={(value) => onChange(value as UserRole)}
      required
    >
      <SelectTrigger id={id}>
        <SelectValue placeholder="Selecione o tipo de usuário" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Administrador</SelectItem>
        <SelectItem value="user">Associado</SelectItem>
        <SelectItem value="empresa">Empresa</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

interface UserTagsFieldProps {
  selectedTags: UserTag[] | undefined;
  onTagChange: (tagId: UserTag, checked: boolean) => void;
  prefix?: string;
}

export const UserTagsField: React.FC<UserTagsFieldProps> = ({ 
  selectedTags, 
  onTagChange,
  prefix = ''
}) => {
  const availableTags = getUserTags();
  
  return (
    <div className="space-y-2">
      <Label>Tags do Usuário</Label>
      <div className="grid grid-cols-1 gap-2 mt-2">
        {availableTags.map((tag) => (
          <div className="flex items-center space-x-2" key={tag.id}>
            <Checkbox 
              id={`${prefix}-tag-${tag.id}`}
              checked={selectedTags?.includes(tag.id) || false}
              onCheckedChange={(checked) => onTagChange(tag.id, checked === true)}
            />
            <Label 
              htmlFor={`${prefix}-tag-${tag.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {tag.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
