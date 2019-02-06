$("#register-user").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();

  //create the object that will be sent to the back end to register the user:
  var newUser = {
    firstName: $("#first_name")
      .val()
      .trim(),
    lastName: $("#last_name")
      .val()
      .trim(),
    username: $("#username")
      .val()
      .trim(),
    email: $("#email")
      .val()
      .trim(),
    role: $("#role")
      .val()
      .trim(),
    password: $("#password")
      .val()
      .trim(),
    password2: $("#password2")
      .val()
      .trim()
  };

  console.log(newUser);

  // Do some validation to make sure the password lenght is at least 4 characters:

  if (newUser.password === newUser.password2 && newUser.password.length > 6) {
    console.log("success");

    // Send the POST request to register the new user:

    $.ajax("/users/register", {
      type: "POST",
      data: newUser
    })
      .done(function(data) {
        //just log the received data for now
        $("body").replaceWith(data);
      })
      .fail(err => console.log(err));
  } else if (
    newUser.password !== newUser.password2 &&
    newUser.password.length > 4
  ) {
    $(".hidden").empty();
    $(".hidden").append("Passwords do not match");
  } else if (
    newUser.password === newUser.password2 &&
    newUser.password.length < 4
  ) {
    $(".hidden").empty();
    $(".hidden").append("Password must be longer than 6 characters");
  }
});
