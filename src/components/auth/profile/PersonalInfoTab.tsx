
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { AvatarUpload } from './components/AvatarUpload';
import { ProfileForm } from './components/ProfileForm';
import { useProfileData } from './hooks/useProfileData';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { UserLinkEntityPanel } from './components/UserLinkEntityPanel';

interface PersonalInfoProps {
  user: any;
}

export const PersonalInfoTab = ({ user }: PersonalInfoProps) => {
  const {
    name,
    setName,
    phone,
    setPhone,
    role,
    avatarUrl,
    setAvatarUrl,
    city,
    setCity,
    state,
    setState,
    cpf,
    setCpf,
    creci,
    setCreci,
    associadoId,
    empresaId,
    setAssociadoId,
    setEmpresaId,
    isLoading
  } = useProfileData(user);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AvatarUpload 
            user={user} 
            avatarUrl={avatarUrl} 
            onAvatarUpdate={setAvatarUrl} 
          />
          
          <ProfileForm 
            user={user}
            name={name}
            phone={phone}
            role={role}
            city={city}
            state={state}
            cpf={cpf}
            creci={creci}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onCityChange={setCity}
            onStateChange={setState}
            onCpfChange={setCpf}
            onCreciChange={setCreci}
          />
          
          {/* Entity linking panel based on user role */}
          {(role === 'empresa' || role === 'user') && (
            <UserLinkEntityPanel
              role={role} 
              associadoId={associadoId}
              empresaId={empresaId}
              onAssociadoChange={setAssociadoId}
              onEmpresaChange={setEmpresaId}
              userId={user.id}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
