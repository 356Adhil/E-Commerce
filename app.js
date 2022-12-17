const express = require("express");
const app = express();
const port = 3080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const session = require("express-session");
const cookieParser = require("cookie-parser");

// const expressLayouts = require("express-ejs-layouts");
// const path = require("path");

// setting Routers
const userRouter = require("./routes/user/user");
const adminRouter = require("./routes/admin/admin");

// Connection to dataBase
mongoose.connect("mongodb://localhost:27017/E-Commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// app.use(expressLayouts);
// app.set("layout", "./layouts/layout");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(express.static("public"));
// app.use("css", express.static(path.join(__dirname + "public/css")));

// Routers
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(port, console.log("Server running at ", port));
