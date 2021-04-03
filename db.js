const fs = require("fs");
const dbFile = "./.data/sqlite.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
const bcrypt = require("bcrypt");
const saltRounds = 10;

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!fs.existsSync(dbFile)) {
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
         id INTEGER PRIMARY KEY AUTOINCREMENT, 
         username TEXT UNIQUE, 
         password TEXT
      );`
    );
    
    // https://www.sqlitetutorial.net/sqlite-foreign-key/
    // https://stackoverflow.com/questions/200309/sqlite-database-default-time-value-now
    // db.run(`DROP TABLE IF EXISTS Posts`);
    db.run(
      `CREATE TABLE IF NOT EXISTS Posts (
         id INTEGER PRIMARY KEY AUTOINCREMENT, 
         likes INTEGER NOT NULL DEFAULT 0, 
         time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
         text TEXT NOT NULL,
         userid INTEGER NOT NULL,
         FOREIGN KEY (userid) REFERENCES Users(id)
      );`
    );

    //db.run(`DROP TABLE IF EXISTS Comments`)
    //db.run(
    //  `CREATE TABLE IF NOT EXISTS Comments (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT, 
    //     content TEXT NOT NULL, 
    //     time TEXT NOT NULL,
    //     userid INTEGER NOT NULL,
    //     postid INTEGER NOT NULL,
    //     commentid INTEGER NOT NULL,
    //     FOREIGN KEY (userid) REFERENCES Users(id),
    //     FOREIGN KEY (postid) REFERENCES Posts(id),
    //     FOREIGN KEY (commentid) REFERENCES Comments(id)
    //  );`
    //);
  }
});

if (false) {
  db.serialize(() => {
    const username = 'testUser3'
    const password = 'testPassword1'
    const query = `INSERT INTO Users (username, password) VALUES (?, ?)`;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.run(
      `INSERT INTO Users (username, password) VALUES (?, ?)`,
      username,
      hash,
      function (err) {
        this.lastID;
        for (let i = 0; i < 50; ++i) {
          const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit velit aliquet leo accumsan laoreet. Nunc condimentum quis diam quis semper. Pellentesque pharetra enim et turpis auctor interdum. Aenean non vestibulum diam, et laoreet lacus. Fusce sit amet velit ac ante tempor rhoncus. Vestibulum cursus tempus hendrerit. Fusce a euismod quam. Vestibulum tellus ante, malesuada lacinia lectus nec, maximus scelerisque massa. Integer egestas non urna at auctor. Aenean pellentesque tellus sed nisi scelerisque semper.
  
Cras neq  ue nisi, accumsan at fringilla at, pulvinar et libero. Pellentesque ultrices dictum gravida. Aliquam eget turpis consequat, dapibus ante eu, mattis lectus. Aliquam odio urna, imperdiet id porttitor quis, venenatis ut felis. Fusce sed enim maximus, tempus dolor condimentum, tristique sapien. Sed non volutpat turpis. Donec fringilla ornare dapibus. Pellentesque ornare feugiat augue a pretium. Maecenas molestie felis diam, mattis accumsan erat pretium sit amet. Integer sed molestie enim, eget commodo lacus. Morbi elit mauris, rhoncus et convallis a, posuere vel lectus. Donec nulla dolor, interdum id orci eu, tincidunt congue sapien. Vivamus ac sollicitudin nibh.`
          const index = Math.floor(Math.random() * text.length) 
          db.run("INSERT INTO Posts (text, userid) VALUES (?, ?)", text.slice(index), this.lastID)
        }
      }
    );
  });
}

module.exports = db