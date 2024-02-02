export type Grocery = {
  name: string;
  checked: boolean;
};

export type GroceryList = Array<Grocery>;

export * as mocks from "./types";
