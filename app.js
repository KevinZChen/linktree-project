const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const app = express();

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
  let linkUrl= req.body.newUrl;
  let linkName=req.body.newLinkName;
  //mongoose document
  const link = new Link ({
    name:linkName,
    url: linkUrl
  });
  link.save()
  console.log("successfully saved to DB")
  res.redirect("/")
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
