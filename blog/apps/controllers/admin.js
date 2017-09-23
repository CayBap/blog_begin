var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var user_md = require("../models/user");
var helper = require("../helpers/helper");
//Home page
router.get("/", function(req, res) {
  res.json({ message: "this is admin page" });
});
//Sign up page
router.get("/signup", function(req, res) {
  res.render("signup.ejs", { data: {} });
});
router.post("/signup", function(req, res) {
  var user = req.body;

  if (user.email.trim().length == 0) {
    res.render("signup.ejs", { data: { error: "Email is required" } });
  }
  if (user.passwd.trim().length != 0 && user.passwd != user.repasswd) {
    res.render("signup.ejs", { data: { error: "Password is not Match" } });
  }
  //insert to DB
  var password = helper.hash(user.passwd);
  user = {
    email: user.email,
    password: password,
    first_name: user.firstname,
    last_name: user.lastname
  };
  var result = user_md.addUser(user);

  result
    .then(function(data) {
      // res.json({message:"Insert success"});
      res.redirect("/admin/signin"); //conect to signin
    })
    .catch(function(err) {
      res.render("signup", { data: { error: "error" } });
    });
  // if(!result){
  //     res.render("signup",{data:{error:"Could not insert DB "}});
  // }
  // else{
  //     res.json({message:"Insert success"});
  // }
});

//SIGN IN

router.get("/signin", function(req, res) {
  res.render("signin.ejs", { data: {} });
});
//error login

router.post("/signin", function(req, res) {
  var params = req.body;

  if (params.email.trim().length == 0) {
    res.render("signin.ejs", { data: { error: "Email is incorrect" } });
  } 
  else {
    var data = user_md.getUserByEmail(params.email);
    //console.log(data);
    if (data) {
      data.then(function(users) {
        var user = users[0];
        console.log(user, users);
        var status = user.password == helper.hash(params.password);
        console.log(status,  params.password, user.password);
        if (!(status)) {
          res.render("signin.ejs", { data: { error: "Password is wrong" } });
        } 
        else {
          req.session.user = user;
          //console.log(status);
          console.log(req.session.user);
          res.redirect("/admin/");
        }
      });
      
      data.catch(function(){
        res.render("signin.ejs", { data: { error: "User not exists" } });
      });
    } 
    // else {
    //   res.render("signin.ejs", { data: { error: "User not exists" } });
    // }
  }
});

module.exports = router;
