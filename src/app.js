const express = require("express");
require("./db/connection");
const RegisterStd = require("./models/registerSchema");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");

const app =  express();
const port =  process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialtePath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialtePath);

app.get("/", (req, res)=>{
    res.render("index");
});
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/register", (req, res)=>{
    res.render("register");
});


//Registrtion form funtion
app.post("/register", async (req, res)=>{
    try{
        const password =  req.body.password;
        const cpassword = req.body.confirmpassword;
      
        if(password === cpassword){
            const registerStudent = new RegisterStd({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            });

            const token  =  registerStudent.generateAuthToken();
            console.log(`the token is ${token}`);

            const registered = await registerStudent.save();
            
            res.status(201).render("index");
        }
        else{
            res.send("password doesn't match!");
        }
    }catch(err){
        res.status(401).send(err);
    }
})


//login form function
app.post("/login", async (req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const usermail = await RegisterStd.findOne({email:email});
        const isMatch =  await bcrypt.compare(password, usermail.password);

        const token  =  usermail.generateAuthToken();
        console.log(`the token is ${token}`);
        if(isMatch)
            res.status(201).render("index");
        else
            res.send("password is wrong")
    }catch(error){
        res.status(400).send("invalid confidentials");        
    }
})

app.listen(port, ()=>{
    console.log(`live at ${port} port`);
    
})





