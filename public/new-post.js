const postCreationForm = $("#post-creation")
// const postListElem = $("#posts-list")  //postListElem already defined in client.js, which is also imported in new-post.html

  postCreationForm.onsubmit = event => {
  event.preventDefault();
  let textContent = $("#post-content").value
  fetch("/api/posts", {
    method: "POST", 
    body: JSON.stringify({text: textContent}),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => {
    if (res.ok) {
      return res.json()
    }
    throw Error("Unauthorized")
  })
  .then(data => {
    console.log(data)
    window.location = "/feed/" + data.username
  })
  .catch(error => {
    console.error(error)
    flashError(error.message)
  })
  }