import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Container from "@/components/container";
import Expense from "@/components/expense";
import Header from "@/components/layout/header";
import Layout from "@/components/layout";
import PostTitle from "@/components/post/post-title";
import SectionSeparator from "@/components/section-separator";

import { getCategories } from "@/wp-api/queries/posts";
import { getAllExpensesWithSlug } from "@/wp-api/queries/expenses";

import { useGlobalStore, useExpenseStore } from "@/hooks/useGlobalState";
import { ICategory } from "@/types/posts";
import { IExpense } from "@/types/expenses";

interface Props {
  categories: ICategory[];
  expenses: IExpense[];
  preview: boolean;
}

export default function Expenses({ categories, expenses, preview }: Props) {
  const updateCategories = useGlobalStore((state) => state.updateCategories);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const totalIncome = useExpenseStore((state) => state.totalIncome);
  const updateTotalIncome = useExpenseStore((state) => state.updateTotalIncome);
  const exp = useExpenseStore((state) => state.expenses);

  useEffect(() => {
    updateCategories(categories);
  }, [categories]);

  useEffect(() => {
    updateExpenses(expenses);
    updateTotalIncome();
  }, [expenses]);

  const router = useRouter();

  return (
    <Layout preview={preview}>
      <Drawer>
        <Container>
          <Header />
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <Head>
                  <title>Expenses</title>
                </Head>

                <DrawerTrigger>Create Expense</DrawerTrigger>

                <div className="relative flex flex-col">
                  <h1>Total: {totalIncome}</h1>
                  <h1>Add Expense</h1>
                  <Expense />

                  <h1>All expenses</h1>
                  {exp?.map((expense) => (
                    <Expense key={expense.databaseId} expense={expense} />
                  ))}
                </div>
              </article>

              <SectionSeparator />
            </>
          )}
        </Container>

        <DrawerContent>
          <div className="container mx-auto">
            <DrawerHeader>
              <DrawerTitle>New expense</DrawerTitle>
              <DrawerDescription>
                <Expense />
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
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
