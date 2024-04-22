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
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AsideMenu from "@/components/layout/aside-munu";
import Layout from "@/components/layout";
import Header from "@/components/layout/header";
import Expense from "@/components/expense";
import ExpensesTable from "@/components/expenses-table";

import { getCategories } from "@/wp-api/queries/posts";
import { getAllExpensesWithSlug } from "@/wp-api/queries/expenses";

import { useGlobalStore, useExpenseStore } from "@/hooks/useGlobalState";
import { ICategory } from "@/types/posts";
import { IExpense } from "@/types/expenses";

import { formatToEuro } from "@/utils/format";
import Link from "next/link";

interface Props {
  defaultCategories: ICategory[];
  defaultExpenses: IExpense[];
}

export default function Dashboard({
  defaultCategories,
  defaultExpenses,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<"income" | "outcome">(
    "income",
  );

  const { data: session, status } = useSession();
  const expenses = useExpenseStore((state) => state.expenses);
  const updateCategories = useGlobalStore((state) => state.updateCategories);
  const totalIncome = useExpenseStore((state) => state.totalIncome);
  const totalOutcome = useExpenseStore((state) => state.totalOutcome);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const updateTotalIncome = useExpenseStore((state) => state.updateTotalIncome);
  const updateTotalOutcome = useExpenseStore(
    (state) => state.updateTotalOutcome,
  );

  useEffect(() => {
    updateCategories(defaultCategories);
  }, [defaultCategories]);

  useEffect(() => {
    updateExpenses(defaultExpenses);
    updateTotalIncome();
    updateTotalOutcome();
  }, [defaultExpenses]);

  useEffect(() => {
    updateTotalIncome();
    updateTotalOutcome();
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
                <div className="grid gap-4 ">
                  <Card
                    className="sm:col-span-2"
                    x-chunk="dashboard-05-chunk-0"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div>
                        <CardHeader className="mb-2">
                          <CardTitle>
                            Welcome{" "}
                            {status === "authenticated" && session.user.name}
                          </CardTitle>
                          <CardDescription className="max-w-lg text-balance leading-relaxed">
                            If you're not logged in, the expenses will not be
                            saved to the Wordpress database. Please{" "}
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
                                  variant: "green",
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
                                  variant: "red",
                                  size: "md",
                                }),
                              )}
                            >
                              <MinusCircledIcon
                                height={18}
                                width={18}
                                className="mr-3 "
                              />
                              Outcome
                            </DialogTrigger>
                          </div>
                        </CardFooter>
                      </div>
                      <div>
                        <CardHeader className="pb-2">
                          <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                            <div>
                              <CardDescription className="text-green-500">
                                Income
                              </CardDescription>
                              <CardTitle className="text-lg xl:text-3xl">
                                {formatToEuro(totalIncome)}
                              </CardTitle>
                            </div>
                            <div>
                              <CardDescription className="text-red-400">
                                Outcome
                              </CardDescription>
                              <CardTitle className="text-lg xl:text-2xl">
                                {formatToEuro(totalOutcome)}
                              </CardTitle>
                            </div>

                            <div>
                              <CardDescription className="font-bold text-white">
                                Total Balance
                              </CardDescription>
                              <CardTitle className="text-nowrap text-xl xl:text-3xl">
                                {formatToEuro(totalIncome - totalOutcome)}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                      </div>
                    </div>
                  </Card>
                </div>
                <Tabs defaultValue="week">
                  <div className="flex items-center"></div>
                  <TabsContent value="week" className="mb-20">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Expenses</CardTitle>
                        <CardDescription>Recent expenses</CardDescription>
                      </CardHeader>
                      <ExpensesTable />
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
  const defaultCategories = await getCategories();
  const defaultExpenses = await getAllExpensesWithSlug();

  return {
    props: {
      defaultCategories,
      defaultExpenses,
    },
    revalidate: 10,
  };
};
