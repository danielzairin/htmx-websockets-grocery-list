type GroceryListItem = {
  name: string;
  checked: boolean;
};

type GroceryList = Array<GroceryListItem>;

export const groceryList: GroceryList = [
  {
    name: "Apples",
    checked: false,
  },
  {
    name: "Bananas",
    checked: false,
  },
  {
    name: "Cheese",
    checked: true,
  },
];

export * as mocks from "./mocks";
