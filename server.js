const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
app.set("trust proxy", 1);
app.set("view engine", "ejs");

  app.use(session({
    store: new SQLiteStore({dir: "./.data", db: "sqlite.db"}),
    secret: "sxcdrvftgbnhujk3wfqw2ftol6789",
    key: "sqlite_blog_user",
    cookie: {
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    },
    resave: false,
    saveUninitialized: false,
  }));

require("./routes/users")(app);
require("./routes/posts")(app);

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static("public"));

app.disable('view cache');  //TODO



  // https://ejs.co/
  // response.send(ejs.render('<p>Hello world</p><%=foo%>', {foo: 42}))
  // ejs.renderFile(`${__dirname}/views/testejs.ejs`, {foo: 42}, function(err, str) {
  //   response.send(str)
  // })
  
  //ejs.renderFile(filename, data, options, function(err, str){
  //    // str => Rendered HTML string
  //});


app.get("/", (request, response) => {
  if (request.session.user) response.render("index", {username: request.session.user.username})
  else {
    response.render("index", {username: null})
  }
});

app.get("/login", (request, response) => {
  if (request.session.user) response.render("login", {username: request.session.user.username})
  else response.render("login", {username: null})
});

// TODO check user is logged in
app.get("/new-post", (request, response) => {
  if (request.session.user) response.render("new-post", {username: request.session.user.username})
  else response.render("new-post", {username: null})
});

app.get("/feed/:username", (request, response) => {
  if (request.session.user) response.render("feed", {username: request.session.user.username})
  else response.render("feed", {username: null})
})

app.get("/users", (request, response) => {
  if (request.session.user) response.render("users", {username: request.session.user.username})
  else response.render("users", {username: null})
})

var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

