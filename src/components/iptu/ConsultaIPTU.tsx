import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, History, AlertCircle, Loader2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  searchIPTU,
  getMyIPTUQueries,
  openIPTUEspelho,
  openIPTUPortal,
  IPTUSearchParams,
  ImovelItem,
  IPTUQueryLog,
} from "@/services/iptuService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ConsultaIPTU() {
  const { toast } = useToast();
  const [results, setResults] = useState<ImovelItem[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [ordem, setOrdem] = useState<string>("nm_nomefantasia");

  const { register, handleSubmit, reset } = useForm<IPTUSearchParams>({ defaultValues: {} });

  const { data: queryHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["iptu-history"],
    queryFn: getMyIPTUQueries,
    staleTime: 30_000,
  });

  const searchMutation = useMutation({
    mutationFn: searchIPTU,
    onSuccess: (data) => {
      setResults(data.items);
      setTotalCount(data.count);
      refetchHistory();

      if (data.count === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Refine os critérios de busca e tente novamente.",
        });
      }
    },
    onError: (err: Error) => {
      toast({
        title: "Erro na consulta",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (params: IPTUSearchParams) => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v?.trim())
    ) as IPTUSearchParams;

    if (Object.keys(filtered).length === 0) {
      toast({
        title: "Informe ao menos um campo",
        description: "Preencha pelo menos um critério de busca.",
        variant: "destructive",
      });
      return;
    }

    filtered.ordem = ordem;
    setResults(null);
    searchMutation.mutate(filtered);
  };

  const [portalLoading, setPortalLoading] = useState(false);

  const handleOpenEspelho = async (item: ImovelItem) => {
    try {
      await openIPTUEspelho(item.id_imovel_corretor, item.cd_imovel_corretor);
    } catch (err: unknown) {
      toast({
        title: "Erro ao abrir espelho",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    try {
      await openIPTUPortal();
    } catch (err: unknown) {
      toast({
        title: "Erro ao acessar portal",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const formatSearchParams = (params: IPTUSearchParams) => {
    const labels: Record<string, string> = {
      cd_imovel: "Reduzido",
      nr_inscricao: "Inscrição",
      nm_logradouro: "Logradouro",
      nr_imovel: "Nº",
      ds_complemento: "Compl.",
      nm_bairro: "Bairro",
      nr_cep: "CEP",
      nr_apto: "Apto",
      nm_edificio: "Edifício",
      cd_quadra: "Quadra",
      cd_lote: "Lote",
      ds_loteamento: "Loteamento",
      nm_requerente: "Proprietário",
    };
    return (
      Object.entries(params)
        .filter(([k, v]) => v && labels[k])
        .map(([k, v]) => `${labels[k]}: ${v}`)
        .join(" | ") || "—"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Consulte imóveis no cadastro da Prefeitura de Itapema. Exclusivo para associados ativos.
        </p>
        <Button
          variant="outline"
          onClick={handleOpenPortal}
          disabled={portalLoading}
          className="shrink-0"
          title="Abrir o portal completo da prefeitura já autenticado"
        >
          {portalLoading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Acessando...</>
          ) : (
            <><Globe className="h-4 w-4 mr-2" /> Portal Completo</>
          )}
        </Button>
      </div>

      <Tabs defaultValue="busca">
        <TabsList>
          <TabsTrigger value="busca">
            <Search className="h-4 w-4 mr-1" /> Busca
          </TabsTrigger>
          <TabsTrigger value="historico">
            <History className="h-4 w-4 mr-1" /> Histórico
          </TabsTrigger>
        </TabsList>

        {/* ── Search Tab ── */}
        <TabsContent value="busca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filtros de Pesquisa</CardTitle>
              <CardDescription>
                Preencha ao menos um campo. A busca é realizada em tempo real no sistema da
                Prefeitura Municipal de Itapema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Bloco 1: Código / Inscrição */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Código / Inscrição
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="cd_imovel">Reduzido do Imóvel</Label>
                      <Input
                        id="cd_imovel"
                        placeholder="Ex: 97415"
                        {...register("cd_imovel")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nr_inscricao">Inscrição Cadastral</Label>
                      <Input
                        id="nr_inscricao"
                        placeholder="Inscrição completa"
                        {...register("nr_inscricao")}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bloco 2: Logradouro */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Logradouro
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="nm_logradouro">Nome do Logradouro</Label>
                      <Input
                        id="nm_logradouro"
                        placeholder="Ex: BRASIL"
                        {...register("nm_logradouro")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nr_imovel">Número</Label>
                      <Input
                        id="nr_imovel"
                        placeholder="Ex: 456"
                        {...register("nr_imovel")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ds_complemento">Complemento</Label>
                      <Input
                        id="ds_complemento"
                        placeholder="Ex: SALA 2"
                        {...register("ds_complemento")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="nm_bairro">Bairro</Label>
                      <Input
                        id="nm_bairro"
                        placeholder="Ex: CENTRO"
                        {...register("nm_bairro")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nr_cep">CEP</Label>
                      <Input
                        id="nr_cep"
                        placeholder="Ex: 88220000"
                        {...register("nr_cep")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nr_apto">Apto</Label>
                      <Input
                        id="nr_apto"
                        placeholder="Ex: 302"
                        {...register("nr_apto")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <Label htmlFor="nm_edificio">Edifício / Condomínio</Label>
                      <Input
                        id="nm_edificio"
                        placeholder="Ex: RESIDENCIAL MAR AZUL"
                        {...register("nm_edificio")}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bloco 3: Quadra / Lote */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Quadra / Lote
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="cd_quadra">Quadra</Label>
                      <Input
                        id="cd_quadra"
                        placeholder="Ex: 012"
                        {...register("cd_quadra")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cd_lote">Lote</Label>
                      <Input
                        id="cd_lote"
                        placeholder="Ex: 0005"
                        {...register("cd_lote")}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="ds_loteamento">Loteamento</Label>
                      <Input
                        id="ds_loteamento"
                        placeholder="Ex: VILA NOVA"
                        {...register("ds_loteamento")}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bloco 4: Proprietário / Ordenação */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Proprietário / Resultado
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="nm_requerente">Nome do Proprietário</Label>
                      <Input
                        id="nm_requerente"
                        placeholder="Ex: JOÃO DA SILVA"
                        {...register("nm_requerente")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Ordenar por</Label>
                      <Select value={ordem} onValueChange={setOrdem}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nm_nomefantasia">Nome do Contribuinte</SelectItem>
                          <SelectItem value="ds_logradouro">Nome do Logradouro</SelectItem>
                          <SelectItem value="nm_bairro">Nome do Bairro</SelectItem>
                          <SelectItem value="cd_imovel">Código do Imóvel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    disabled={searchMutation.isPending}
                    className="bg-aciesc-primary hover:bg-aciesc-primary/90"
                  >
                    {searchMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Consultando...</>
                    ) : (
                      <><Search className="h-4 w-4 mr-2" /> Buscar Imóveis</>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { reset(); setResults(null); setOrdem("nm_proprietario"); }}
                  >
                    Limpar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {results !== null && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Resultados</CardTitle>
                  <Badge variant={totalCount > 0 ? "default" : "secondary"}>
                    {totalCount} registro{totalCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {results.length === 0 ? (
                  <div className="flex items-center gap-2 p-6 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Nenhum imóvel localizado com os critérios informados.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Reduzido</TableHead>
                          <TableHead>Proprietário</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead className="w-36">Bairro</TableHead>
                          <TableHead className="w-24 text-right">BCI</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((item) => (
                          <TableRow key={`${item.id_imovel_corretor}-${item.cd_imovel}`}>
                            <TableCell className="font-mono text-xs font-semibold text-red-600">
                              {item.cd_imovel}
                            </TableCell>
                            <TableCell className="text-sm">{item.nm_proprietario}</TableCell>
                            <TableCell className="text-sm">{item.endereco}</TableCell>
                            <TableCell className="text-sm">{item.nm_bairro}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEspelho(item)}
                                title="Abrir Boletim Cadastral Imobiliário"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Espelho
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── History Tab ── */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Minhas Consultas</CardTitle>
              <CardDescription>Últimas 50 consultas realizadas por você.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {!queryHistory || queryHistory.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Nenhuma consulta registrada ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Data/Hora</TableHead>
                        <TableHead>Parâmetros</TableHead>
                        <TableHead className="w-28 text-right">Resultados</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryHistory.map((q: IPTUQueryLog) => (
                        <TableRow key={q.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {format(new Date(q.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-xs max-w-sm truncate">
                            {formatSearchParams(q.search_params)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{q.result_count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Os dados são obtidos em tempo real do sistema da Prefeitura de Itapema. Todas as consultas
        são registradas para fins de auditoria. Clique em "Espelho" para abrir o Boletim Cadastral
        Imobiliário completo do imóvel.
      </p>
    </div>
  );
}
