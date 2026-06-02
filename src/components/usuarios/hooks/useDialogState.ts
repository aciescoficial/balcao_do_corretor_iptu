
import { useState } from 'react';

export interface DialogState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useDialogState = (initialState: boolean = false): DialogState => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle
  };
};
