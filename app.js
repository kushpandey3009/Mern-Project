const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const {Auth} = require('two-step-auth')
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);


const registerSchema = new mongoose.Schema({
  email:String,
  password:String,
});

const User = new mongoose.model("User", registerSchema);

let otp;
let user;

async function login(emailId){
  const resp = await Auth(emailId, "Company Name");
  console.log(resp);
  console.log(resp.mail);
   otp= resp.OTP;
  console.log(otp);
  console.log(resp.success);
}


app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.get("/submit", function(req,res){
res.render("submit")
});


app.post("/register", function(req,res){
  
  const email = req.body.email;  
  const password = req.body.password;
  User.findOne({email:email}, function(err, found){
    
    if(!err){   
      if(!found){
        user= new User({
          email:email,
          password:password
        });
        login(email);
        console.log(user);
        
        res.redirect("/submit");
      }    }
      else{
        res.redirect("/register");
      }
    });
  });
  
  
  app.post("/submit", function(req,res){
  
   
          if(req.body.number===otp){
            console.log(otp, req.body.number, req.body.email);
            User.insertOne({email:email , password:password});
          res.redirect("/");
          
          }
          else{
          res.redirect("/register");
        }
    
      }); 

app.post("/login", function(req,res){
  const loginemail = req.body.email;  
  const loginpassword = req.body.password;
  User.findOne({email:loginemail}, function(err, found){
    if(!err){
      if(found){

        console.log(found);
        res.redirect("/");
      }}
      else{
        res.redirect("/register");
      }
});
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});


