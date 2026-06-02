
import { useState, useEffect } from 'react';

export const useRetryLogic = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [retryTimerId, setRetryTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (retryCountdown > 0) {
      const timerId = setTimeout(() => {
        setRetryCountdown(prev => prev - 1);
      }, 1000);
      setRetryTimerId(timerId);
      return () => clearTimeout(timerId);
    } else if (retryTimerId) {
      clearTimeout(retryTimerId);
      setRetryTimerId(null);
    }
  }, [retryCountdown]);

  useEffect(() => {
    return () => {
      if (retryTimerId) {
        clearTimeout(retryTimerId);
      }
    };
  }, []);

  return {
    isRateLimited,
    setIsRateLimited,
    retryCount,
    setRetryCount,
    retryCountdown,
    setRetryCountdown
  };
};
