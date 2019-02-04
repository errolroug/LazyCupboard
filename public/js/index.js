$(document).ready(function() {
  $("select").formSelect();

  // Get references to page elements
  var $ingredientAdded = $("#ingredient");
  var $ingredientType = $("#ingredient-type");
  var $submitBtn = $("#add-ingredient-form");
  var $ingredientList = $("#ingredient-list");
  var $ingredientRemove = $(".remove-ingredient");
  var $tbodyIngredientList = $("#tbody-ingredientList");

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
      var $ingredients = data.map(function(data) {
        var $tr = $("<tr>");
        $tr.attr({ dataID: data.id });
        var td = $("<td>");
        var label = $("<label>");
        var span = $("<span>");

        var input = $("<input>");

        input.attr({ type: "checkbox" });
        //input.attr(data.checked)
        label.append(input);
        label.append(span);

        td.append(label);

        $tr.append(td);

        var td2 = $("<td>");
        var $a = $("<a>")
          .text(data.name)
          .attr("href", "/ingredient/" + data.id);
        td2.append($a);

        $tr.append(td2);

        var td3 = $("<td>").text(data.calories);
        $tr.append(td3);

        var td4 = $("<td>").text(data.protein);
        $tr.append(td4);

        var td5 = $("<td>").text(data.fat);
        $tr.append(td5);

        var td6 = $("<td>").text(data.carbs);
        $tr.append(td6);

        var $button = $("<button>").addClass(
          "btn-floating btn-small scale-transition remove-ingredient"
        );
        $button.attr({ id: data.id });
        var iclass = $("<i>")
          .addClass("material-icons")
          .text("remove");

        $button.append(iclass);
        var $td7 = $("<td>");
        $td7.append($button);
        $tr.append($td7);

        return $tr;
      });
      // var $tbody = $("<tbody>").attr({ id: "tbody-ingredientList" });
      // $tbody.append($ingredients)

      // console.log($tbody)

      $tbodyIngredientList.empty();
      $tbodyIngredientList.append($ingredients);
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

  //  $ingredientRemove.on("click", removeIngredient);

  $(document).on("click", ".remove-ingredient", removeIngredient);
});
