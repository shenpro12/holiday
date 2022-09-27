const express = require("express");
const handlebars = require("express-handlebars");

require("dotenv").config();
const path = require("path");
const session = require("express-session");
const route = require("./resources/route");
const db = require("./config/db");

const app = express();
const port = 3000;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
//morgan

//template engine
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
//
db.connect();
//
route(app);

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
