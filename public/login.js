const accCreationForm = $("#account-creation");
const accLoginForm = $("#account-login");

accLoginForm.onsubmit = event => {
  event.preventDefault()
  fetch("/api/login", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username: accLoginForm.children[0].value, password: accLoginForm.children[1].value})
  })
  .then(res => res.json())
  .then(response => {
    // logged in!
    console.log(response)
    accLoginForm.reset();
    window.location = "/feed/" + response.user.username
  })
  .catch(err => console.error(err));
}

accCreationForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { username: accCreationForm.children[0].value, password: accCreationForm.children[1].value };
  // console.log(dreamsForm.children[0].value, dreamsForm.children[1].value) 
  //const dreamInput = dreamsForm.elements["dream"];
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      if (response.message.includes("username")) {
        flashError(response.message + " 20 characters maximum, alphanumeric characters only.", 4500)
      } else if (response.message.includes("password")) {
        flashError(response.message + " Must be at least 8 charcters, contain a lowercase letter, an uppercase letter, and a number or special character", 8000)
      } else {
        console.log(JSON.stringify(response));
      }
    })
    .catch(err => console.log(err));

  // reset form
  //dreamInput.value = "";
  //dreamInput.focus();
  accCreationForm.reset()
};