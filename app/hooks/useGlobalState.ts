import { create } from "zustand";
import { ICategory } from "../types/posts";
import { IExpense } from "../types/expenses";

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
  totalValue: number;
};

type ExpenseAction = {
  updateExpenses: (expenses: ExpenseState["expenses"]) => void;
  updateTotalValue: () => void;
};

export const useExpenseStore = create<ExpenseState & ExpenseAction>()(
  (set) => ({
    expenses: [],
    totalValue: 0,
    updateExpenses: (expenses) =>
      set(() => ({
        expenses: expenses,
      })),
    updateTotalValue: () =>
      set((state) => ({
        totalValue: state.expenses?.reduce(
          (total, expense) => total + expense.expense.value,
          0,
        ),
      })),
  }),
);
