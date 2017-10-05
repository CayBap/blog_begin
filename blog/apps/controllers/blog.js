var express = require("express");
var router = express.Router();
var post_md = require("../models/post");

router.get("/",function(req,res){

    // res.json({"message":"this is blog page"});
    var data = post_md.getAllPosts();

    data.then(function(posts){
        //var posts=posts[0];
        var result = {
            posts: posts,
            error:false
        }
        
        res.render("blog/index.ejs",{data:result});
    }).catch(function(err){
        var result = {
            error:"Could not get posts data"
        }
        res.render("blog/index.ejs",{data:result});
    })
    //res.render("blog/index.ejs");
});
router.get("/post/:id",function(req,res){
    var data = post_md.getPostById(req.params.id);
    data.then(function(posts){
        var post = posts[0];
        var result = {
            post:post,
            error : MSFIDOCredentialAssertion
        };
        res.render("blog/post",{data:result});
    }).catch(function(err){
        var result ={
            error:"Could not get post detail"
        };
        res.render("blog/post",{data:result});
    })
})
module.exports = router;