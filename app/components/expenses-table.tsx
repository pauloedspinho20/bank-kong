import { useState } from "react";
import cn from "classnames";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useExpenseStore } from "../hooks/useGlobalState";
import { mutateExpense } from "@/wp-api/mutations/expenses";

import { formatToEuro, getFormatedDate, getFormatedTime } from "@/utils/format";
import Expense from "./expense";
import { ICategory } from "@/types/posts";

export default function ExpensesTable() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  /* Expenses state */
  const expenses = useExpenseStore((state) => state.expenses);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const totalIncome = useExpenseStore((state) => state.totalIncome);
  const totalOutcome = useExpenseStore((state) => state.totalOutcome);
  const updateTotalIncome = useExpenseStore((state) => state.updateTotalIncome);
  const updateTotalOutcome = useExpenseStore(
    (state) => state.updateTotalOutcome,
  );
  const [editMode, setEditMode] = useState<string | null>(null);

  /* Delete Expense */
  const handleDeleteExpense = async (e: any, databaseId: number) => {
    e.preventDefault();

    try {
      const data = await mutateExpense({
        databaseId,
        requestType: "delete",
      });

      const updatedExpenses = expenses.filter((d) => d.id !== data.id);
      if (data) {
        updateExpenses(updatedExpenses);
        updateTotalIncome();
        updateTotalOutcome();
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return expenses?.length > 0 ? (
    <Table className="table-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead className="hidden sm:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="">Amount</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense, key) => (
          <TableRow
            key={`expense-${expense.id}`}
            className={cn("h-[82px]", {
              "bg-accent": key % 2 === 0,
              "bg-primary/10 hover:bg-primary/20": editMode === expense.id,
            })}
          >
            {/* DESCRIPTION */}
            <TableCell>
              <div>{expense.title}</div>
            </TableCell>

            {/* CATEGORY */}
            <TableCell className="hidden sm:table-cell">
              <Badge
                className="text-xs"
                variant={key % 2 === 0 ? "outline" : "secondary"}
              >
                {expense.categories && expense.categories[0]?.name}
              </Badge>
            </TableCell>

            {/* DATE */}
            <TableCell className="hidden md:table-cell">
              <div className="text-xs font-medium lg:text-sm">
                {getFormatedDate(new Date(expense.formatedDate || ""))}
              </div>
              <div className="hidden text-xs text-muted-foreground md:inline">
                {getFormatedTime(new Date(expense.formatedDate || ""))}
              </div>
            </TableCell>

            {/* TYPE */}
            <TableCell
              className={cn("hidden capitalize sm:table-cell", {
                "text-green-500":
                  expense.expense.type === "income" && editMode !== expense.id,
                "text-red-400":
                  expense.expense.type === "outcome" && editMode !== expense.id,
              })}
            >
              <div>{expense.expense.type}</div>
            </TableCell>

            {/* AMOUNT */}
            <TableCell className="">
              <div>{formatToEuro(expense.expense.value)}</div>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex flex-row justify-end gap-1">
                {/* EDIT */}
                <AlertDialog
                  open={isDialogOpen && editMode === expense.id}
                  onOpenChange={setIsDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setEditMode(expense.id || "")}
                    >
                      <Pencil2Icon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl text-primary">
                        Edit expense "{expense.title}"
                      </AlertDialogTitle>
                      <Expense
                        isDialogOpen={(value) => setIsDialogOpen(value)}
                        expense={expense}
                      ></Expense>
                    </AlertDialogHeader>
                  </AlertDialogContent>
                </AlertDialog>

                {/* DELETE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="xs">
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          handleDeleteExpense(e, expense.databaseId || 0);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {totalIncome - totalOutcome !== 0 && (
          <TableRow className="h-[100px]">
            <TableCell className=""></TableCell>
            <TableCell className=""></TableCell>
            <TableCell className="text-base font-bold"></TableCell>
            <TableCell className="">Total</TableCell>
            <TableCell className="text-base font-bold">
              {formatToEuro(totalIncome - totalOutcome)}
            </TableCell>
            <TableCell className=""></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ) : (
    <div className="flex w-full p-10">No Expenses</div>
  );
}
