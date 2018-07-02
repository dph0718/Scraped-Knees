const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 3000;
const app = express();
const routes = require("./controllers/routes.js");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(routes);

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(process.env.PORT || PORT, function() {
  console.log("App running on port " + PORT + "!");
});
