$(document).ready(function() {
  $("select").formSelect();

  // Get references to page elements
  var $ingredientAdded = $("#ingredient");
  var $ingredientType = $("#ingredient-type");
  var $submitBtn = $("#add-ingredient-form");
  var $ingredientList = $("#ingredient-list");
  var $ingredientRemove = $(".remove-ingredient");

  // The API object contains methods for each kind of request we'll make
  var API = {
    saveIngredient: function(ingredient) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/ingredientsAPI",
        data: JSON.stringify(ingredient)
      });
    },
    getIngredients: function() {
      return $.ajax({
        url: "api/ingredients",
        type: "GET"
      });
    },
    deleteExample: function(id) {
      return $.ajax({
        url: "api/examples/" + id,
        type: "DELETE"
      });
    }
  };

  // refreshIngredients gets new examples from the db and repopulates the list
  var refreshIngredients = function() {
    API.getIngredients().then(function(data) {
      console.log(data);
      var $ingredients = data.map(function(data) {
        var $a = $("<a>")
          .text(data.name)
          .attr("href", "/ingredient/" + data.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": data.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $ingredientList.empty();
      $ingredientList.append($ingredients);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    event.preventDefault();

    var ingredient = {
      ingredient: $ingredientAdded.val().trim(),
      description: $ingredientType.find(":selected").text()
    };

    if (!(ingredient.ingredient && ingredient.description)) {
      alert("You must enter an example text and description!");
      return;
    }

    API.saveIngredient(ingredient).then(function(result) {
      console.log(result);
      refreshIngredients(result);
    });

    $ingredientAdded.val("");
    $ingredientType.val("");
  };

  // handleDeleteBtnClick is called when an example's delete button is clicked
  // Remove the example from the db and refresh the list
  var handleDeleteBtnClick = function() {
    var idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteExample(idToDelete).then(function() {
      refreshIngredients();
    });
  };

  var removeIngredient = function() {
    console.log(this.id);

    $.ajax({
      method: "DELETE",
      url: "/api/ingredient/" + this.id
    }).then(function(ingredients) {
      refreshIngredients(ingredients);
    });
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on("submit", handleFormSubmit);
  $ingredientList.on("click", ".delete", handleDeleteBtnClick);
  $ingredientRemove.on("click", removeIngredient);
});
