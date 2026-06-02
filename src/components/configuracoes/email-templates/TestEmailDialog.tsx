
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { EmailTemplate } from './types';

interface TestEmailDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  testEmailTo: string;
  setTestEmailTo: (email: string) => void;
  currentTemplateForTest: string | null;
  isSendingTest: boolean;
  handleSendTestEmail: () => Promise<void>;
  templates: EmailTemplate[];
}

const TestEmailDialog: React.FC<TestEmailDialogProps> = ({
  isOpen,
  setIsOpen,
  testEmailTo,
  setTestEmailTo,
  currentTemplateForTest,
  isSendingTest,
  handleSendTestEmail,
  templates
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Email de Teste</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="test-email" className="col-span-4">
              Email para envio do teste:
            </Label>
            <Input
              id="test-email"
              type="email"
              value={testEmailTo}
              onChange={(e) => setTestEmailTo(e.target.value)}
              className="col-span-4"
              placeholder="exemplo@email.com"
            />
          </div>
          {currentTemplateForTest && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Template: </span>
                {templates.find(t => t.codigo === currentTemplateForTest)?.nome || currentTemplateForTest}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Será enviado um email de teste usando este template com dados fictícios.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendTestEmail} disabled={isSendingTest}>
            {isSendingTest ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Teste'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestEmailDialog;
