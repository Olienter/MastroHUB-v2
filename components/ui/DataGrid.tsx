import React, { forwardRef, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Input } from './Input';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Download } from 'lucide-react';

export interface DataGridProps<T extends Record<string, unknown>> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }[];
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  selectable?: boolean;
  searchable?: boolean;
  downloadable?: boolean;
}

export interface DataGridRef {
  refresh: () => void;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
}

const DataGrid = forwardRef<DataGridRef, DataGridProps<Record<string, unknown>>>(
  ({ 
    data, 
    columns, 
    pageSize = 10, 
    className,
    onRowClick,
    onSelectionChange,
    selectable = false,
    searchable = true,
    downloadable = false
  }, ref) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Record<string, unknown> | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Filter and search data
    const filteredData = useMemo(() => {
      const filtered = data.filter(row => {
        // Search across all columns
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const hasMatch = columns.some(column => {
            const value = row[column.key];
            return value && String(value).toLowerCase().includes(searchLower);
          });
          if (!hasMatch) return false;
        }

        // Apply column filters
        for (const [key, filterValue] of Object.entries(filters)) {
          if (filterValue && row[key as keyof Record<string, unknown>] !== filterValue) {
            return false;
          }
        }

        return true;
      });

      // Sort data
      if (sortColumn) {
        filtered.sort((a, b) => {
          const aVal = a[sortColumn];
          const bVal = b[sortColumn];
          
          if (aVal === bVal) return 0;
          if (aVal === null || aVal === undefined) return 1;
          if (bVal === null || bVal === undefined) return -1;
          
          const comparison = String(aVal).localeCompare(String(bVal));
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }

      return filtered;
    }, [data, searchTerm, filters, sortColumn, sortDirection, columns]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Handle sorting
    const handleSort = (column: keyof Record<string, unknown>) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };

    // Handle row selection
    const handleRowSelect = (row: Record<string, unknown>) => {
      const newSelection = selectedRows.includes(row)
        ? selectedRows.filter(r => r !== row)
        : [...selectedRows, row];
      
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    };

    // Handle select all
    const handleSelectAll = () => {
      const newSelection = selectedRows.length === currentData.length ? [] : currentData;
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    };

      // Handle filter change
  const handleFilterChange = (column: keyof Record<string, unknown>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1);
  };

    // Handle search change
    const handleSearchChange = (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      refresh: () => {
        setCurrentPage(1);
        setSearchTerm('');
        setFilters({});
        setSortColumn(null);
        setSortDirection('asc');
      },
      setPage: (page: number) => handlePageChange(page),
      setSearchTerm: (term: string) => handleSearchChange(term),
    }));

    return (
      <div className={cn('w-full space-y-4', className)}>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            {downloadable && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {columns
              .filter(col => col.filterable)
              .map(column => (
                <div key={String(column.key)} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{column.header}:</span>
                  <Input
                    placeholder={`Filter ${column.header}`}
                    value={filters[String(column.key)] || ''}
                    onChange={(e) => handleFilterChange(column.key, e.target.value)}
                    className="w-32"
                  />
                </div>
              ))}
          </div>
        )}

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {selectable && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === currentData.length && currentData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}
                  {columns.map(column => (
                    <th
                      key={String(column.key)}
                      className={cn(
                        'px-4 py-3 text-left text-sm font-medium text-gray-700',
                        column.sortable && 'cursor-pointer hover:bg-gray-100',
                        column.width
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-gray-400">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'hover:bg-gray-50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={() => handleRowSelect(row)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm text-gray-900"
                      >
                        {String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataGrid.displayName = 'DataGrid';

export { DataGrid };
