const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const{v4:uuidv4} = require("uuid");

const app = express();


const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential:admin.credential.cert(credentials)
})
const db = admin.firestore();



app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

const port = process.env.PORT||3000;


app.set('view engine','ejs');

//load assets

app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(session({
    secret:'uuidv4()',
    resave:false,
    saveUninitialized:true
}));

//home router
app.get('/',(req,res)=>{
    res.render('base',{title:"Netflix"});
  })
  
app.get("/views/signup.ejs", (req, res) => {
  res.render('signup')
});

app.get("/views/Dashboard.ejs", (req, res) => {
  res.render('Dashboard')
});

app.get("/signup", (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const password = req.query.password;
  db.collection('users')
    .add({
      name: firstname + lastname,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("base");
    });
});

app.get("/base", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;  
  db.collection('users')
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("Dashboard");
      }
      else {
        res.send("<h1>Login failed ,incorrect login credentials</h1>");
      }
    });
});
  
    

app.listen(port,()=>(console.log("Listening to the server on http://localhost:3000")));