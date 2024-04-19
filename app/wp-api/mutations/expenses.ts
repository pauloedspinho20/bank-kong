import { IExpense } from "@/types/expenses";
import { ICreateExpense } from "@/types/expenses";
import { fetchREST } from "../api";

/*
 *  MUTATIONS - EXPENSES
 */

export async function createExpenseREST({
  title,
  content,
  categories,
  value,
  type,
}: ICreateExpense) {
  const postData = {
    title: title,
    content: content,
    categories: categories.map((category) => {
      return category.databaseId;
    }, []),
    status: "publish",
    post_type: "expense",
    acf: {
      value: value,
      type: type,
    },
  };

  const data = await fetchREST({
    endpoint: "expense",
    method: "POST",
    postData,
  });

  // Create and return IExpense from API data

  const cats = data?.categories?.map((cat) => {
    return categories?.find((c) => c.databaseId === cat); // Get complete category object from global state
  });

  if (data?.id) {
    const expense = {
      databaseId: data.id,
      author: data.author,
      content: data.content.raw,
      date: data.date,
      categories: cats,
      expense: {
        fieldGroupName: "expense",
        value: data.acf.value,
        type: data.acf.type,
      },
      title: data.title.raw,
      slug: data.slug,
    };
    return expense as IExpense;
  }
  return data;
}
