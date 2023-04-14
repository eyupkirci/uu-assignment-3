const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// routes

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

// the view engine

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// static files
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

// middlewares

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
      maxAge: 60 * 60 * 1000, // 1h
      sameSite: "strict",
      secure: true,
    },
  })
);

// Routes

app.use("/", indexRouter);
app.use("/api", apiRouter);

// not found
app.use((req, res) => {
  res.status(404).send("Page not found!");
});

//listen
app.listen((PORT = 3001), () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
