import express from "express"
import cors from "cors"
import { connectDb } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express()
const port = 3000

//middleware

app.use(cors())
app.use(express.json())


//db connection
connectDb();

//api endpoint

//adding food item in db
app.use("/api/food",foodRouter)
//accessing images using filename
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`server started on http:\\localhost:${port}`)
})

//mongodb+srv://pranavuppal:Pranavupp12@cluster0.zblmudi.mongodb.net/?




