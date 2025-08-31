import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  className?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export interface TableRef {
  refresh: () => void;
  setSortColumn: (column: keyof Record<string, unknown> | null) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const Table = forwardRef<TableRef, TableProps<Record<string, unknown>>>(
  ({ 
    data, 
    columns, 
    className,
    onRowClick,
    selectable = false,
    onSelectionChange
  }, ref) => {
    const [sortColumn, setSortColumn] = useState<keyof Record<string, unknown> | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);

    // Sort data
    const sortedData = React.useMemo(() => {
      if (!sortColumn) return data;

      return [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }, [data, sortColumn, sortDirection]);

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
      const newSelection = selectedRows.length === sortedData.length ? [] : sortedData;
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    };

    // Get sort icon
    const getSortIcon = (column: keyof Record<string, unknown>) => {
      if (sortColumn !== column) return null;
      return sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    };

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      refresh: () => {
        setSortColumn(null);
        setSortDirection('asc');
        setSelectedRows([]);
      },
      setSortColumn: (column: keyof Record<string, unknown> | null) => setSortColumn(column),
      setSortDirection: (direction: 'asc' | 'desc') => setSortDirection(direction),
    }));

    return (
      <div className={cn('w-full', className)}>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {selectable && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === sortedData.length && sortedData.length > 0}
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
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((row, rowIndex) => (
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
                        {column.render 
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

Table.displayName = 'Table';

export { Table };
