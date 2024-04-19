import { ICategory } from "./posts";

export interface IExpense extends INodeWP {
  author?: IAuthor | number;
  content: string;
  categories?: ICategory[];
  expense: {
    fieldGroupName: string;
    value: number;
    type: "income" | "outcome";
  };
  title: string;
}

export interface ICreateExpense {
  title: string;
  content: string;
  categories: ICategory[];
  value: string | number;
  type;
}
