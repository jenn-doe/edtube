const express = require("express");
const bodyParser = require("body-parser");
const index = require("./routes/index");
const user = require("./routes/user");
const playlist = require("./routes/playlist");
const trending = require("./routes/trending");
const myChannels = require("./routes/myChannels");
const exphbs = require("express-handlebars");
const sassMiddleware = require("node-sass-middleware");
const createData = require("./createData");
const path = require("path");

const app = express();
const port = 8000;

app.use(
  sassMiddleware({
    src: __dirname,
    dest: __dirname,
    debug: true,
    outputStyle: "compressed",
    force: true
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", exphbs());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", index);
app.use("/user", user);
app.use("/playlist", playlist);
app.use("/trending", trending);
app.use("/myChannels", myChannels);

createData();

app.listen(port);
console.log("Server listening on port " + port);
