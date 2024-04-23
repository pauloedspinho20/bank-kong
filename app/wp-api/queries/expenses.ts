import { IExpense } from "../../types/expenses";
import { fetchGraphQL, transformGraphQLResponse } from "../api";
/*
 * QUERIES - EXPENSES
 */

/* Get all expenses */
export async function getAllExpensesWithSlug() {
  const data = await fetchGraphQL(`
      fragment AuthorFields on User {
        databaseId
        id
        name
        firstName
        lastName
        avatar {
          url
        }
      }

      fragment ExpenseFields on Expense {
        databaseId
        id
        title
        slug
        content
        date
        expense {
          fieldGroupName
          value
          type
        }
        author {
          node {
            ...AuthorFields
          }
        }
        categories {
          edges {
            node {
              id
              databaseId
              slug
              name
            }
          }
        }
      }

      query ExpenseBySlug {
          expenses(first: 10000) {
            edges {
              node {
                ...ExpenseFields
              }
            }
          }
        }
  `);

  if (data) {
    return transformGraphQLResponse(data.expenses, "expenses") as IExpense[];
  }
  return [];
}

/* Get current expense and the next ones */
export async function getExpenseAndMoreExpenses(
  slug: string,
  preview: boolean,
  previewData: any,
) {
  try {
    const expensePreview = preview && previewData?.post;
    // The slug may be the id of an unpublished post
    const isId = Number.isInteger(Number(slug));
    const isSameExpense = isId
      ? Number(slug) === expensePreview.id
      : slug === expensePreview.slug;
    const isDraft = isSameExpense && expensePreview?.status === "draft";
    const isRevision = isSameExpense && expensePreview?.status === "publish";
    const data = await fetchGraphQL(
      `    
        fragment AuthorFields on User {
          databaseId
          id
          name
          firstName
          lastName
          avatar {
            url
          }
        }

        fragment ExpenseFields on Expense {
          databaseId
          id
          title
          slug
          content
          date
            expense {
            fieldGroupName
            value
            type
          }
          author {
            node {
              ...AuthorFields
            }
          }
          categories {
            edges {
              node {
                id
                databaseId
                slug
                name
              }
            }
          }
        }

        query ExpenseBySlug {
          expense(id: "${slug}", idType: SLUG) {
            ...ExpenseFields
          }
          expenses(first: 100) {
            edges {
              node {
                ...ExpenseFields
              }
            }
          }
        }
      `,
    );

    // Draft posts may not have an slug
    if (isDraft) data.expense.slug = expensePreview.id;
    // Apply a revision (changes in a published post)
    if (isRevision && data.expense.revisions) {
      const revision = data.expense.revisions.edges[0]?.node;

      if (revision) Object.assign(data.expense, revision);
      delete data.expense.revisions;
    }

    // Filter out the main post
    data.expenses.edges = data.expenses.edges.filter(
      ({ node }: any) => node.slug !== slug,
    );
    // If there are still 3 posts, remove the last one
    if (data.expenses.edges.length > 2) data.expenses.edges.pop();

    return data;
  } catch (error) {
    console.log("errrrror", error);
  }
}
