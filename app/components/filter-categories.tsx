"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGlobalStore, useExpenseStore } from "@/hooks/useGlobalState";

interface Props {
  filterCategory: number | null;
  onFilterCategoryChange: (category: number | null) => void;
}

export default function FilterCategories({
  filterCategory,
  onFilterCategoryChange,
}: Props) {
  const categories = useGlobalStore((state) => state.categories);
  const expenses = useExpenseStore((state) => state.expenses);

  const handleCategoryChange = (categoryId: number | null) => {
    onFilterCategoryChange(categoryId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Categories
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-[300px] w-56 overflow-y-scroll">
        <DropdownMenuCheckboxItem
          checked={filterCategory === null}
          onCheckedChange={() => handleCategoryChange(null)}
        >
          All
        </DropdownMenuCheckboxItem>
        {categories?.map((cat) => {
          const categoryHasExpenses = expenses.some(
            (e) => e.categories?.[0].databaseId === cat.databaseId,
          );

          if (categoryHasExpenses) {
            return (
              <DropdownMenuCheckboxItem
                key={cat.databaseId}
                checked={filterCategory === cat.databaseId}
                onCheckedChange={(checked) =>
                  handleCategoryChange(checked ? cat.databaseId || 0 : null)
                }
              >
                {cat.name}
              </DropdownMenuCheckboxItem>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
