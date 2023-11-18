const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sampleRegistration", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log("Connection Succesful!");
}).catch((err)=>{
    console.log(err);
})