import {User} from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";


//for signup
export const register=async(req,res)=>{
    try {
       
        const {name,email,password,role}=req.body;
       
        
        if(!name || !email || !password || !role){
            return res.status(400).json(
                {
                    success:false,
                    message:"All Fields are required."
                }
            )
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exist with this email"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedPassword,
            role
        })
        return res.status(201).json({
            success:true,
            message:"User registered successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        });
    }
}

//for login
export const login=async(req,res)=>{
    try {
        const {email,password,role}=req.body;
        if(!email || !password || !role){
            return res.status(400).json(
                {
                    success:false,
                    message:"All Fields are required."
                }
            )
        }
        const user=await User.findOne({email}).select('+password');
        
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email"
            }) 
        }
        
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }

        //check for role
        if(user.role!==role){
            return res.status(403).json({
                success:false,
                message:"Please select the correct role to login"
            })
        }
    generateToken(res,user,`Welcome back ${user.name}`); 
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        });
    }
    

}

export const logout=async(_,res)=>{
     try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
           message :"Logged out Successfully",
           success:true

        });
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Logout"
        });
     }
}


export const getUserProfile=async(req,res)=>{
    try {
       const userId=req.id;
       const user=await User.findById(userId).select("-password");
       if(!user){
        return res.status(404).json({
            success:false,
            message:"Profile Not Found"
        });
        
       }
       return res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Load User"
        });
    }
}


export const updateProfile=async(req,res)=>{
    try {
        const userId=req.id;
        const {name}=req.body;
        const profilePhoto=req.file;

        const user=await User.findById(userId);
         if(!user){
        return res.status(404).json({
            success:false,
            message:"User Not Found"
        });
        
       }

       //extract public id of old image from url if it exist
       if(user.photoUrl){
        const publicId=user.photoUrl.split("/").pop().split(".")[0]  //extract public id
        deleteMedia(publicId);
       }
       
       //upload new photourl
       const cloudResponse=await uploadMedia(profilePhoto.path);
       const photoUrl=cloudResponse.secure_url;
       const updatedData={name,photoUrl};
       const updatedUser=await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
       return res.status(200).json({
        success:true,
        user:updatedUser,
        message:"Profile updated Successfully"
       });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Update Profile"
        }); 
    }
}
