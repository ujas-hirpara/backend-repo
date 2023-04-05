const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
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
    Index:{
        type:Number,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    productId:{
        type:Number,
        required:true
    },
    cartQuantity:{
        type:Number,
        default:1
    },
    payble:{
        type:Number,
        required:true
    }

})


module.exports = mongoose.model("cartProducts",cartSchema)