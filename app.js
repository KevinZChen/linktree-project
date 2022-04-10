const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const app = express();
// jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
//
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/linktreeDB")
//mongoose schema
const linksSchema ={
  name: String,
  url: String
};
//mongoose model (create collection)
const Link = mongoose.model("Link",linksSchema);


app.get("/", function(req, res){
  Link.find({},function(err, foundLinks){
    console.log(foundLinks)

    res.render("link",{newLinkUrl:foundLinks})
    });
  });

app.post("/", function(req,res){
  let linkUrl= req.body.url;
  let linkName=req.body.linkName;
  //mongoose document
  const link = new Link ({
    name:linkName,
    url: linkUrl
  });
  link.save()
  console.log("successfully saved to DB")
  res.redirect("/")
});

app.post("/delete",function(req,res){
  let checkedLinkId=req.body.trash;
  console.log(req.body.trash)
  Link.findByIdAndRemove(checkedLinkId,function(err){
    if (!err){
      console.log("Successfully deleted item")
    res.redirect("/")
    }
  });
});

app.post("/edit",function(req,res){
  let newLinkName= req.body.newLinkName
  let linkID=req.body.linkID
  console.log(req.body.linkID)

  Link.updateOne({_id:linkID},{name:newLinkName},function(err){
    if (err){
      console.log(err)
    }else{
      console.log("succesfully updated the document")
    }
  })
  res.redirect("/")
});
function appear(){
  document.getElementById("edit").style.display="block";
};

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
