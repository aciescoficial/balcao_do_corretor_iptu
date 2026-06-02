
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PagamentoSucesso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        try {
          // In a real application, you'd fetch the session details from your backend
          // For this example, we'll just use sample data
          setOrderDetails({
            id: sessionId,
            product: "Taxa de Carteirinha",
            total: "R$ 15,00",
            date: new Date().toLocaleDateString('pt-BR')
          });
        } catch (error) {
          console.error('Erro ao carregar detalhes do pagamento:', error);
        }
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pagamento Confirmado</h1>
      
      <div className="wp-card text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pagamento realizado com sucesso!</h2>
          <p className="text-muted-foreground">
            Obrigado por solicitar sua carteirinha. Seu pedido foi recebido e será processado em breve.
          </p>
          
          {orderDetails && (
            <div className="mt-8 p-6 border rounded-lg w-full max-w-md">
              <h3 className="text-lg font-medium mb-4 text-left">Detalhes do pedido:</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pedido:</span>
                  <span>#{orderDetails.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produto:</span>
                  <span>{orderDetails.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{orderDetails.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span>{orderDetails.date}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Você receberá um e-mail com os detalhes da sua compra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
              <Button asChild>
                <Link to="/meus-pagamentos">Ver meus pagamentos</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Voltar para o painel</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.aciesc.com.br">Sair Agora</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentoSucesso;
