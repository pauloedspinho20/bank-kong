import cn from "classnames";

import { Pencil2Icon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useGlobalStore } from "../hooks/useGlobalState";
import { useExpenseStore } from "../hooks/useGlobalState";

import { formatToEuro, separateDateAndTime } from "@/utils/format";

export default function ExpensesTable() {
  const categories = useGlobalStore((state) => state.categories);
  const expenses = useExpenseStore((state) => state.expenses);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);

  console.log("EXPENSES", expenses);
  return (
    <TooltipProvider>
      {expenses?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, key) => (
              <TableRow
                key={`expense-${expense.id}`}
                className={cn({
                  "bg-accent": key % 2 === 0,
                })}
              >
                <TableCell>
                  <div className="font-medium">{expense.title}</div>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    {expense.categories[0].name}
                  </Badge>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <div className="text-xs font-medium lg:text-sm">
                    {separateDateAndTime(expense.date).date}
                  </div>
                  <div className="hidden text-xs text-muted-foreground md:inline">
                    {separateDateAndTime(expense.date).time}
                  </div>
                </TableCell>

                <TableCell
                  className={cn("hidden capitalize sm:table-cell", {
                    "text-green-500": expense.expense.type === "income",
                    "text-red-400": expense.expense.type === "outcome",
                  })}
                >
                  {expense.expense.type}
                </TableCell>

                <TableCell className="text-right">
                  {formatToEuro(expense.expense.value)}
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "xs" }),
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Pencil2Icon />
                    </TooltipTrigger>
                    <TooltipContent>Create category</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex w-full">No Expenses</div>
      )}
    </TooltipProvider>
  );
}
