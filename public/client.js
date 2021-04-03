const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


function flashError(message, duration = 5000) {
  const errorDiv = document.createElement("div")
  errorDiv.textContent = message
  errorDiv.className = "error"
  document.body.prepend(errorDiv)
  setTimeout(() => {
    errorDiv.remove()
  }, duration);
}


function displayPosts(elem) {
  fetch("/api/posts?limit=10&offset=0")
    .then(response => {
      if (!(response.ok)) {
        throw Error(response.status)
      }
    
      return response.json();
    })
    .then(data => {
      //{"id":1,"likes":0,"time":"2020-09-12 16:46:01","text":"string","userid":14}
      data.forEach(row => {
        displayOnePost(row, elem)
      })
    })
    .catch(err => {
      flashError(err.message)
    })
}

function displayOnePost(row, parentElem) {
    let obj = row
    
    let childItem = document.createElement("li")
    childItem.classList.add("post-list-li")
    let textElem = document.createElement("div")
    let likesElem = document.createElement("div")
    let dateElem = document.createElement("div")
    let usernameElem = document.createElement("div") //TODO: make username a link to the feed
    let footerElem = document.createElement("div")
    footerElem.classList.add("footer-elem")
    let likesParent = document.createElement("div")
    // Example of using innerHTML instead of document.createElement (optional):
    //element.innerHTML = `
    //  <div class="post-footer">
    //    <div>author: ${row.username}</div>
    //  </div>
    //`;
    
    let likeButton = document.createElement("a")
    
    likeButton.addEventListener("click", event => {
      event.preventDefault()
      fetch("/api/posts/like", { 
        method: "POST",
        body: JSON.stringify({id: row.id}),
        headers: { "Content-Type": "application/json" }
      })
    likesElem.textContent = ++obj.likes
    
    })
    likeButton.innerHTML = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`
    textElem.className = "post-text";
    let cleanedPostText = DOMPurify.sanitize(row.text)
    textElem.innerHTML = marked(row.text)
    // marked('# Marked in the browser\n\nRendered by **marked**.');
    likesElem.textContent = row.likes
    dateElem.textContent = row.time
    usernameElem.textContent = row.username
    likesParent.append(likeButton, likesElem)
    footerElem.append(dateElem, usernameElem, likesParent)
    childItem.append(footerElem, textElem)
    parentElem.appendChild(childItem)
}

// fetch("/api/login", {
//   method: "POST",
//   body: JSON.stringify({username: "SessionsUser", password: "SessionPass1"}),
//   headers: { "Content-Type": "application/json" }
// })
// // .then(res => res.json())
//     .then(response => {
//       console.log(response)
//     })
// .catch(err => console.error(err))















// how to clear the children of a node (inefficient but OK for now)
//postListElem.innerHTML = "";




// old code 

// const dreamsList = document.getElementById("dreams");
// const clearButton = document.querySelector('#clear-dreams');

// request the dreams from our app's sqlite database'
// function requestDreams() {
//   dreamsList.innerHTML = ""
//   fetch("/dreams", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       appendNewDream(row.id, row.dream);
//     });
//   });
// }
// requestDreams()

// a helper function that creates a list item for a given dream
// const appendNewDream = (id, dream) => {
//   const newListItem = document.createElement("li");
  
//   const dreamText = document.createElement("input")
//   dreamText.value = dream
//   dreamText.className = "blur"
  
//   const deleteButton = document.createElement("button");
//   deleteButton.style.height = "15px";
//   deleteButton.innerText = "Delete";
//   deleteButton.style.backgroundColor = "red";
//   deleteButton.style.fontSize = "12px"
  
//   dreamsList.appendChild(newListItem);
//   newListItem.appendChild(dreamText)
//   newListItem.appendChild(deleteButton)
  
//   deleteButton.addEventListener("click", () => {
//     fetch(`/dreams/${id}`, {
//       method: "DELETE",
//     })
//     dreamsList.removeChild(deleteButton.parentNode)
//   })
  
//   dreamText.addEventListener("focus", evt => {
//     evt.target.className = "focus"
//   })
//   dreamText.addEventListener("blur", evt => {
//     fetch(`/dreams/${String(id)}/${String(evt.target.value)}`, {
//       method: "PUT"
//     })
//     evt.target.className = "blur"
//   })
//   dreamText.addEventListener("keydown", evt => {
//     if (evt.key == "Enter") {
//       evt.target.blur()
//     }
//   })
// };


// clearButton.addEventListener('click', event => {
//   fetch("/dreams", {
//     method: "DELETE"
//   })
//     .then(res => res.json())
//     .then(response => {
//       console.log("cleared dreams");
//     });
//   dreamsList.innerHTML = "";
// });

  // get dream value and add it to the list
  // dreams.push(dreamInput.value);
  // requestDreams()

