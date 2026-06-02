
import { useEffect, useState } from 'react';
import { SugestaoEmpresa } from './types';
import { mockSugestoes } from './mockData';

export const useSugestoes = (itemsPerPage: number = 5) => {
  const [sugestoes, setSugestoes] = useState<SugestaoEmpresa[]>([]);
  const [filteredSugestoes, setFilteredSugestoes] = useState<SugestaoEmpresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // In a real scenario, fetch data from an API
    setSugestoes(mockSugestoes);
    setFilteredSugestoes(mockSugestoes);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sugestoes.filter(
        (sugestao) =>
          sugestao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.contato.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSugestoes(filtered);
      setCurrentPage(1);
    } else {
      setFilteredSugestoes(sugestoes);
    }
  }, [searchTerm, sugestoes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSugestoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSugestoes.length / itemsPerPage);

  return {
    searchTerm,
    selectedDate,
    currentPage,
    currentItems,
    filteredSugestoes,
    totalPages,
    handleSearch,
    setSelectedDate,
    setCurrentPage
  };
};
