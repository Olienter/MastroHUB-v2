import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DataGridColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataGridBodyProps<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  sortable?: boolean;
  selectable?: boolean;
  selectedRows: T[];
  onRowSelect: (row: T) => void;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
  className?: string;
}

export function DataGridBody<T>({
  data,
  columns,
  sortable = false,
  selectable = false,
  selectedRows,
  onRowSelect,
  onSort,
  sortKey,
  sortDirection,
  className,
}: DataGridBodyProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!sortable || !onSort) return;
    const direction = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, direction);
  };

  const isRowSelected = (row: T) => {
    return selectedRows.some((selectedRow) => selectedRow === row);
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={() => {
                    if (selectedRows.length === data.length) {
                      // Deselect all
                      selectedRows.forEach((row) => onRowSelect(row));
                    } else {
                      // Select all
                      data.forEach((row) => onRowSelect(row));
                    }
                  }}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.width && `w-${column.width}`,
                  column.sortable && "cursor-pointer hover:bg-gray-100"
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-gray-400">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-gray-50 transition-colors duration-150",
                isRowSelected(row) && "bg-red-50"
              )}
            >
              {selectable && (
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={isRowSelected(row)}
                    onChange={() => onRowSelect(row)}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-4 whitespace-nowrap">
                  {column.render ? (
                    column.render(row[column.key], row)
                  ) : (
                    <span className="text-sm text-gray-900">
                      {String(row[column.key])}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
