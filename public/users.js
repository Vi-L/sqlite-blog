fetch("/api/users")
  .then(res => res.json())
  .then(response => {
    console.log(response)
    for (const user of response) {
      let childItem = document.createElement("li")
      childItem.innerHTML = `
      <a href="/feed/${user.username}">${user.username}</a>
      `
      document.querySelector("#users-list").appendChild(childItem)
    }
  }).catch((err) => {
  console.error(err)
})