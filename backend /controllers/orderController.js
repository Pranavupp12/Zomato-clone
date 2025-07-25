import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const frontend_url = "http://localhost:5174"

//placing user order from frontend
const placeOrder = async(req,res)=>{
try {
    const newOrder = new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address
    })
    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})
    
    const line_items = req.body.items.map((item)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name || "Food item",
            },
            unit_amount:Math.round(item.price * 100)
        },
        quantity:item.quantity
    }))

    line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"delivery charges"
            },
            unit_amount:2000
        },
        quantity:1
    })

    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    })

    res.json({success:true,session_url:session.url})
} catch (error) {
     console.error("Order placement error:", error);
  res.status(500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
}
}

const verifyOrder = async(req,res)=>{
  const {orderId,success} = req.body;
  try {
    if (success=="true") {
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"paid"})
    }
    else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:true,message:"not paid"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
  }
}
//users order for frontend
const userOrder = async(req,res)=>{

 try {
    console.log(req.body.userId || "undefined");
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
 } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
 }
}

//listing orders for admin panel
const listOrders = async(req,res)=>{
    try {
    const orders = await orderModel.find({})
    res.json({success:true,data:orders})
    } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
    }
} 

//updating order status for admin

const updateStatus = async(req,res)=>{
    try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"status updated"})
    } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
    }
}

export {placeOrder,verifyOrder,userOrder,listOrders,updateStatus}