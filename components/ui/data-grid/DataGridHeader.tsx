import React from "react";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DataGridHeaderProps {
  search?: boolean;
  filterable?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  className?: string;
}

export function DataGridHeader({
  search = false,
  filterable = false,
  searchTerm,
  onSearchChange,
  onToggleFilters,
  showFilters,
  className,
}: DataGridHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200", className)}>
      {/* Search */}
      {search && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Filters Toggle */}
      {filterable && (
        <Button
          variant={showFilters ? "primary" : "outline"}
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      )}
    </div>
  );
}
