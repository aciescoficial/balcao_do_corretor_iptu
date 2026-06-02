
import { useAuth } from '@/components/auth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoTab } from './PersonalInfoTab';
import { SecurityTab } from './SecurityTab';
import { ActivityLogsTab } from './ActivityLogsTab';
import { User, Shield, ClipboardList } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="personal" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Dados Pessoais</span>
              <span className="sm:hidden">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
              <span className="sm:hidden">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Atividade</span>
              <span className="sm:hidden">Logs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <PersonalInfoTab user={user} />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab userId={user.id} />
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <ActivityLogsTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
