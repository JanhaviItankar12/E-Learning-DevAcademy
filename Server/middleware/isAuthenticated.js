import jwt from "jsonwebtoken";

const isAuthenticated= async(req,res,next)=>{
     try {
        const token=req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false
            })

        }
        const decode= await jwt.verify(token,process.env.secret_key);
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        }
        req.id=decode.userId;
        next();

     } catch (error) {
        
     } 
}

export default isAuthenticated;