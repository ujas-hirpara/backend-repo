require("./config")
const cors = require("cors")
const signinDatas = require("./coollection")
const express = require("express")
const app = express()
const productData = require("./productcollection")
const mongoose = require("mongoose")
const multer = require("multer")
const cartData = require("./cartcollection")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const secretkey = "ujashirpara"

const counterSchema = new mongoose.Schema({
    Counter: {
        type: Number
    },
    productId: {
        type: Number
    }
})
const counterModel = mongoose.model("counters", counterSchema)

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

app.get("/userdata", (req, res) => {
    res.send({ name: "ujas" })
})

app.get("/profile/:index", async (req, res) => {
    const userdata = await signinDatas.findOne({ Index: req.params.index })
    res.send(userdata)
})

app.post("/login", async (req, res) => {
    try {
        const loginData = await signinDatas.findOne({ Email: req.body.Email })
        const savePassword = loginData.Password
        const currentPassword = req.body.Password
        let compare = await bcrypt.compare(currentPassword, savePassword)

        if (compare) {
            res.send(loginData)
        }
        else {
            res.send({ status: "noAuth" })
        }
    }
    catch (error) {
        res.send({ status: "noAuth" })
    }
})



app.post("/userdata", async (req, res) => {
const email = req.body.Email
const validate = validator.isEmail(email)
const emailExist = await signinDatas.find({Email:email})

    if(!validate){
       return res.json({message:"email not valid"})
    }
    else if(emailExist.length){
      return res.json({message:"email already exist"})
    }
    else{const token = jwt.sign(req.body.Email, secretkey)
        const counter = await counterModel.find()
        if (counter && !counter.length) {
            const newCountData = new counterModel({ Counter: 1, productId: 1 })
            await newCountData.save()
            console.log("xyz")
        }

        const autoCount = counter[0].Counter

        const addData = new signinDatas({
            Name: req.body.Name,
            Email: req.body.Email,
            Role: req.body.Role,
            Password: req.body.Password,
            Token: token,
            Index: autoCount
    })

    const newData = await addData.save()
    res.send(newData)
    count()}
})

async function count() {
    await counterModel.findOneAndUpdate({ $inc: { Counter: 1 } })
}


app.post("/addproduct", async (req, res) => {
    try {
        const counter = await counterModel.find()

        const productId = counter[0].productId
        const addProduct = new productData({
            productName: req.body.productName,
            Price: req.body.Price,
            Description: req.body.Description,
            Quantity: req.body.Quantity,
            productId: productId,
            adminId:req.body.adminId
        })
        const saveProduct = await addProduct.save()
        res.send(saveProduct)
        productCount()
    }
    catch (err) {
        res.send({ status: "error" })
    }
})

async function productCount() {
    await counterModel.findOneAndUpdate({ $inc: { productId: 1 } })
}


app.get("/showproduct", async (req, res) => {
    try {
        const showproduct = await productData.find()
        res.send(showproduct)
    } catch (error) {
        res.send({ status: "error" })
    }
})


app.post("/postCartProduct", async (req, res) => {
    try {
        const sameProduct = await cartData.find({ Index: req.body.Index, productId: req.body.id })

        if (sameProduct.length === 1) {
            res.send({ sameProduct: 1 })
            return;
        }

        const product = await productData.findOne({ productId: req.body.id })
        const addCart = new cartData({
            productName: product.productName,
            Price: product.Price,
            Description: product.Description,
            Index: req.body.Index,
            Quantity: product.Quantity,
            productId: req.body.id,
            payble:product.Price
        }); 
        const saveCart = await addCart.save()
        await productData.updateOne({productId: req.body.id},{$inc:{Quantity: -1}})
        res.send(saveCart)

    } catch (error) {
        res.send({ status: "error" })
    }
})

app.get("/getCartProduct/:index", async (req, res) => {
    const userCartData = await cartData.find({ Index: req.params.index })
    res.send(userCartData)
})

app.get("/totalProduct/:adminId", async (req, res) => {
    const productTotalCount = await productData.count()
    const adminProduct = await productData.find({adminId:req.params.adminId}).countDocuments()
    res.send({ count: productTotalCount , adminProduct})
})

app.post("/saveData", async (req, res) => {
    try {
        const findData = await cartData.find({_id:req.body.id})
        const productId = findData[0].productId
        const totalQuantity = findData[0].Quantity - req.body.number
        if(totalQuantity>=0){
        await productData.updateOne({productId},{$set:{Quantity:totalQuantity}})
        const updateProduct = await cartData.updateOne({_id:req.body.id},{$set :{cartQuantity:req.body.number,payble:req.body.payble}})
        res.send(updateProduct);
        }
        else{
            res.send({ status: "error" })
        }
    }
    catch (error) {
        console.log(error)
        res.send({ status: "error" })
    }
})

app.delete("/dropData/:_id/:productId",async (req,res)=>{
    const findData = await cartData.find({_id:req.params._id})
    const totalQuantity = findData[0].cartQuantity
    const findProduct  = await productData.find({productId:req.params.productId})
    const productQuantity = findProduct[0].Quantity + totalQuantity

    await productData.updateOne({productId:req.params.productId},{$set : {Quantity:productQuantity}})


    const dropData = await cartData.deleteOne({_id:req.params._id})
    res.send(dropData)
})
app.get("/findProduct/:productid",async (req,res)=>{
      const findProduct  = await productData.find({productId:req.params.productid})
      res.send(findProduct)
})


app.get("/adminTotalProduct/:adminId",async (req,res)=>{
    const adminProduct = await productData.find({adminId:req.params.adminId})
    res.send(adminProduct)
})

app.listen(4000, () => {
    console.log("port listen");
})