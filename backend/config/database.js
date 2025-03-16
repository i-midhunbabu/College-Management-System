const mongoose = require('mongoose');
function db(){
    mongoose.connect("mongodb://localhost:27017/college_management_system").then(()=>{
        console.log("Database: Connected");
        
    }).catch(err=>console.log(err)
    )
}
module.exports= db;