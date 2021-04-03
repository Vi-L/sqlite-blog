const db = require("../db")
module.exports = app => {
  
  const validateLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  res.sendStatus(401);
};
  
/*
/api/posts/count/:username
showing records 50-60 of 191
[0] [1] ... [52] ... [1052] [1053]

https://api.stackexchange.com/docs

TODO redesign to:
/api/resource/:id/subresource?pages=42&something=55
for example /api/users/:username/posts/count perhaps?
*/
app.get("/api/posts/count/:userid", (request, response) => {
  db.get(`SELECT COUNT(*) FROM Posts WHERE userid=?`, request.params.userid, (err, rows) => {
    if (err) {
      console.log(err)
      response.status(500).send({ message: "server error" })
    } else {
      response.send(JSON.stringify({ count: rows["COUNT(*)"] }))
    }
  })
})
  
app.get("/api/posts", (request, response) => {
  const query = `
    SELECT
      username, 
      likes, 
      time, 
      text, 
      Posts.id AS "id"
    FROM Posts
    INNER JOIN Users
    ON Posts.userid = Users.id
    ORDER BY time DESC
    LIMIT ? OFFSET ?
  `;
  
  // "window" and "sliding window"
  //       
  // limit 6 aka "how many"
  //
  //            v v v v
  //           [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
  //        
  // offset 4 aka "starting at index"
  
  // SELECT * FROM Table LIMIT 100, 5000
  // https://stackabuse.com/get-query-strings-and-parameters-in-express-js/
  
  // - do the properties even exist (i.e. 'undefined')?
  // - are they numbers (and integer)?
  // - are they in a valid range?
  // => if any fail, 400
  const {limit, offset} = request.query
  
  if (isNaN(limit) || !(Number.isInteger(+limit)) || +limit > 200 || +limit < 1) {
    return response.sendStatus(400)
  }
  if (isNaN(offset) || !(Number.isInteger(+offset)) || +offset < 0) {
    return response.sendStatus(400)
  }
  db.all(query, limit, offset, (err, rows) => {
    if (err) {
      console.error(err)
      response.status(500).send({ message: "error" });
    } else {
      response.send(JSON.stringify(rows));
    }
  });
});

app.post("/api/posts/like", (request, response) => {
  db.all("UPDATE Posts SET likes = (likes + 1) WHERE ID=?", request.body.id, err => {
    if (err) {
      response.status(500).send({message: "error"})
    } else {
      response.send({message: "success"})
    }
  })
})  

// app.get("/api/posts/username", (request, response) => {
  
// })  

//CRUD routes for posts
app.post("/api/posts", validateLoggedIn, (request, response) => {
   // console.log(request.body)
  // https://img.devrant.com/devrant/rant/r_1850976_5Prjr.gif
  db.all("INSERT INTO Posts (text, userid) VALUES (?, ?)", request.body.text, request.session.user.id, err => {
    if (err) {
      response.status(500).send({message: "error"})
      console.warn(err)
    } else {
      response.send({message: "success", username: request.session.user.username})
    }
  })
})
  
app.get("/api/posts/:id", (request, response) => {
  // console.log(request.body)
  db.all("SELECT * FROM POSTS WHERE ID=?", request.params.id, (err, rows) => {
    if (err) {
      response.status(404).send({ message: "error" })
    } else {
      response.send(JSON.stringify(rows))
    }
  })
})
  
app.get("/api/posts/user/:userid", (request, response) => {
  // console.log(request.body)
  db.all("SELECT * FROM POSTS WHERE userid=?", request.params.userid, (err, rows) => {
    if (err) {
      response.status(404).send({ message: "error" })
    } else {
      response.send(JSON.stringify(rows))
    }
  })
})
  
app.get("/api/posts/username/:username", (request, response) => {
  // console.log(request.body)
  // console.log(request.params)
  db.all(`SELECT
      username, 
      likes, 
      time, 
      text, 
      Posts.id AS "id"
    FROM Posts
    INNER JOIN Users
    ON Posts.userid = Users.id
    WHERE username=?
    ORDER BY time DESC
    LIMIT ? OFFSET ?`, request.params.username, request.query.limit, request.query.offset, (err, rows) => {
    if (err) {
      console.error(err)
      response.status(404).send({ message: "error" })
    } else {
      // console.log(rows)
      response.send(JSON.stringify(rows))
    }
  })
})
  
app.delete("/api/posts/:id", (request, response) => {
  // console.log(request.body)
  db.all("DELETE FROM Posts WHERE ID=?", request.params.id, err => {
    if (err) {
      response.status(500).send({message: "error"})
    } else {
      response.send({message: "success"})
    }
  })
})
  
app.put("/api/posts/:id", (request, response) => {
  // console.log(request.body)
  let props = Object.keys(request.body)
  let vals = Object.values(request.body)
  db.all("UPDATE Posts SET (?) = (?) WHERE ID=?", props, vals, request.params.id, err => {
    if (err) {
      response.status(500).send({message: "error"})
    } else {
      response.send({message: "success"})
    }
  })
})

}
