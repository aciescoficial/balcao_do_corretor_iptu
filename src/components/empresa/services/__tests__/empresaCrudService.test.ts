
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { empresaCrudService } from '../empresaCrudService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      or: vi.fn(),
      range: vi.fn(),
    })),
  },
}));

describe('empresaCrudService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLatestCompanies', () => {
    it('should fetch latest companies with default limit', async () => {
      const mockData = [
        { id: '1', nome_fantasia: 'Company 1', nicho: 'Serviços' },
        { id: '2', nome_fantasia: 'Company 2', nicho: 'Comércio' },
        { id: '3', nome_fantasia: 'Company 3', nicho: 'Tecnologia' },
      ];

      const mockSelect = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockOrder = vi.fn().mockReturnValue({ limit: () => ({ select: mockSelect }) });
      vi.spyOn(supabase, 'from').mockReturnValue({
        order: mockOrder,
      } as any);

      const result = await empresaCrudService.getLatestCompanies();

      expect(result).toHaveLength(3);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  describe('getCompaniesPaginated', () => {
    it('should fetch paginated companies with search term', async () => {
      const mockData = [{ id: '1', nome_fantasia: 'Test Company', nicho: 'Serviços' }];
      const mockCount = 1;

      const mockRange = vi.fn().mockResolvedValue({ 
        data: mockData, 
        error: null, 
        count: mockCount 
      });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnValue({
          or: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: mockRange,
            }),
          }),
        }),
      } as any);

      const result = await empresaCrudService.getCompaniesPaginated(1, 10, {
        searchTerm: 'test',
      });

      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(1);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
    });
  });
});
