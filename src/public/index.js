import Sortable from "sortablejs";

const groceryListForm = document.querySelector("#groceries-form");
const groceryList = document.querySelector("#groceries");

const sortable = new Sortable(groceryList, {
  animation: 150,
  ghostClass: "blue-background-class",

  onSort: function (event) {
    const name = event.item.getAttribute("data-name");
    const newPosition = event.newIndex + 1;

    document.querySelector("#sorted_name").setAttribute("value", name);
    document
      .querySelector("#sorted_new_position")
      .setAttribute("value", newPosition);
  },

  onEnd: function () {
    this.option("disabled", true);
  },
});

groceryListForm.addEventListener("htmx:afterSwap", () => {
  sortable.option("disabled", false);
});
