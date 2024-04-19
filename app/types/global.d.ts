/* eslint-disable no-unused-vars */
export {};

declare global {
  interface INodeWP {
    databaseId?: number;
    id?: string;
    date?: string;
    name?: string;
    slug?: string;
  }

  interface IAuthor extends INodeWP {
    node: {
      databaseId?: number;
      avatar: {
        url: string;
      };
      firstName: string;
      lastName: string;
    };
  }
}
