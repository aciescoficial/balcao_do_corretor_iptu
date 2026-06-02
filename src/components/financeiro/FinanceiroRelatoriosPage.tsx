
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { format } from 'date-fns';
import { Filter, Search, FileText, Eye, Printer, Mail, Check } from 'lucide-react';
import { FinanceiroRelatoriosFilter } from './FinanceiroRelatoriosFilter';
import { FinancialReport } from './types';

const FinanceiroRelatoriosPage: React.FC = () => {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      
      // Calculate pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Fetch associados with their payment info
      let query = supabase
        .from('associados')
        .select('id, nome, sobrenome, tipo_associado, valor_devido, data_ultimo_pagamento, tipo_pagamento', { count: 'exact' })
        .order('data_ultimo_pagamento', { ascending: false });
      
      // Apply search if provided
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query.range(from, to);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our report format
      const reportData: FinancialReport[] = data?.map(associado => ({
        id: associado.id,
        nome: `${associado.nome} ${associado.sobrenome}`,
        valor: parseFloat(associado.valor_devido || '0'),
        descricao: associado.tipo_associado || 'Plano Padrão',
        formaPagamento: associado.tipo_pagamento || 'Boleto Bancário',
        dataVencimento: associado.data_ultimo_pagamento ? new Date(associado.data_ultimo_pagamento) : new Date(),
        status: 'pago' // Assumindo que todos estão pagos para este exemplo
      })) || [];
      
      // Calculate totals
      const total = reportData.reduce((acc, item) => acc + item.valor, 0);
      
      setReports(reportData);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      setTotalValue(total);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os relatórios financeiros.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchReports();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key="1">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if not the first
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    return items;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Relatório Financeiro</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" /> Adicionar cobrança
        </Button>
      </div>
      
      <div className="wp-card">
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="mr-2"
            >
              <Filter className="h-4 w-4 mr-1" /> Filtros
            </Button>
            
            <div className="relative flex-1">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  placeholder="Procurar por nome ou email do cliente"
                  className="w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              Ações em lote
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <FinanceiroRelatoriosFilter onApplyFilters={fetchReports} />
          </div>
        )}

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nome</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-[250px]">Descrição</TableHead>
                <TableHead>Forma de pagamento</TableHead>
                <TableHead>Data de vencimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando dados...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum resultado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full mr-2 ${report.status === 'pago' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {report.nome}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(report.valor)}</TableCell>
                    <TableCell>{report.descricao}</TableCell>
                    <TableCell>{report.formaPagamento}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {formatDate(report.dataVencimento)}
                        {report.status === 'pago' && <Check className="h-4 w-4 ml-2 text-green-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Gerar documento">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Imprimir">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Enviar email">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary and Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            {totalCount} cobranças no valor total de {formatCurrency(totalValue)} das {totalCount} cobranças existentes.
          </div>
          
          <Pagination>
            <PaginationContent>
              {generatePaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default FinanceiroRelatoriosPage;
