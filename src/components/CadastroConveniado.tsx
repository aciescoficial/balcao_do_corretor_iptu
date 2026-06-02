
import React from 'react';
import { ConveniadoForm } from './conveniado/ConveniadoForm';
import { ImportDialog } from './conveniado/ImportDialog';
import { ImportExportActions } from './conveniado/ImportExportActions';
import { useImportExportConveniado } from './conveniado/hooks/useImportExportConveniado';

const CadastroConveniado: React.FC = () => {
  const {
    showImportDialog,
    setShowImportDialog,
    importData,
    validationData,
    setValidationData,
    isSubmitting,
    fileInputRef,
    isAdmin,
    handleImportClick,
    handleFileChange,
    handleImportConfirm,
    handleExport
  } = useImportExportConveniado();
  
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Conveniado</h1>
      
      <div className="wp-card">
        <ConveniadoForm />
        
        <ImportExportActions 
          onImportClick={handleImportClick}
          onFileChange={handleFileChange}
          onExportCsv={() => handleExport('csv')}
          onExportXml={() => handleExport('xml')}
          fileInputRef={fileInputRef}
          isAdmin={isAdmin}
        />
      </div>
      
      <ImportDialog 
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
};

export default CadastroConveniado;
