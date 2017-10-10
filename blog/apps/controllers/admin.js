var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");

var user_md = require("../models/user");
var post_md = require("../models/post");
var helper = require("../helpers/helper");
//Home page
router.get("/", function(req, res) {
  //res.json({ message: "this is admin page" });
  if(req.session.user){
    var data = post_md.getAllPosts();
    
    data.then(function(posts){
      var data = {
        posts:posts,
        error : false
      };
     // console.log(data);
      res.render("admin/dashboard",{data:data});
    })
    .catch(function(err){
      res.render("admin/dashboard",{data:{error:"Get Post data is error"}});
    });
  }
  else{
    res.redirect("/admin/signin");
  }
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
  //insert Account to DB
  var now = new Date();
  var password = helper.hash(user.passwd);
  user = {
    email: user.email,
    password: password,
    first_name: user.firstname,
    last_name: user.lastname,
    create_at:now,
    update_at:now
  };
  var result = user_md.addUser(user);

  result.then(function(data) {
      res.redirect("/admin/signin"); //conect to signin
    })
    .catch(function(err) {
      res.render("signup", { data: { error: "error" } });
    });
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
          console.log(req.session.user);
          res.redirect("/admin/");
        }
      });
      
      data.catch(function(){
        res.render("signin.ejs", { data: { error: "User not exists" } });
      });
    } 
  }
});
//direct to new post
router.get("/post/new",function(req,res){
  if(req.session.user){
    res.render("admin/post/new.ejs",{data:{error:false}});    
  }
  else{
    res.redirect("/admin/signin");
  }
});
//Insert post to DB
router.post ("/post/new",function(req,res){
  var params = req.body;

  if(params.title.trim().length==0){
    var data = {
      error:"Please enter a title!"
    }
    res.render("admin/post/new",{data:data});
  }
  else{
    var now = new Date();
    
      params.created_at = now;
      params.updated_at = now;
      var data = post_md.addPost(params);
      data.then(function(result){
        res.redirect("/admin");
      }).catch(function(err){
        var data ={
          error:"Could not insert to DB"
        };
        res.render("admin/post/new",{data:data});
      });
  }
});
//Edit post
router.get("/post/edit/:id",function(req,res){
  if(req.session.user)
  {
    var params = req.params;
    var id = params.id;
  
    var data = post_md.getPostById(id);
    console.log(data);
    if(data){
      data.then(function(posts){
        var post = posts[0];
        var data = {
          post:post,
          error:false
        };
        res.render("admin/post/edit",{data:data});
      }).catch(function(err){
        var data = {
          error: "Could not get Post by Id"
        };
        res.render("admin/post/edit",{data:data});
      });
    }
    else{
      var data = {
        error: "Could not get Post by Id"
      };
      res.render("admin/post/edit",{data:data});
    }
  }
  else{
    res.redirect("/admin/user");
  }
 
});
router.put("/post/edit",function(req,res){
  var params = req.body;
  data = post_md.updatePost(params);
  if(!data){
    res.json({status_code:500});
  }
  else{
    data.then(function(result){
      res.json({status_code:200});
    }).catch(function(err){
      res.json({status_code:500});
    });
  }
});
router.delete("/post/delete",function(req,res){
  var post_id = req.body.id;
  console.log("thang");
  var data = post_md.deletePost(post_id);

  if(!data){
    res.json({status_code:500});
  }
  else{
    data.then(function(result){
      res.json({status_code:200});
    }).catch(function(err){
      res.json({status_code:500});
    });
  }
});
router.get("/post",function(req,res){
  if(req.session.user){
    res.redirect("/admin");
  }
  else{
    res.redirect("/admin/signin");
  }
});
router.get("/user",function(req,res){
  if(req.session.user)
  {
    var data = user_md.getAllUsers();
    // console.log();
    data.then(function(users){
      var data= {
        users:users,
        error:false
      };
      res.render("admin/user",{data:data});
    }).catch(function(err){
      var data = {
        error:"Could not get user info"
      }
    });
  }
  else{
    res.redirect("/admin/signin");
  }

});
module.exports = router;
