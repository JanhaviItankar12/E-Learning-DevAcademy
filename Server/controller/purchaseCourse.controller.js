import Razorpay from 'razorpay';
import crypto from 'crypto';


const razorpay=new Razorpay({
    key_id:process.env.test_key_id,
    key_secret:process.env.test_secret_key
});

//create order on razorpay
export const createOrder=async(req,res)=>{
    try {
      const {amount}   =req.body;

      const options={
        amount:amount*100,  //amt in paise
        currency:"INR",
        receipt:"receipt_order_"+Date.now(),
      };

      const order=await razorpay.orders.create(options);
      return res.status(200).json(order);
    } catch (error) {
       console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create order"
        }); 
    }
}

//verify payment signature
export const verifyOrder=async (req,res) => {
    try {
      
      const {razorpay_order_id,razorpay_payment_id,razorpay_signature}  =req.body.response;
      
      const sign=razorpay_order_id+"|"+razorpay_payment_id;
      const expectedSign=crypto
      .createHmac("sha256",process.env.test_secret_key)
      .update(sign.toString())
      .digest("hex");
      console.log(expectedSign,razorpay_signature);
       if (expectedSign.trim() === razorpay_signature.trim()) {
      return res.status(200).json({
        success: true,
        message: "Grant Course access",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not verified",
      });
    }
    } catch (error) {
       console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify order"
        }); 
    }
    
}