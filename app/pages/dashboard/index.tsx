import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";

import { File, ListFilter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";
import Header from "@/components/layout/header";
import Expense from "@/components/expense";

import { getCategories } from "@/wp-api/queries/posts";
import { getAllExpensesWithSlug } from "@/wp-api/queries/expenses";

import { useGlobalStore, useExpenseStore } from "@/hooks/useGlobalState";
import { ICategory } from "@/types/posts";
import { IExpense } from "@/types/expenses";
import ExpensesTable from "@/components/expenses-table";
import Link from "next/link";

interface Props {
  categories: ICategory[];
  expenses: IExpense[];
}

export default function Dashboard({ categories, expenses }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<"income" | "outcome">(
    "income",
  );

  const { data: session, status } = useSession();
  const updateCategories = useGlobalStore((state) => state.updateCategories);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const updateTotalValue = useExpenseStore((state) => state.updateTotalValue);

  useEffect(() => {
    updateCategories(categories);
  }, [categories]);

  useEffect(() => {
    updateExpenses(expenses);
    updateTotalValue();
  }, [expenses]);

  return (
    <Layout preview={false}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AsideMenu />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <Card
                    className="sm:col-span-2"
                    x-chunk="dashboard-05-chunk-0"
                  >
                    <CardHeader className="mb-2">
                      <CardTitle>
                        Welcome{" "}
                        {status === "authenticated" && session.user.name}
                      </CardTitle>
                      <CardDescription className="max-w-lg text-balance leading-relaxed">
                        If you're not logged in, the expenses will not be saved
                        to the Wordpress database. Please{" "}
                        <Link className="underline" href="/auth/login">
                          login.
                        </Link>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex gap-4">
                        <DialogTrigger
                          onClick={() => setExpenseType("income")}
                          className={cn(
                            buttonVariants({
                              variant: "default",
                            }),
                          )}
                        >
                          <PlusCircledIcon
                            height={18}
                            width={18}
                            className="mr-3 "
                          />
                          Income
                        </DialogTrigger>

                        <DialogTrigger
                          onClick={() => setExpenseType("outcome")}
                          className={cn(
                            buttonVariants({
                              variant: "default",
                              size: "md",
                            }),
                          )}
                        >
                          <MinusCircledIcon
                            height={18}
                            width={18}
                            className="mr-3 "
                          />
                          Expense
                        </DialogTrigger>
                      </div>
                    </CardFooter>
                  </Card>
                  <Card x-chunk="dashboard-05-chunk-1">
                    <CardHeader className="pb-2">
                      <CardDescription>This Week</CardDescription>
                      <CardTitle className="text-4xl">$1,329</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        +25% from last week
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress value={25} aria-label="25% increase" />
                    </CardFooter>
                  </Card>
                  <Card x-chunk="dashboard-05-chunk-2">
                    <CardHeader className="pb-2">
                      <CardDescription>This Month</CardDescription>
                      <CardTitle className="text-4xl">$5,329</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        +10% from last month
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress value={12} aria-label="12% increase" />
                    </CardFooter>
                  </Card>
                </div>
                <Tabs defaultValue="week">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-sm"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">
                              Filter
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>
                            Fulfilled
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Declined
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Refunded
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                      >
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Export</span>
                      </Button>
                    </div>
                  </div>
                  <TabsContent value="week">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>
                          Recent orders from your store.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ExpensesTable />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
            {status === "unauthenticated" && (
              <small>
                {" "}
                If you're not logged in, the expenses will not be saved to the
                Wordpress database. Please{" "}
                <Link className="underline" href="/auth/login">
                  login.
                </Link>
              </small>
            )}
          </DialogHeader>
          <Expense
            defaultType={expenseType}
            isDialogOpen={(value) => setIsDialogOpen(value)}
            className="mt-4"
          ></Expense>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories();
  const expenses = await getAllExpensesWithSlug();

  return {
    props: {
      categories,
      expenses,
    },
    revalidate: 10,
  };
};
