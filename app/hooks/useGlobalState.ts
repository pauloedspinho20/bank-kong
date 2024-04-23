import { create } from "zustand";
import { ICategory } from "../types/posts";
import { IExpense } from "../types/expenses";
import { getAllExpensesWithSlug } from "@/wp-api/queries/expenses";

/* GLOBAL */

type GlobalState = {
  categories: ICategory[];
};

type GlobalAction = {
  updateCategories: (categories: GlobalState["categories"]) => void;
  toggleCategorySelection: (id: string) => void;
  deselectCategories: () => void;
};

export const useGlobalStore = create<GlobalState & GlobalAction>()((set) => ({
  categories: [],
  updateCategories: (categories) => set(() => ({ categories: categories })),
  toggleCategorySelection: (id) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id
          ? { ...category, selected: !category.selected }
          : category,
      ),
    })),
  deselectCategories: () =>
    set((state) => ({
      categories: state.categories.map((category) => ({
        ...category,
        selected: false,
      })),
    })),
}));

/* EXPENSES */

type ExpenseState = {
  expenses: IExpense[];
  totalIncome: number;
  totalOutcome: number;
};

type ExpenseAction = {
  getExpenses: () => Promise<void>;
  updateExpenses: (expenses: ExpenseState["expenses"]) => void;
  updateTotalIncome: () => void;
  updateTotalOutcome: () => void;
};

export const useExpenseStore = create<ExpenseState & ExpenseAction>()(
  (set) => ({
    expenses: [],
    totalIncome: 0,
    totalOutcome: 0,
    getExpenses: async () => {
      try {
        const e = await getAllExpensesWithSlug();
        set(() => ({
          expenses: e,
        }));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    updateExpenses: (expenses) =>
      set(() => ({
        expenses: expenses,
      })),
    updateTotalIncome: () =>
      set((state) => ({
        totalIncome:
          state.expenses
            ?.filter((e) => e.expense.type === "income")
            ?.reduce((total, expense) => total + expense.expense.value, 0) | 0,
      })),
    updateTotalOutcome: () =>
      set((state) => ({
        totalOutcome:
          state.expenses
            ?.filter((e) => e.expense.type === "outcome")
            ?.reduce((total, expense) => total + expense.expense.value, 0) | 0,
      })),
  }),
);
