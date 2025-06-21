

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usermodel = require("../models/user");
const postmodel = require("../models/post");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect('mongodb://127.0.0.1:27017/becn')


app.get("/", function (req, res) {
  res.render("ap"); 
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async function (req, res) {
  let { username, name, age, email, password } = req.body;

  let existingUser = await usermodel.findOne({ email });
  if (existingUser) return res.status(400).send("User already exists");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await usermodel.create({
        username,
        name,
        age,
        email,
        password: hash
      });
      let token = jwt.sign({ email: email, userid: user._id }, "rrrishabh");
      res.cookie("token", token);
      res.send("User registered successfully");
    });
  });
});

app.post("/login", async function (req, res) {
  let { email, password } = req.body;
  let user = await usermodel.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) res.status(200).redirect("/profile");
    else res.redirect("/login");
  });
});

app.post("/profile", async function(req,res){
let user = findOne({email})
})

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/login");
});

function islo(req,res,next){
    if(req.cookies.token === "") res.send("You must be logged in")
        else {
    let data = jwt.verify(req.cookies.token,"shhh")
    req.user = data;
    }
    next();
}

app.listen(3000, () => {
  
});
