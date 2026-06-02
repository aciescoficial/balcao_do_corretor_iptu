
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AprovacaoInteresse from './AprovacaoInteresse';
import AprovacaoAprovados from './components/AprovacaoAprovados';
import FluxoAprovacao from './components/FluxoAprovacao';
import CodigoIncorporacao from './components/CodigoIncorporacao';
import { FileCheck, Users, GitBranch, Code } from 'lucide-react';

const AprovacaoInteressePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Aprovação de Associados</h1>
      </div>
      
      <Tabs defaultValue="aprovacao" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="aprovacao" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Pendentes</span>
          </TabsTrigger>
          <TabsTrigger value="aprovados" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Aprovados</span>
          </TabsTrigger>
          <TabsTrigger value="fluxo" className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <GitBranch className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualize o processo de aprovação de associados</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Fluxo</span>
          </TabsTrigger>
          <TabsTrigger value="incorporacao" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Form Embed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="aprovacao" className="mt-0">
          <AprovacaoInteresse />
        </TabsContent>

        <TabsContent value="aprovados" className="mt-0">
          <AprovacaoAprovados />
        </TabsContent>
        
        <TabsContent value="fluxo" className="mt-0">
          <FluxoAprovacao />
        </TabsContent>
        
        <TabsContent value="incorporacao" className="mt-0">
          <CodigoIncorporacao />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AprovacaoInteressePage;
