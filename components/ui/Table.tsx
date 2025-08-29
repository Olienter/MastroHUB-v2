import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortable?: boolean;
  pagination?: boolean;
  search?: boolean;
  className?: string;
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
}

const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      data,
      columns,
      sortable = false,
      pagination = false,
      search = false,
      className,
      onSort,
      sortKey,
      sortDirection,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Filter data based on search
    const filteredData = React.useMemo(() => {
      if (!searchTerm) return data;

      return data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [data, searchTerm]);

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

    const getSortIcon = (key: keyof any) => {
      if (!sortable) return null;

      if (sortKey === key) {
        return sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        );
      }

      return <ChevronsUpDown className="h-4 w-4 text-fg-muted" />;
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Search */}
        {search && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-radius-2 border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
            />
          </div>
        )}

        {/* Table */}
        <div className="rounded-radius-2 border border-border">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b border-border bg-surface">
                <tr>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-border bg-transparent hover:bg-surface/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-4 align-middle">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "")}
                      </td>
                    ))}
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

Table.displayName = "Table";

export { Table };
export type { TableProps, Column };
