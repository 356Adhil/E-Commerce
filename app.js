const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts");
// const path = require("path");
const userRouter = require("./routes/user/user");
// need declare admin router

// Connection to dataBase
mongoose.connect("mongodb://localhost:27017/E-Commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayouts);
app.set("layout", "./layouts/layout")

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
// need add admin router

app.listen(port, console.log("Server running at ", port));
