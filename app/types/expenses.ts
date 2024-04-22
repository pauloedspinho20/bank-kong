import { ICategory } from "./posts";

export interface IExpenseBase extends INodeWP {
  author?: IAuthor | number;
  content?: string;
  categories?: ICategory[];
  date?: string;
  formatedDate?: Date;
  title?: string;
}
export interface IExpense extends IExpenseBase {
  expense: {
    fieldGroupName: string;
    value: number;
    type: "income" | "outcome";
  };
}

export interface IExpensePOST extends IExpenseBase {
  value?: string | number;
  type?: string;
  requestType: "create" | "update" | "delete";
}
