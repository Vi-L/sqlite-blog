const db = require("../db");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const saltRounds = 10;
const {
  validateUsername,
  validatePassword
} = require("../middleware/validateUsers");

const validateLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  res.sendStatus(401);
};

//const sum = (...args) => args.reduce((a, e) => a + e, 0);
//function max() {
//  console.log(arguments)
//}
//const max = (...args) => Math.max(1, 2, 3, 4, 5);
//console.log(sum(1, 2, 3))
//console.log(max(1, 2))
// [[[1,2,3],4,5,6]].flat() => [1,2,3,4,5,6]

module.exports = app => {
  app.use(bodyParser.json());
  app.use(cookieParser());
  
  // TODO Logout GET route with res.clearCookie();
  // research "response.clearCookie().sendStatus()"" ?
  app.get("/logout", validateLoggedIn, (request, response) => {
    request.session.destroy(err =>
      err ? response.sendStatus(400) : response.redirect("/")
    );
  });
  
  app.get("/secret", validateLoggedIn, (request, response) => {
    console.log(request.session);
    response.sendStatus(200);
  });
  
  app.post("/api/login", (request, response) => {
    // console.log(request.cookies)
    db.get(
      "SELECT * from Users WHERE username=?",
      request.body.username,
      (err, row) => {
        if (err || row === undefined) {
          response.status(404).send({ message: "username not found" });
        } else {
          bcrypt.compare(request.body.password, row.password, function(err, res) {
            if (err) {
              // handle error
            } else if (res) {
              request.session.user = {...row, password: undefined};
              delete request.session.user.password;
              // console.log(request.session)
              response.json({user: request.session.user, message: "success"})
            } else {
              // response is OutgoingMessage object that server response http request
              return response.json({
                message: "passwords do not match"
              });
            }
          });
        }
      }
    );
  });

  app.get("/api/users", (request, response) => {
    db.all("SELECT * from Users", (err, rows) => {
      if (err) {
        response.status(500).send({ message: "error" });
      } else {
        response.send(JSON.stringify(rows));
      }
    });
  });

  app.get("/api/users/:id", (request, response) => {
    db.get("SELECT * from Users WHERE ID=?", request.params.id, (err, row) => {
      if (err || row === undefined) {
        response.status(404).send({ message: "id not found" });
      } else {
        response.send(JSON.stringify(row));
      }
    });
  });
  
  app.get("/api/users/getid/:username", (request, response) => {
    db.get("SELECT * from Users WHERE username=?", request.params.username, (err, row) => {
      if (err || row === undefined) {
        response.status(404).send({ message: "username not found" });
      } else {
        row.password = undefined
        response.send(JSON.stringify(row));
      }
    })
  })
  
  // TODO let a user change their password or email
  app.put("/api/users/:id/:pass", (request, response) => {
    bcrypt.hash(request.params.pass, saltRounds, (err, hash) => {
      db.all(
        "UPDATE Users SET password = ? WHERE ID = ?",
        hash,
        request.params.id,
        err => {
          if (err) {
            response.status(500).send({ message: "error!" });
          } else {
            response.send({ message: "success" });
          }
        }
      );
    });
  });

  app.delete("/api/users/:id", (request, response) => {
    db.all("DELETE FROM Users WHERE ID = ?", request.params.id, err => {
      if (err) {
        response.status(404).send({ message: "id not found" });
      } else {
        response.send({ message: "success" });
      }
    });
  });
  
  app.delete("/api/users", (request, response) => {
    db.all("DELETE FROM Users", err => {
      if (err) {
        console.error("could not delete users")
        response.status(500).send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  });

  app.post(
    "/api/users",
    validateUsername,
    validatePassword,
    (request, response) => {
      // DISALLOW_WRITE is an ENV variable that gets reset for new projects
      // so they can write to the database
      if (!process.env.DISALLOW_WRITE) {
        const cleansedUsername = cleanseString(request.body.username);
        const cleansedPassword = cleanseString(request.body.password);
        const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;
        // db.run(query, cleansedUsername, cleansedPassword, error => {
        //   if (error) {
        //     response.status(500).send({ message: "error!" });
        //   } else {
        //     response.send({ message: "success" });
        //   }
        // });
        bcrypt.hash(cleansedPassword, saltRounds, (err, hash) => {
          db.run(
            `INSERT INTO Users (username, password) VALUES (?, ?)`,
            cleansedUsername,
            hash,
            error => {
              if (error) {
                response.status(500).send({ message: "error!" });
              } else {
                response.send({ message: "success!" });
              }
            }
          );
        });
      }
    }
  );

  // helper function that prevents html/css/script malice
  const cleanseString = function(string) {
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
};
