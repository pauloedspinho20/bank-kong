export interface ICategory extends INodeWP {
  count?: number;
  parent?: { node: INodeWP };
  selected?: boolean;
}
