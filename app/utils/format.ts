import { ComboboxOptionProps } from "@/components/combobox";
import { ICategory } from "@/types/posts";
import { format } from "date-fns";

/* Format a number into a currency string */
export function formatToEuro(currencyValue: number): string {
  // Use Intl.NumberFormat to format the number as currency with euro symbol
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });
  return formatter.format(currencyValue);
}

/* Separate date and time from Wordpress date format */
export function separateDateAndTime(dateTimeString: string): {
  date: string;
  time: string;
} {
  const [datePart, timePart] = dateTimeString?.split("T");
  return { date: datePart, time: timePart };
}

/* Convert from "YY-MM-DDTHH:mm:ss" to JavaScript Date object */
export function dateStringToDate(dateString: string): Date {
  const [year, month, day, hour, minute, second] = dateString
    .split(/[-T:]/)
    .map(Number);

  // JavaScript Date object months are 0-indexed, so we need to subtract 1 from the month
  return new Date(year, month - 1, day, hour, minute, second);
}

/* Convert from JavaScript Date object to "YY-MM-DDTHH:mm:ss" format */
export function dateToDateString(date: Date): string {
  const year = date.getFullYear() - 2000;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

export function getFormatedDate(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

export function getFormatedTime(date: Date): string {
  return format(date, "HH:mm");
}

/* Convert ICategory into ComboboxOptionProps */
export function categoriesToSelectOptions(
  categories: ICategory[],
): ComboboxOptionProps[] {
  return categories.map((category) => ({
    value: category.id || "",
    label: category.name || "",
  }));
}
