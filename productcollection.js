const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true
    },
    Description:{
        type:String,
        required:true,
        trim:true
    },
    Price:{
        type:Number,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    productId :{
        type:Number,
        required:true
    },
    adminId:{
        type:Number,
        required:true
    }
    
})


module.exports = mongoose.model("products",productSchema)