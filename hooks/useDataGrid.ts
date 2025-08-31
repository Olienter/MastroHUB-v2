import { useState, useMemo, useCallback } from 'react';

export interface DataGridState<T extends Record<string, unknown>> {
  searchTerm: string;
  currentPage: number;
  selectedRows: T[];
  showFilters: boolean;
  sortKey: keyof T | null;
  sortDirection: 'asc' | 'desc';
  paginatedData: T[];
  totalPages: number;
}

export interface UseDataGridOptions<T extends Record<string, unknown>> {
  data: T[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  search?: boolean;
  itemsPerPage?: number;
}

export function useDataGrid<T extends Record<string, unknown>>({
  data,
  sortable = false,
  pagination = false,
  search = false,
  itemsPerPage = 10,
}: UseDataGridOptions<T>): DataGridState<T> & {
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setSelectedRows: (rows: T[]) => void;
  setShowFilters: (show: boolean) => void;
  handleSort: (key: keyof T) => void;
  handleRowSelect: (row: T) => void;
} {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search || !searchTerm) return data;

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, search, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortable, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sorting
  const handleSort = useCallback((key: keyof T) => {
    if (!sortable) return;

    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortable, sortKey, sortDirection]);

  // Handle row selection
  const handleRowSelect = useCallback((row: T) => {
    setSelectedRows(prev => {
      const isSelected = prev.includes(row);
      if (isSelected) {
        return prev.filter(r => r !== row);
      } else {
        return [...prev, row];
      }
    });
  }, []);

  return {
    searchTerm,
    currentPage,
    selectedRows,
    showFilters,
    sortKey,
    sortDirection,
    paginatedData,
    totalPages,
    setSearchTerm,
    setCurrentPage,
    setSelectedRows,
    setShowFilters,
    handleSort,
    handleRowSelect,
  };
}
