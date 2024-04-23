import { ChangeEvent, useEffect, useState } from "react";
import cn from "classnames";
import CurrencyInput from "react-currency-input-field";
import { PlusIcon } from "@radix-ui/react-icons";

import { Button, buttonVariants } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input, InputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Combobox, ComboboxOptionProps } from "./combobox";
import DatePicker from "./date-picker";

import { createCategory } from "../wp-api/mutations/posts";
import { mutateExpense } from "../wp-api/mutations/expenses";

import { useGlobalStore } from "../hooks/useGlobalState";
import { useExpenseStore } from "../hooks/useGlobalState";
import { categoriesToSelectOptions } from "@/utils/format";

import { IExpense } from "@/types/expenses";
import { ICategory } from "@/types/posts";

interface Props {
  className?: string;
  expense?: IExpense | null;
  isDialogOpen?: (value: boolean) => void;
  defaultType?: "income" | "outcome";
}

export default function Expense({
  className,
  expense,
  isDialogOpen = () => false,
  defaultType = "income",
}: Props) {
  /* Categories state */
  const categories = useGlobalStore((state) => state.categories);
  const updateCategories = useGlobalStore((state) => state.updateCategories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddNewCategory, setIsAddNewCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [categoriesCombobox, setCategoriesCombobox] = useState<
    ComboboxOptionProps[]
  >([]);

  /* Expenses state */
  const expenses = useExpenseStore((state) => state.expenses);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const updateTotalIncome = useExpenseStore((state) => state.updateTotalIncome);
  const updateTotalOutcome = useExpenseStore(
    (state) => state.updateTotalOutcome,
  );
  const [title, setTitle] = useState<string>("");
  const [isTitleValid, setIsTitleValid] = useState<boolean>(false);
  const [value, setValue] = useState<number | undefined | string>("");
  const [isValueValid, setIsValueValid] = useState<boolean>(false);
  const [type, setType] = useState<"income" | "outcome">(defaultType);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  /* Form state */
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  /* Form Validation*/
  const validateTitle = (nameToValidate: string) => {
    setIsTitleValid(nameToValidate.length > 0);
  };

  const validateValue = (valueToValidate: number) => {
    setIsValueValid(valueToValidate > 0);
  };

  useEffect(() => {
    if (expense && expense.categories && expense?.categories?.length > 0) {
      setTitle(expense.title || "");
      setValue(expense.expense.value);
      console.log("WHYYYYY", expense.categories[0]?.id, {
        label: expense.title || "",
        value: expense.categories[0]?.id || "",
      });
      setSelectedCategory(expense.categories[0]?.id);
      setType(expense.expense.type);
    }
  }, [expense]);

  useEffect(() => {
    setCategoriesCombobox([]);
    setCategoriesCombobox(categoriesToSelectOptions(categories));
  }, [categories]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  /* Submit new expense */
  const handleSubmitExpense = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const selectedCategories = categories.reduce(
        (selectedIds: ICategory[], category: ICategory) => {
          if (category.id === selectedCategory) {
            selectedIds.push(category);
          }
          return selectedIds;
        },
        [],
      );

      const data = await mutateExpense({
        title,
        content: "",
        categories: selectedCategories,
        formatedDate: selectedDate,
        value,
        type,
        requestType: "create",
      });

      const updatedExpenses = [data, ...expenses];
      updatedExpenses.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      if (data) {
        setSent(true);
        setTitle("");
        setValue(0);
        setSelectedCategory("");
        updateExpenses(updatedExpenses);
        updateTotalIncome();
        isDialogOpen(false);
      } else {
        setFormError(data.statusText);
      }
      setSubmitting(false);
    } catch (error: any) {
      console.log(error);
      setFormError(error);
      setSubmitting(false);
    }
  };

  /* Update Expense */
  const handleUpdateExpense = async (e: any, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const selectedCategories = categories.reduce(
        (selectedIds: ICategory[], category) => {
          if (category.id === selectedCategory) {
            selectedIds.push(category);
          }
          return selectedIds;
        },
        [],
      );

      const data = await mutateExpense({
        id,
        title,
        content: "",
        categories: selectedCategories,
        formatedDate: selectedDate,
        value,
        type,
        requestType: "update",
      });

      if (data) {
        setSent(true);
        setTitle("");
        setValue(0);
        setSelectedCategory("");
        updateExpenses([data, ...expenses]);
        updateTotalIncome();
        updateTotalOutcome();
      } else {
        setFormError(data.statusText);
      }
      setSubmitting(false);
    } catch (error: any) {
      console.log(error);
      setFormError(error);
      setSubmitting(false);
    }
  };

  /* Submit new category */
  const handleSubmitCategory = async (e: any) => {
    setSubmitting(true);
    setFormError("");
    e.preventDefault();

    try {
      const repeatedCategory = categories.find(
        (cat) =>
          cat.slug?.toLowerCase() === newCategory.toLowerCase() ||
          cat.name?.toLowerCase() === newCategory.toLowerCase(),
      );

      if (!repeatedCategory) {
        const data = await createCategory(newCategory);
        const category = data?.createCategory?.category;
        if (category) {
          setSelectedCategory(category.id);
          setIsAddNewCategory(false);
          setNewCategory("");
          updateCategories([...categories, category]);
        } else {
          if (data.errors) {
            setFormError(data.errors[0].message);
          }
        }
        setSubmitting(false);
      } else {
        // repeated category
        setSubmitting(false);
        setNewCategory("");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      setFormError(error);
      setSubmitting(false);
    }
  };

  return (
    // New expense
    <TooltipProvider>
      <div className={className}>
        <form onSubmit={handleSubmitExpense}>
          <div className="flex flex-col">
            <div className="flex flex-auto flex-col gap-4 md:flex-row">
              {/* DESCRIPTION */}
              <div className="mb-5 grid w-full items-center gap-4">
                <Label className="font-bold" htmlFor="title">
                  Description
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  placeholder="Salary, New guitar..."
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                    validateTitle(e.target.value);
                  }}
                  required
                />
              </div>

              {/* VALUE */}
              <div className="mb-5 grid w-full items-center gap-4">
                <Label className="font-bold" htmlFor="value">
                  Value
                </Label>
                <CurrencyInput
                  className={InputClasses}
                  required
                  id="value"
                  name="value"
                  value={value}
                  defaultValue={0}
                  decimalsLimit={2}
                  placeholder="e.g. €420,69"
                  prefix="€"
                  onValueChange={(value: any) => {
                    const val = parseFloat(value);
                    if (!isNaN(val) || val === 0) {
                      setValue(val);
                      validateValue(val);
                    } else {
                      setValue(0);
                      validateValue(0);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between gap-5">
              {/* DATE */}
              <div className="flex w-full flex-col items-start gap-4">
                <Label className="font-bold">Date</Label>
                <DatePicker
                  defaultDate={expense?.formatedDate}
                  onDateChange={handleDateChange}
                />
              </div>
              {/* CATEGORY */}
              <div className="flex w-full flex-col items-start gap-4">
                <Label className="font-bold" htmlFor="category">
                  Category
                </Label>
                <div className="flex items-center">
                  {!isAddNewCategory && (
                    <>
                      <Combobox
                        className="mr-3 w-full"
                        name="category"
                        selectedValue={(value) => value}
                        placeholder="Categories"
                        options={categoriesCombobox}
                        value={selectedCategory}
                      />

                      <Tooltip>
                        <TooltipTrigger
                          className={cn(buttonVariants({ size: "xs" }))}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsAddNewCategory(!isAddNewCategory);
                          }}
                        >
                          <PlusIcon />
                        </TooltipTrigger>
                        <TooltipContent>Create category</TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  {/* NEW CATEGORY */}
                  {isAddNewCategory && (
                    <div className="flex w-full items-center gap-3">
                      <Input
                        autoFocus={isAddNewCategory}
                        id="new-category"
                        name="new-category"
                        className="w-full"
                        type="text"
                        value={newCategory}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setNewCategory(e.target.value);
                        }}
                        placeholder="New category..."
                        required
                      />

                      <Tooltip>
                        <TooltipTrigger
                          className={cn(
                            buttonVariants({ variant: "default", size: "xs" }),
                            "",
                          )}
                          disabled={newCategory === "" || submitting}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmitCategory(e);
                          }}
                        >
                          <PlusIcon />
                        </TooltipTrigger>
                        <TooltipContent>Create category</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-col items-start gap-4">
              <Label className="font-bold">Type</Label>
              <RadioGroup defaultValue="option-income">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="income"
                    id="option-income"
                    checked={type === "income"}
                    onClick={() => setType("income")}
                  />
                  <Label htmlFor="option-income">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="outcome"
                    id="option-outcome"
                    checked={type === "outcome"}
                    onClick={() => setType("outcome")}
                  />
                  <Label htmlFor="option-outcome">Outcome</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => isDialogOpen(false)}
              >
                Close
              </Button>

              <Button
                className="flex-1"
                disabled={!isTitleValid || !isValueValid || submitting}
                size="md"
                onClick={handleSubmitExpense}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
