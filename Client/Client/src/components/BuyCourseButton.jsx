import React from 'react'
import { Button } from './ui/button'
import { useCreateOrderMutation, useVerifyOrderMutation } from '@/features/api/courseApi'
import { toast } from 'sonner';

const BuyCourseButton = ({courseId,amount}) => {
   const [createOrder,{}] =useCreateOrderMutation();
   const [verifyOrder,{}]=useVerifyOrderMutation();

   const handlePayment=async()=>{
    try {
       const order=await createOrder({courseId,amount});
       const orderData=order.data;
       
       
const options={
        key:"rzp_test_yFnMdlPgXudtkV",
        amount:orderData.amount,
        currency:orderData.currency,
        name:"DevAcademy",
        description:"Course Purchase",
        order_id:orderData.id,
        display_amount:orderData.amount,
         display_currency: "INR",
        handler:async (response) => {
           const verifyRes=await verifyOrder({courseId,response});
           
           const result=verifyRes;
           console.log(result);

           if(result.success){
            toast.success("Payment Done.");
           }
           else{
            toast.error("Payment Failed!");
           }
        },
        prefill:{
          name:"Janhavi Itankar",
          email:"itankarjanvi@gmail.com"
        },
        theme:{
          color:"#2D79F3"
        },
       };
      
      const rzp = new window.Razorpay(options);  //open the razorpay page for payment
      rzp.open(); 
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
    }
  return (
   <Button className={'w-full bg-blue-500'} onClick={handlePayment}>Purchase Course</Button>
  )
}

export default BuyCourseButton