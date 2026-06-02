
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';
import { useEmpresaFormSubmit } from './hooks/useEmpresaFormSubmit';
import EmpresaDadosGerais from './EmpresaDadosGerais';
import EmpresaContato from './EmpresaContato';
import EmpresaEndereco from './EmpresaEndereco';
import EmpresaNichoInfo from './EmpresaNichoInfo';
import { EmpresaImageUpload } from './EmpresaImageUpload';
import LocationPicker from './map/LocationPicker';
import { FormActions } from './components/form/FormActions';

const EmpresaForm: React.FC = () => {
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmpresaFormData>();
  const { handleSubmit: onSubmit, isSubmitting } = useEmpresaFormSubmit();

  const handleFormSubmit = (data: EmpresaFormData) => {
    onSubmit(data, reset, latitude, longitude);
  };

  const handleImageUpload = (url: string) => {
    setLogoUrl(url);
    setValue('logoUrl', url);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmpresaDadosGerais register={register} errors={errors} />
        <EmpresaContato register={register} errors={errors} />
        <EmpresaEndereco register={register} errors={errors} />
        <EmpresaNichoInfo register={register} errors={errors} />
        <div className="wp-card p-4">
          <h3 className="wp-subheader mb-4">Logo da Empresa</h3>
          <EmpresaImageUpload 
            onImageUpload={handleImageUpload}
            existingImageUrl={logoUrl}
          />
        </div>
      </div>

      <div className="wp-card">
        <h3 className="wp-subheader mb-4">Localização no Mapa</h3>
        <LocationPicker
          onLocationSelected={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          initialLatitude={latitude}
          initialLongitude={longitude}
        />
      </div>
      
      <div className="wp-notice-warning">
        <p className="font-medium">Atenção</p>
        <p className="text-sm">Após o cadastro, a empresa ficará com status pendente de aprovação até que os dados sejam verificados.</p>
      </div>
      
      <FormActions isSubmitting={isSubmitting} onReset={reset} />
    </form>
  );
};

export default EmpresaForm;
