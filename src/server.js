const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const port = 8000;
const user_collection1 = require("./userdatabase/userdata");
const users_collection1 = require("./userdatabase/userdata");
const e = require("express");
require("./userdatabase/mongoose_connection");

const app = express();
const bcrypt = require("bcryptjs");

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.use(express.json());

let mainfolder = path.join(__dirname, "../");

app.get("/", (req, res) => {
  res.send("home page");
  console.log(__dirname);
  console.log(mainfolder);
});

// const hashedpassword = async (password) => {
//   const hashkey = await bcrypt.hash(password, 12);
//   return hashkey;
// };

app.get("/register", (req, res) => {
  res.sendFile(mainfolder + "/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(mainfolder + "/login.html");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  let req_userdata = new users_collection1(req.body);
  if (req_userdata.password == req_userdata.confirm_password) {
    req_userdata.save();
    res.send("Registered Successfully");
  } else {
    res.send("Passwords do not match");
  }
});

app.post("/login", async (req, res) => {
  let usermail = req.body.email;
  let userpassword = req.body.password;
  //let mykey_password = await hashedpassword(userpassword);

  let req_userdata = await users_collection1.findOne({ email: usermail });
  if (req_userdata != null) {
    const bcrypt_password_match = await bcrypt.compare(
      userpassword,
      req_userdata.password
    );
    //res.send("Welcome to your dashboard");
    if (bcrypt_password_match == true) {
      res.send("Successfully Logged In");
    } else {
      res.send("Incorrect Password");
    }
  } else {
    res.send("Email do not exists");
  }
  res.send("logged in");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
