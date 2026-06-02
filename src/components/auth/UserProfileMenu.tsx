
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Settings, LogOut, User, UserCog, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { UserTag } from '../usuarios/types';
import { getTagBadgeColor, getUserTags } from '../usuarios/utils/roleUtils';
import { useToast } from '@/hooks/use-toast';

const UserProfileMenu = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user')
          .select('name, avatar_url, tags')
          .eq('id', user.id)
          .maybeSingle(); // Using maybeSingle instead of single
          
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        if (data) {
          setUserName(data.name || '');
          setAvatarUrl(data.avatar_url);
          // Convert string[] to UserTag[] by filtering to only valid UserTag values
          const validUserTags = Array.isArray(data.tags) ? data.tags.filter(tag => 
            ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
             'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc'].includes(tag)
          ) as UserTag[] : [];
          
          setUserTags(validUserTags);
        } else {
          // No data found, create a new user entry
          const { error: insertError } = await supabase
            .from('user')
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || '',
              role: 'user'
            });
            
          if (insertError) {
            console.error('Error creating user record:', insertError);
            toast({
              variant: "destructive",
              title: "Erro de perfil",
              description: "Não foi possível criar seu perfil. Por favor, atualize suas informações."
            });
          } else {
            setUserName(user.user_metadata?.name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/login">Login</Link>
      </Button>
    );
  }
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (userName) {
      const nameParts = userName.trim().split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return userName.substring(0, 2).toUpperCase();
    }
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  // Get tag name from id
  const getTagName = (tagId: UserTag) => {
    const tag = getUserTags().find(t => t.id === tagId);
    return tag ? tag.name : tagId.replace(/_/g, ' ');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col">
          <span>{userName || user.email}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
          
          {userTags && userTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {userTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={`text-xs ${getTagBadgeColor(tag)}`}
                >
                  {getTagName(tag)}
                </Badge>
              ))}
            </div>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuItem asChild>
          <Link to="/perfil" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administração</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/usuarios" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Gerenciar Usuários</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
