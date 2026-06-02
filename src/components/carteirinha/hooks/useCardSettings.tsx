
import { useState } from 'react';
import { CardSettings, ACIESC_COLORS } from '../types';

export const useCardSettings = () => {
  // Card customization settings with ACIESC colors as default values
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    primaryColor: ACIESC_COLORS.primaryGreen,
    secondaryColor: ACIESC_COLORS.darkGreen,
    textColor: ACIESC_COLORS.white,
    fontFamily: 'Arial, sans-serif',
    showCPF: true,
    showCreci: true,
    showQrCode: true,
    logoPosition: 'top',
    photoPosition: { x: 50, y: 50 },
    textPosition: { x: 70, y: 50 },
    backgroundImage: null,
    frontBackgroundImage: undefined,
    backBackgroundImage: undefined,
    defaultBackImage: '/lovable-uploads/3da9ac21-93f9-4795-bef1-3943d4484a78.png',
    backgroundOpacity: 1,
    cardLayout: 'horizontal',
    roundedCorners: true,
    textSize: 'medium',
    showLogo: true
  });

  const updateCardSetting = <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => {
    setCardSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    cardSettings,
    updateCardSetting
  };
};
