const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const stdregschema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    gender:{
        type:String,
        required: true,
       
    },
    phone:{
        type:Number,
        required: true,
        unique:true
    },
    age:{
        type:Number,
        required: true,
      
    },
    password:{
        type:String,
        required: true
    },
    confirmpassword:{
        type:String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
});

//generating token
stdregschema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = await jwt.sign({_id:this._id}, "mynameissatwickdeepvermacsestudenthelloeveryone");
        console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        console.log("the error page" + error);
    }
}

//hashing password
stdregschema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await  bcrypt.hash(this.password, 10);
        this.confirmpassword =  await  bcrypt.hash(this.password, 10);
    }
    next();
})

const RegisterStd = new mongoose.model("Register", stdregschema);

module.exports = RegisterStd;

