export interface ICategory {
  id: number;
  name: string;
  selected: boolean;
}

export type ICategories = ICategory[];

export default class Category implements ICategory {
  id: number;
  name: string;
  selected: boolean;

  constructor(category: ICategory) {
    const { id, name } = category;

    this.id = id;
    this.name = name;

    this.selected = false;
  }
}
