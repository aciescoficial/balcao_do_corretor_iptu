
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  itemsCount: number;
  itemName?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  itemsCount,
  itemName = 'itens',
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, last page, current page, and one page before/after current
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push(-1); // Ellipsis
      }
      
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="mt-4">
      <div className="text-sm text-muted-foreground mb-2">
        Mostrando {itemsCount} de {totalCount} {itemName} • Página {currentPage} de {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
            />
          </PaginationItem>

          {generatePageNumbers().map((page, index) => (
            <PaginationItem key={`page-${index}`}>
              {page === -1 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)} 
              className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
