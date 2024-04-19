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
  const [datePart, timePart] = dateTimeString.split("T");
  return { date: datePart, time: timePart };
}
