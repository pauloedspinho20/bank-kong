export interface ICategory extends INodeWP {
  count?: number;
  parent?: { node: INodeWP };
  selected?: boolean;
}

export interface IPost extends INodeWP {
  author: IAuthor;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: {
    sourceUrl: string;
    sizes: string;
    mediaDetails: {
      height: string;
      width: string;
    };
  };
  categories: ICategory[];
}
