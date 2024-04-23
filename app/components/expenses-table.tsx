import { useEffect, useState } from "react";
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
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    setBalance(formatToEuro(totalIncome - totalOutcome));
  }, [totalIncome, totalOutcome]);
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
    <>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Type</TableHead>
            <TableHead className="table-cell">Amount</TableHead>
            <TableHead className="table-cell text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense, key) => (
            <TableRow
              key={`expense-${expense.id}`}
              className={cn("h-[82px]", {
                "bg-accent": key % 2 === 0,
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
                className={cn("hidden capitalize lg:table-cell", {
                  "text-green-500": expense.expense.type === "income",
                  "text-red-400": expense.expense.type === "outcome",
                })}
              >
                <div>{expense.expense.type}</div>
              </TableCell>

              {/* AMOUNT */}
              <TableCell
                className={cn("table-cell", {
                  "text-green-500 lg:text-inherit":
                    expense.expense.type === "income",
                  "text-red-400 lg:text-inherit":
                    expense.expense.type === "outcome",
                })}
              >
                <div className="inline-flex text-nowrap">
                  {`${expense.expense.type === "income" ? "+" : "-"} ${formatToEuro(expense.expense.value)}`}
                </div>
              </TableCell>

              <TableCell className="table-cell text-right">
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
        </TableBody>
      </Table>
      {totalIncome - totalOutcome !== 0 && (
        <div className="flex h-20 w-full items-center justify-center border-t text-center align-middle">
          <div className="mb-0 inline-flex text-xl font-bold">
            Balance:{" "}
            <div
              className={cn("ml-3", {
                "text-red-400": balance.startsWith("-"),
                "text-green-500": !balance.startsWith("-"),
              })}
            >
              {balance}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex w-full p-10">No Expenses</div>
  );
}
