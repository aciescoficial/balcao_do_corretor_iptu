
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { empresaStatusService } from '../empresaStatusService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
    })),
  },
}));

describe('empresaStatusService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateEmpresaStatus', () => {
    it('should update company status successfully', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ error: null });
      const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      const result = await empresaStatusService.updateEmpresaStatus('123', 'ativo');

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockEq).toHaveBeenCalledWith('id', '123');
      expect(mockUpdate).toHaveBeenCalledWith({ status: 'ativo' });
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Update failed');
      const mockUpdate = vi.fn().mockResolvedValue({ error: mockError });
      const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      const result = await empresaStatusService.updateEmpresaStatus('123', 'ativo');
      expect(result).toBe(false);
    });
  });

  describe('fetchPendingEmpresas', () => {
    it('should fetch pending companies', async () => {
      const mockData = [
        { id: '1', nome_fantasia: 'Pending Company 1', nicho: 'Serviços' },
        { id: '2', nome_fantasia: 'Pending Company 2', nicho: 'Comércio' },
      ];

      const mockSelect = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockOrder = vi.fn().mockReturnValue({ select: mockSelect });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      const result = await empresaStatusService.fetchPendingEmpresas();

      expect(result).toHaveLength(2);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockEq).toHaveBeenCalledWith('status', 'pendente');
    });

    it('should handle fetch errors', async () => {
      const mockError = new Error('Fetch failed');
      const mockSelect = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockOrder = vi.fn().mockReturnValue({ select: mockSelect });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      await expect(empresaStatusService.fetchPendingEmpresas()).rejects.toThrow();
    });
  });
});
