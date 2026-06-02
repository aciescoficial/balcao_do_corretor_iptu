
import React from 'react';
import { Download, HelpCircle } from 'lucide-react';
import Papa from 'papaparse';

const ImportInstructions: React.FC = () => {
  const downloadTemplate = () => {
    const template = [
      {
        nome_fantasia: "Empresa Exemplo",
        razao_social: "Empresa Exemplo LTDA",
        cnpj: "12.345.678/0001-00",
        responsavel: "João Silva",
        telefone: "(11) 98765-4321",
        email: "contato@empresa.com",
        cidade: "São Paulo",
        nicho: "Comércio",
        status: "ativo",
        endereco: "Rua Exemplo, 123",
        cep: "01234-567",
        site: "www.empresa.com",
        instagram: "@empresa",
        whatsapp: "(11) 98765-4321",
        desconto: "10% para associados"
      }
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_empresas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded border">
      <h4 className="font-medium flex items-center gap-2 mb-2">
        <HelpCircle className="h-4 w-4 text-blue-500" />
        Instruções para Importação
      </h4>
      
      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>Prepare um arquivo CSV com as colunas necessárias para importação</li>
        <li>As colunas obrigatórias são: nome_fantasia, razao_social, cnpj, responsavel, telefone, email, cidade, nicho, endereco e cep</li>
        <li>Para o campo "nicho", use um dos seguintes valores: Alimentação, Saúde, Educação, Serviços, Comércio, Lazer, Tecnologia, Outro</li>
        <li>Para o campo "status", use um dos seguintes valores: ativo, pendente, inativo</li>
        <li>Certifique-se de que o CSV está corretamente formatado antes de importar</li>
      </ul>
      
      <div className="mt-4">
        <button 
          className="text-sm text-blue-500 flex items-center gap-1"
          onClick={downloadTemplate}
        >
          <Download className="h-4 w-4" />
          Baixar modelo de CSV para importação
        </button>
      </div>
    </div>
  );
};

export default ImportInstructions;
