const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./config/connection");
require('dotenv').config()

// setting Routers
const userRouter = require("./routes/user/user");
const adminRouter = require("./routes/admin/admin");

// Connection to dataBase
db.dbConnect();

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "thisismykey",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );  
  next();
});

app.use(cookieParser());

app.use(methodOverride('_method'))

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(express.static("public"));

// Routers
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.get("*",(req,res)=>{
  res.render("user/404")
})

app.listen(port, console.log("Server running at ", port));
