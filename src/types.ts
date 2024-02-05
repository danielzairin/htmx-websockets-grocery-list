export type Session = {
  code: string;
};

export type Grocery = {
  name: string;
  checked: boolean;
};

export type GroceryList = Array<Grocery>;
