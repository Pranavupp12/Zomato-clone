import mongoose from "mongoose"

 export const connectDb = async () =>{
    await mongoose.connect('mongodb+srv://pranavuppal:Pranavupp12@cluster0.zblmudi.mongodb.net/TOMATO').then(()=>console.log("database connected"));
}