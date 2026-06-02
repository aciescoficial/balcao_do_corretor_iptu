
import { CardSettings } from '../types';

/**
 * Gets the appropriate background style based on card settings and view
 */
export const getBackgroundStyle = (cardSettings: CardSettings, view: 'front' | 'back'): React.CSSProperties => {
  if (view === 'front') {
    if (cardSettings.frontBackgroundImage) {
      return {
        backgroundImage: `url(${cardSettings.frontBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(90deg, ${cardSettings.secondaryColor}, ${cardSettings.secondaryColor})`,
    };
  } else {
    if (cardSettings.backBackgroundImage) {
      return {
        backgroundImage: `url(${cardSettings.backBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    if (cardSettings.defaultBackImage) {
      return {
        backgroundImage: `url(${cardSettings.defaultBackImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(90deg, ${cardSettings.secondaryColor}, ${cardSettings.secondaryColor})`,
    };
  }
};
