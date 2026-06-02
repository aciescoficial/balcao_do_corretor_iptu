
import { ImportConveniadoData, ImportValidationData } from './types';

export const parseCSVFile = (content: string): ImportConveniadoData[] => {
  const rows = content.split('\n');
  const headers = rows[0].split(',').map(h => h.trim());
  const parsedData: ImportConveniadoData[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const values = rows[i].split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header.toLowerCase()] = values[index] || '';
    });
    
    parsedData.push({
      id: `import-${i}`,
      nome: row.nome || '',
      sobrenome: row.sobrenome || '',
      cpf: row.cpf || '',
      creci: row.creci || undefined,
      status: 'pendente',
      email: row.email || '',
      celular: row.telefone || '',
      cidade: row.cidade || '',
      placaPrincipal: row.placa_principal || undefined,
      placaSecundaria: row.placa_secundaria || undefined,
      dataNascimento: row.data_nascimento || undefined,
      validade: row.validade || undefined,
      rua: row.rua || undefined,
      numero: row.numero || undefined,
      complemento: row.complemento || undefined,
      bairro: row.bairro || undefined,
      estado: row.estado || undefined,
      cep: row.cep || undefined,
      valorPago: row.valor_pago || undefined,
      dataUltimoPagamento: row.data_ultimo_pagamento || undefined,
      valorDevido: row.valor_devido || undefined,
      tipoPagamento: row.tipo_pagamento || undefined,
      tipoAssociado: row.tipo_associado || undefined,
    });
  }
  
  return parsedData;
};

export const parseXMLFile = (content: string): ImportConveniadoData[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const conveniados = xmlDoc.getElementsByTagName("conveniado");
  const parsedData: ImportConveniadoData[] = [];
  
  for (let i = 0; i < conveniados.length; i++) {
    const conv = conveniados[i];
    parsedData.push({
      id: `import-${i}`,
      nome: conv.getElementsByTagName("nome")[0]?.textContent || '',
      sobrenome: conv.getElementsByTagName("sobrenome")[0]?.textContent || '',
      cpf: conv.getElementsByTagName("cpf")[0]?.textContent || '',
      creci: conv.getElementsByTagName("creci")[0]?.textContent || undefined,
      status: 'pendente',
      email: conv.getElementsByTagName("email")[0]?.textContent || '',
      celular: conv.getElementsByTagName("telefone")[0]?.textContent || '',
      cidade: conv.getElementsByTagName("cidade")[0]?.textContent || '',
      placaPrincipal: conv.getElementsByTagName("placa_principal")[0]?.textContent || undefined,
      placaSecundaria: conv.getElementsByTagName("placa_secundaria")[0]?.textContent || undefined,
      dataNascimento: conv.getElementsByTagName("data_nascimento")[0]?.textContent || undefined,
      validade: conv.getElementsByTagName("validade")[0]?.textContent || undefined,
      rua: conv.getElementsByTagName("rua")[0]?.textContent || undefined,
      numero: conv.getElementsByTagName("numero")[0]?.textContent || undefined,
      complemento: conv.getElementsByTagName("complemento")[0]?.textContent || undefined,
      bairro: conv.getElementsByTagName("bairro")[0]?.textContent || undefined,
      estado: conv.getElementsByTagName("estado")[0]?.textContent || undefined,
      cep: conv.getElementsByTagName("cep")[0]?.textContent || undefined,
      valorPago: conv.getElementsByTagName("valor_pago")[0]?.textContent || undefined,
      dataUltimoPagamento: conv.getElementsByTagName("data_ultimo_pagamento")[0]?.textContent || undefined,
      valorDevido: conv.getElementsByTagName("valor_devido")[0]?.textContent || undefined,
      tipoPagamento: conv.getElementsByTagName("tipo_pagamento")[0]?.textContent || undefined,
      tipoAssociado: conv.getElementsByTagName("tipo_associado")[0]?.textContent || undefined,
    });
  }
  
  return parsedData;
};

export const validateImportData = (data: ImportConveniadoData[]): ImportValidationData[] => {
  const validations: ImportValidationData[] = [];
  const requiredFields = ['nome', 'sobrenome', 'cpf', 'email', 'celular', 'cidade'];
  
  const firstRow = data[0] || {};
  Object.keys(firstRow).forEach(key => {
    if (key === 'id' || key === 'status') return;
    
    const isValid = requiredFields.includes(key) 
      ? data.every(row => !!(row as any)[key])
      : true;
      
    validations.push({
      fieldName: key,
      targetField: key,
      isValid
    });
  });
  
  return validations;
};

export const generateCSVExport = (data: any[]): { content: string, fileName: string, mimeType: string } => {
  const headers = ['id', 'nome', 'sobrenome', 'cpf', 'creci', 'status', 'email', 'telefone', 'cidade', 
                   'placa_principal', 'placa_secundaria', 'data_nascimento', 'validade', 'rua', 'numero', 
                   'complemento', 'bairro', 'estado', 'cep', 'valor_pago', 'data_ultimo_pagamento', 
                   'valor_devido', 'tipo_pagamento', 'tipo_associado'];
  
  const csvRows = [
    headers.join(','),
    ...data.map(item => {
      return [
        item.id,
        item.nome,
        item.sobrenome,
        item.cpf,
        item.creci || '',
        item.status,
        item.email,
        item.telefone,
        item.cidade,
        item.placa_principal || '',
        item.placa_secundaria || '',
        item.data_nascimento || '',
        item.validade || '',
        item.rua || '',
        item.numero || '',
        item.complemento || '',
        item.bairro || '',
        item.estado || '',
        item.cep || '',
        item.valor_pago || '',
        item.data_ultimo_pagamento || '',
        item.valor_devido || '',
        item.tipo_pagamento || '',
        item.tipo_associado || ''
      ].join(',');
    })
  ];
  
  return {
    content: csvRows.join('\n'),
    fileName: 'conveniados.csv',
    mimeType: 'text/csv',
  };
};

export const generateXMLExport = (data: any[]): { content: string, fileName: string, mimeType: string } => {
  const xmlRows = data.map(item => {
    return `  <conveniado>
    <id>${item.id}</id>
    <nome>${item.nome}</nome>
    <sobrenome>${item.sobrenome}</sobrenome>
    <cpf>${item.cpf}</cpf>
    <creci>${item.creci || ''}</creci>
    <status>${item.status}</status>
    <email>${item.email}</email>
    <telefone>${item.telefone}</telefone>
    <cidade>${item.cidade}</cidade>
    <placa_principal>${item.placa_principal || ''}</placa_principal>
    <placa_secundaria>${item.placa_secundaria || ''}</placa_secundaria>
    <data_nascimento>${item.data_nascimento || ''}</data_nascimento>
    <validade>${item.validade || ''}</validade>
    <rua>${item.rua || ''}</rua>
    <numero>${item.numero || ''}</numero>
    <complemento>${item.complemento || ''}</complemento>
    <bairro>${item.bairro || ''}</bairro>
    <estado>${item.estado || ''}</estado>
    <cep>${item.cep || ''}</cep>
    <valor_pago>${item.valor_pago || ''}</valor_pago>
    <data_ultimo_pagamento>${item.data_ultimo_pagamento || ''}</data_ultimo_pagamento>
    <valor_devido>${item.valor_devido || ''}</valor_devido>
    <tipo_pagamento>${item.tipo_pagamento || ''}</tipo_pagamento>
    <tipo_associado>${item.tipo_associado || ''}</tipo_associado>
  </conveniado>`;
  });
  
  return {
    content: `<?xml version="1.0" encoding="UTF-8"?>
<conveniados>
${xmlRows.join('\n')}
</conveniados>`,
    fileName: 'conveniados.xml',
    mimeType: 'application/xml',
  };
};

export const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
