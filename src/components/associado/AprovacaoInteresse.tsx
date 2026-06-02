
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAprovacaoInteresse } from './hooks/useAprovacaoInteresse';
import InteresseDesktopTable from './components/InteresseDesktopTable';
import InteresseMobileCard from './components/InteresseMobileCard';
import AprovacaoAlertas from './components/AprovacaoAlertas';
import { Search, RefreshCw } from 'lucide-react';
import ApprovalDialog from './components/ApprovalDialog';

const AprovacaoInteresse: React.FC = () => {
  const { 
    interesses,
    isLoading, 
    isAdmin, 
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    fetchPendingInterests, 
    handleSearch,
    openApprovalDialog,
    closeApprovalDialog,
    handleApprove,
    handleReject,
    isApprovalDialogOpen,
    isProcessingApproval,
    selectedInterestForApproval,
    approvalError
  } = useAprovacaoInteresse();
  const isMobile = useIsMobile();

  if (!isAdmin) {
    return (
      <div className="text-center p-6">
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Solicitações de Interesse</h2>
        
        {/* Filter and search section */}
        <div className="flex flex-col md:flex-row gap-3">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="aprovado">Aprovados</SelectItem>
              <SelectItem value="rejeitado">Rejeitados</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Select
              value={searchField}
              onValueChange={(value) => setSearchField(value as 'nome' | 'email')}
            >
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue placeholder="Campo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex-grow">
              <Input 
                placeholder={searchField === 'nome' ? "Pesquisar por nome..." : "Pesquisar por email..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <Button onClick={handleSearch} size="sm">
              Buscar
            </Button>
          </div>
          
          <Button onClick={fetchPendingInterests} variant="outline" size="sm" disabled={isLoading} className="md:ml-2">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Carregando...' : 'Atualizar'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : interesses.length === 0 ? (
        <Alert>
          <AlertTitle>Nenhum interesse encontrado</AlertTitle>
          <AlertDescription>
            Não há interesses de associação para exibir com os filtros atuais.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <AprovacaoAlertas />
          
          {/* Mobile view */}
          {isMobile && (
            <div className="md:hidden space-y-4">
              {interesses.map(interesse => (
                <InteresseMobileCard 
                  key={interesse.id}
                  interesse={interesse} 
                  onApprove={() => openApprovalDialog(interesse)}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
          
          {/* Desktop view */}
          {!isMobile && (
            <div className="hidden md:block overflow-x-auto">
              <InteresseDesktopTable 
                interesses={interesses} 
                onApprove={(interesse) => openApprovalDialog(interesse)}
                onReject={handleReject}
              />
            </div>
          )}
        </div>
      )}

      {/* Approval Dialog */}
      {selectedInterestForApproval && (
        <ApprovalDialog 
          isOpen={isApprovalDialogOpen}
          onClose={closeApprovalDialog}
          onApprove={handleApprove}
          nome={selectedInterestForApproval.nome}
          sobrenome={selectedInterestForApproval.sobrenome}
          email={selectedInterestForApproval.email}
          isProcessing={isProcessingApproval}
          error={approvalError}
        />
      )}
    </div>
  );
};

export default AprovacaoInteresse;
