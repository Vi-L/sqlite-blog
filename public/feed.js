let username = new URL(window.location.href).pathname.split("/").pop()
let userid;
const params = new URLSearchParams(window.location.search)
const nextButton = $("#next-button")
const usersPostList = $("#posts-list")
const postCount = $("#post-count")
const limit = 10
const page = +params.get("page") // TODO validate the parameter

if (page < 1) {  window.location = `/feed/${username}?page=1`;}

const offset = (page - 1) * limit 

nextButton.addEventListener("click", event => {
  window.location = `/feed/${username}?page=${page + 1}`
})

/*const userIdPromise =*/ fetch(`/api/users/getid/${username}`)
  .then(res => res.json())
  .then(data => {
    const userid = data.id
    fetch(`/api/posts/count/${userid}`)
      .then(res => res.json())
      .then(({count}) => {
      /*
                  .post-nav
        .----------------------------.
        | [prev] 50-65 of 100 [next] |
        `----------------------------`
      */
      // 50 is the offset 
      // 65 min(count, offset+limit)
      postCount.innerText = `${offset + 1} - ${Math.min(count, offset + limit)} of ${count}`
    })
  })

fetch(`/api/posts/username/${username}?limit=${limit}&offset=${offset}`)
  .then(res => res.json())
  .then(response => {
    if (response.length === 0) {
      flashError("User does not have any posts!", 5000)
    } else {
      response.forEach(row => { 
        displayOnePost(row, usersPostList)
      })
    }
  }).catch(err => {
    console.error(err)
  })

/*
- Multithreading concurrency
- race condition horror story: https://en.wikipedia.org/wiki/Therac-25

python: asyncio
c++: concurrent futures
c: not really.... but it does have multithreading so you can basically implement async stuff. maybe there's some libraries out there...
go: goroutines

... very complex topic!
*/

// https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
// another tool for promises called async/await

/*
[1] [2] ... [54] ... [134] [135]   <-- page=[whatever number in the button]

SELECT COUNT(*) FROM table WHERE id=blah

1 – 191 of 191  <-- discogs style

blogspot style
      |
      V
[newer posts]   [home]  [older posts]
http://sokoban-jd.blogspot.com/search?updated-max=2015-06-30T01:28:00%2B02:00&max-results=10&reverse-paginate=true
or: [prev] [current] [next]
^^^^^^

Infinite Scrolling!!!
let offset = 0;
window.addEventListener("scroll", e => {
  offset += limit;
  if (window.scrollHeight === ...) {  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    // fetch more records and add to DOM
  }
})

*/
