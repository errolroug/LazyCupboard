$(document).ready(function() {
  $("select").formSelect();
  $(".collapsible").collapsible();
  $(".dropdown-trigger").dropdown();

  // $('.collapsible').collapsible();

  // Get references to page elements
  var $ingredientAdded = $("#ingredient");
  var $ingredientType = $("#ingredient-type");
  var $submitBtn = $("#add-ingredient-form");
  var $ingredientList = $("#ingredient-list");
  var $ingredientRemove = $(".remove-ingredient");
  var $tbodyIngredientList = $("#tbody-ingredientList");
  var $recipesList = $(".recipe-list");

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
    },
    getRecipes: function() {
      return $.ajax({
        url: "api/recipesAPI",
        type: "POST"
      });
    },
    savingRecipe(data) {
      return $.ajax({
        method: "PUT",
        url: "/api/saveRecipe",
        data: data
      });
    },
    deleteRecipe: function(id) {
      return $.ajax({
        url: "api/myrecipes/" + id,
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
        input.attr({ id: data.id });
        input.addClass("check");
        if (data.checked) {
          input.attr({ checked: data.checked });
        }
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
  var displayRecipes = function(data) {
    var tableIng = $("#tbody-ingredientList").addClass("hide");
    var $recipes = data.map(function(data) {
      // var row = $("<div>").addClass("row");

      var col = $("<div>").addClass("col s12 m6 l4");
      var card = $("<div>").addClass("card card-css center-align hoverable");
      var cardImg = $("<div>").addClass(
        "card-image waves-effect waves-block waves-light div-image-size"
      );
      var rcpImg = $("<img>").attr({ src: data.image });
      rcpImg.addClass("activator image-size");
      cardImg.append(rcpImg);

      card.append(cardImg);

      var cardContent = $("<div>").addClass("card-content"); // collapsible-body");

      var cardTitle = $("<span>").addClass(
        "card-title activator grey-text text-darken-4"
      );
      cardTitle.text(data.label);
      var cardTitleiClass = $("<i>").addClass("material-icons right");
      cardTitleiClass.text("more_vert");
      cardTitle.append(cardTitleiClass);

      var ptitlle = $("<p>");
      var atitle = $("<a>").attr({ href: "#" });
      ptitlle.append(atitle);

      cardContent.append(cardTitle);
      cardContent.append(ptitlle);

      card.append(cardContent);

      var cardReveal = $("<div>").addClass("card-reveal");

      var cardTitleReveal = $("<span>").addClass(
        "card-title grey-text text-darken-4"
      );
      cardTitleReveal.text(
        "Ingredients (" + data.calories + " Total Calories)"
      );
      var cardTitleiRevealClass = $("<i>").addClass("material-icons right");
      cardTitleiRevealClass.text("close");
      cardTitleReveal.append(cardTitleiRevealClass);

      cardReveal.append(cardTitleReveal);

      var ul = $("<ul>").addClass("collection");
      for (var i = 0; i < data.ingredients.length; i++) {
        var li = $("<li>").addClass(
          "collection-item #eceff1 blue-grey lighten-5"
        );
        li.text(data.ingredients[i].text);
        ul.append(li);
      }
      cardReveal.append(ul);

      card.append(cardReveal);
      // card.append(cardContent);
      col.append(card);
      // row.append(col);

      var cardAction = $("<div>").addClass("card-action");
      var addButton = $("<button>").addClass(
        "btn waves-effect waves-light save-recipe"
      );
      addButton.attr({ type: "submit", name: "action", recipeID: data.id });
      addButton.text("Prepare (" + data.calories + " Cal)");

      var iclassbtn = $("<i>").addClass("material-icons right");
      iclassbtn.text("send");
      addButton.append(iclassbtn);
      cardAction.append(addButton);

      card.append(cardAction);
      return col;
    });
    // var $tbody = $("<tbody>").attr({ id: "tbody-ingredientList" });
    // $tbody.append($ingredients)

    // console.log($tbody)

    $recipesList.empty();
    $recipesList.append($recipes);
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

  var findRecipes = function(event) {
    event.preventDefault();
    API.getRecipes().then(function(response) {
      console.log(response);
      displayRecipes(response);
    });
  };
  var addIngredienttoRecipe = function(event) {
    var data = {
      id: this.id,
      checked: event.currentTarget.checked
    };
    console.log(event.currentTarget.checked);
    console.log(data);
    $.ajax({
      method: "PUT",
      url: "/api/ingredientToRecipe",
      data: data
    });
  };
  var ingredientListhideshow = function(event) {
    if ($("#tbody-ingredientList").attr("class") === "hide") {
      $("#collapse-ing-table").text("unfold_less");
      $("#tbody-ingredientList").removeClass("hide");
    } else {
      $("#tbody-ingredientList").addClass("hide");
      $("#collapse-ing-table").text("unfold_more");
    }
  };
  var saveRecipe = function(event) {
    var data = {
      id: $(this).attr("recipeid")
    };
    API.savingRecipe(data).then(function(response) {
      window.location.assign("/recipe/" + response);
    });
  };
  var deleteRecipeID = function(event) {
    var id = $(this).attr("delID");

    API.deleteRecipe(id).then(function(response) {
      window.location.assign("/myrecipes");
    });
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on("submit", handleFormSubmit);
  $ingredientList.on("click", ".delete", handleDeleteBtnClick);
  $(document).on("click", ".remove-ingredient", removeIngredient);
  $(document).on("click", "#find-recipes", findRecipes);
  $(document).on("click", ".check", addIngredienttoRecipe);
  $(document).on("click", ".collapse-table", ingredientListhideshow);
  $(document).on("click", ".save-recipe", saveRecipe);
  $(document).on("click", ".delete-button-recipe", deleteRecipeID);

  // $(document).on("ready", ".collapsible", $('.collapsible').collapsible());
});
