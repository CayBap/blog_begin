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