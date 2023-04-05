const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const signSchema = new mongoose.Schema({
    Name :{
        type:String,
        required:true,
        trim:true
    },
    Email :{
        type:String,
        required:true,
        trim:true
    },
    Role:{
        type:String,
        required:true
    },
    Password :{
        type:String,
        required:true,
        trim:true
    },
    Token:{
        type :String,
        required : true
    },
    Index :{
        type:Number
    }
})

signSchema.pre("save", async function func(next) {
    console.log("password",this.Password)
    this.Password = await bcrypt.hash(this.Password,8)
    console.log("encrypt password",this.Password)
    next()
})

module.exports = mongoose.model("signindatas",signSchema)