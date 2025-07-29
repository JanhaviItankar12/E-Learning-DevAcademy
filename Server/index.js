import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import cookieParser from "cookie-parser";
import cors from "cors";


//routes
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js";


dotenv.config();
const app=express();

//call database
connectDB();

const port=process.env.port || 5000;

//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


//apis
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/progress",courseProgressRoute);


app.listen(port,()=>{
    console.log(`Server listen at port ${port}`);
});