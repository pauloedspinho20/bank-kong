import { ChangeEvent, useEffect, useState } from "react";
import cn from "classnames";
import CurrencyInput from "react-currency-input-field";
import { PlusIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { InputClasses } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { buttonVariants } from "@/components/ui/button";

import { createCategory } from "../wp-api/mutations/posts";
import { createExpenseREST } from "../wp-api/mutations/expenses";

import { useGlobalStore } from "../hooks/useGlobalState";
import { useExpenseStore } from "../hooks/useGlobalState";

import { Combobox, ComboboxOptionProps } from "./combobox";
import { ICategory } from "@/types/posts";

interface Props {
  className?: string;
  expense?: any;
  editMode?: boolean;
  isDialogOpen?: (value: boolean) => void;
  defaultType?: "income" | "outcome";
}

export default function Expense({
  className,
  expense,
  editMode = false,
  isDialogOpen,
  defaultType = "income",
}: Props) {
  /* Categories state */
  const categories = useGlobalStore((state) => state.categories);
  const updateCategories = useGlobalStore((state) => state.updateCategories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddNewCategory, setIsAddNewCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoriesCombobox, setCategoriesCombobox] =
    useState<ComboboxOptionProps[]>(null);

  /* Expenses state */
  const expenses = useExpenseStore((state) => state.expenses);
  const updateExpenses = useExpenseStore((state) => state.updateExpenses);
  const updateTotalValue = useExpenseStore((state) => state.updateTotalValue);
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [title, setTitle] = useState<string>("");
  const [isTitleValid, setIsTitleValid] = useState<boolean>(false);
  const [value, setValue] = useState<number | undefined | string>("");
  const [isValueValid, setIsValueValid] = useState<boolean>(false);
  const [type, setType] = useState<"income" | "outcome">(defaultType);

  /* Form state */
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  /* Form Validation*/
  const validateTitle = (nameToValidate: string) => {
    setIsTitleValid(nameToValidate.length > 3);
  };

  const validateValue = (valueToValidate: number) => {
    setIsValueValid(valueToValidate > 0);
  };

  /* Convert ICategory into ComboboxOptionProps */
  function convertCategoriesToSelectOptions(
    categories: ICategory[],
  ): ComboboxOptionProps[] {
    return categories.map((category) => ({
      value: category.id || "",
      label: category.name || "",
    }));
  }

  useEffect(() => {
    setCategoriesCombobox(null);
    setCategoriesCombobox(convertCategoriesToSelectOptions(categories));
  }, [categories]);

  /* Submit new expense */
  const handleSubmitExpense = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const selectedCategories = categories.reduce((selectedIds, category) => {
        if (category.id === selectedCategory) {
          selectedIds.push(category);
        }
        return selectedIds;
      }, []);

      const data = await createExpenseREST({
        title,
        content: "",
        categories: selectedCategories,
        value,
        type,
      });

      if (data) {
        setSent(true);
        setTitle("");
        setValue(0);
        setSelectedCategory("");
        updateExpenses([data, ...expenses]);
        updateTotalValue();
        isDialogOpen(false);
      } else {
        setFormError(data.statusText);
      }
      setSubmitting(false);
    } catch (error) {
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
          cat.slug.toLowerCase() === newCategory.toLowerCase() ||
          cat.name.toLowerCase() === newCategory.toLowerCase(),
      );

      if (!repeatedCategory) {
        const data = await createCategory(newCategory);
        console.log("handleSubmitCategory", data);
        const category = data?.createCategory?.category;
        if (category) {
          /* category.selected = true; */
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
    } catch (error) {
      console.error("Error creating category:", error);
      setFormError(error);
      setSubmitting(false);
    }
  };

  return expense ? (
    <div className="mb-5 flex flex-col rounded-xl border border-black p-5">
      <h3 className="">{expense.title}</h3>
      <div className="flex gap-4">
        <h5 className="">{expense.expense?.value}€</h5>
        <Button onClick={() => setIsEditMode(!isEditMode)} size="sm">
          Edit
        </Button>
      </div>

      <div className="flex gap-4">{expense.date}</div>

      <div className="flex">
        {expense.categories?.map((category) => (
          <div
            key={category.id}
            className="mr-2 rounded border border-black/50 px-3 py-1"
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  ) : (
    // New expense
    <TooltipProvider>
      <div className={className}>
        <form onSubmit={handleSubmitExpense}>
          <div className="flex flex-col">
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
                onValueChange={(value) => {
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

            <div className="flex items-center gap-5">
              {/* CATEGORY */}
              <div className="mb-5 grid w-full items-center gap-4">
                <Label className="font-bold" htmlFor="category">
                  Category
                </Label>
                <div className="flex items-center">
                  {!isAddNewCategory && (
                    <>
                      <Combobox
                        className="mr-3"
                        name="category"
                        selectedValue={setSelectedCategory}
                        placeholder="Categories"
                        options={categoriesCombobox}
                        value={selectedCategory}
                      />

                      <Tooltip>
                        <TooltipTrigger
                          className={cn({ buttonVariants })}
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
                            "ml-2",
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

              <div className="mb-5 grid w-full items-center gap-4">
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
                    <Label htmlFor="option-outcome">Expense</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <DialogClose asChild>
                <Button className="flex-1" type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>

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
