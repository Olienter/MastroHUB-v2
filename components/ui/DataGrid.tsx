import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DataGridColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  search?: boolean;
  className?: string;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<keyof T, string>) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
}

const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps<any>>(
  (
    {
      data,
      columns,
      sortable = false,
      filterable = false,
      selectable = false,
      pagination = false,
      search = false,
      className,
      onSort,
      onFilter,
      onSelectionChange,
      sortKey,
      sortDirection,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = React.useState(false);
    const itemsPerPage = 10;

    // Filter data based on search and filters
    const filteredData = React.useMemo(() => {
      let filtered = data;

      // Apply search
      if (searchTerm) {
        filtered = filtered.filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Apply column filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter((row) =>
            String(row[key]).toLowerCase().includes(value.toLowerCase())
          );
        }
      });

      return filtered;
    }, [data, searchTerm, filters]);

    // Paginate data
    const paginatedData = React.useMemo(() => {
      if (!pagination) return filteredData;

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredData.slice(startIndex, endIndex);
    }, [filteredData, pagination, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSort = (key: keyof any) => {
      if (!sortable || !onSort) return;

      const direction =
        sortKey === key && sortDirection === "asc" ? "desc" : "asc";
      onSort(key, direction);
    };

    const handleFilter = (key: string, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFilter?.(newFilters);
      setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows(paginatedData);
        onSelectionChange?.(paginatedData);
      } else {
        setSelectedRows([]);
        onSelectionChange?.([]);
      }
    };

    const handleSelectRow = (row: any, checked: boolean) => {
      let newSelection;
      if (checked) {
        newSelection = [...selectedRows, row];
      } else {
        newSelection = selectedRows.filter((r) => r !== row);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    };

    const getSortIcon = (key: keyof any) => {
      if (!sortable) return null;

      if (sortKey === key) {
        return sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        );
      }

      return <ChevronDown className="h-4 w-4 text-fg-muted" />;
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {search && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-radius-2 border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
              />
            )}

            {filterable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            )}
          </div>

          {selectable && selectedRows.length > 0 && (
            <div className="text-sm text-fg-muted">
              {selectedRows.length} row(s) selected
            </div>
          )}
        </div>

        {/* Filters */}
        {filterable && showFilters && (
          <div className="p-4 bg-surface border border-border rounded-radius-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {columns
                .filter((col) => col.filterable)
                .map((column) => (
                  <div key={String(column.key)} className="space-y-2">
                    <label className="text-sm font-medium text-fg">
                      {column.header}
                    </label>
                    <input
                      type="text"
                      placeholder={`Filter ${column.header}...`}
                      value={filters[String(column.key)] || ""}
                      onChange={(e) =>
                        handleFilter(String(column.key), e.target.value)
                      }
                      className="flex h-8 w-full rounded-radius-1 border border-border bg-transparent px-2 py-1 text-sm transition-colors placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="rounded-radius-2 border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b border-border bg-surface">
                <tr>
                  {selectable && (
                    <th className="h-12 px-4 text-left align-middle">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border"
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={cn(
                        "h-12 px-4 text-left align-middle font-medium text-fg-muted",
                        column.sortable &&
                          sortable &&
                          "cursor-pointer hover:bg-surface/50",
                        column.width
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.header}</span>
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                  <th className="h-12 px-4 text-left align-middle w-12">
                    <MoreHorizontal className="h-4 w-4 text-fg-muted" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-border bg-transparent hover:bg-surface/50 transition-colors",
                      selectedRows.includes(row) && "bg-brand/10"
                    )}
                  >
                    {selectable && (
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={(e) =>
                            handleSelectRow(row, e.target.checked)
                          }
                          className="rounded border-border"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-4 align-middle">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "")}
                      </td>
                    ))}
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-fg-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-radius-1 border border-border bg-transparent text-sm font-medium transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-50"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-radius-1 border text-sm font-medium transition-colors",
                      page === currentPage
                        ? "border-brand bg-brand text-brand-fg"
                        : "border-border bg-transparent hover:bg-surface"
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-radius-1 border border-border bg-transparent text-sm font-medium transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataGrid.displayName = "DataGrid";

export { DataGrid };
export type { DataGridProps, DataGridColumn };
