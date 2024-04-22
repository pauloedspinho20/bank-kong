import { fetchREST } from "../api";
import { dateStringToDate } from "@/utils/format";

import { IExpense } from "@/types/expenses";
import { IExpensePOST } from "@/types/expenses";
import { ICategory } from "@/types/posts";

/*
 *  MUTATIONS - EXPENSES
 */

/* Create Expense with GraphQL  */
export async function mutateExpense({
  databaseId,
  title,
  content,
  categories,
  date,
  value,
  type,
  requestType,
}: IExpensePOST) {
  let postData: any;
  let endpoint: string = "";
  let method: "GET" | "POST" | "DELETE" = "GET";

  if (requestType === "create") {
    postData = {
      title: title,
      content: content,
      categories: categories?.map((category) => {
        return category.databaseId;
      }, []),
      date: date,
      status: "publish",
      post_type: "expense",
      acf: {
        value: value,
        type: type,
      },
    };
    endpoint = "expense";
    method = "POST";
  }
  if (requestType === "update") {
    postData = {
      databaseId: databaseId,
      title: title,
      content: content,
      categories: categories?.map((category) => {
        return category.databaseId;
      }, []),
      date: date,
      status: "publish",
      post_type: "expense",
      acf: {
        value: value,
        type: type,
      },
    };
    endpoint = `expense/${databaseId}`;
    method = "POST";
  }
  if (requestType === "delete") {
    postData = {
      databaseId: databaseId,
    };
    endpoint = `expense/${databaseId}`;
    method = "DELETE";
  }

  const data = await fetchREST({
    endpoint,
    method,
    postData,
  });

  console.log("fetchREST 222  ", data);
  // Create and return IExpense from API data

  const cats = data?.categories?.map((cat: ICategory) => {
    return categories?.find((c) => c.databaseId === cat); // Get complete category object from global state
  });

  if (data?.id) {
    const expense = {
      databaseId: data.id,
      author: data.author,
      content: data.content.raw,
      categories: cats,
      date: data.date,
      formatedDate: dateStringToDate(data.date),
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
