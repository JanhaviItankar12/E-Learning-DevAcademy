import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router-dom"



export function Login() {
    const [loginInput, setLoginInput] = useState({ email: "", password: "",role:"student" });
    const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" ,role:"student"});
     
    const [registerUser,{data:registeredData,error:registeredError,isLoading:registeredLoading,isSuccess:registeredIsSuccess}]=useRegisterUserMutation();
    const [loginUser,{data:loginData,error:loginError,isLoading:loginIsLoading,isSuccess:loginIsSuccess}]=useLoginUserMutation();
    
    const navigate=useNavigate();

    const location=useLocation();
    const [tab,setTab]=useState("login");

    useEffect(()=>{
        if(location.state?.tab==="signup"){
            setTab("signup");
        }
    },[location.state]);

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        }
        else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    }

    const handleRegistration=async(type)=>{
        const inputData=type==="signup"?signupInput:loginInput;
        const action=type==="signup"?registerUser:loginUser;
        
        try {
            const result=await action(inputData).unwrap();
            
        } catch (error) {
            console.log("Error from  backend:",error);
        }
    }

    useEffect(()=>{ 
        if(registeredIsSuccess && registeredData){
            toast.success(registeredData.message || "Signup Successfully");
        }
        if(registeredError){
            toast.error(registeredError?.data?.message || "Signup Failed");
        }
        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login Successfully");
            navigate("/");
        }
        if(loginError){
            toast.error(loginError?.data?.message || "Login Failed");
        }

    },[loginIsLoading,loginData,registeredLoading,registeredData,loginError,registeredError])
    return (
        <div className="flex w-full items-center justify-center mt-25">
            <Tabs value={tab} onValueChange={setTab} className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-name">Name</Label>
                                <Input type="text" onChange={(e)=>changeInputHandler(e,"signup")} name="name" value={signupInput.name} id="tabs-demo-name" placeholder="Enter your name..." defaultValue="" required="true" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-email">Email</Label>
                                <Input id="tabs-demo-email" onChange={(e)=>changeInputHandler(e,"signup")} name="email" value={signupInput.email} type="email" placeholder="Enter your email..." defaultValue="" required="true" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new"> Password</Label>
                                <Input id="tabs-demo-new" onChange={(e)=>changeInputHandler(e,"signup")}  name="password" value={signupInput.password} type="password" placeholder="Ex.#Bxyz" required="true" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-role">Role</Label>
                                <select
                                    id="tabs-demo-role"
                                    name="role"
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    value={signupInput.role}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    
                                </select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registeredLoading} className={'cursor-pointer'} onClick={()=>handleRegistration("signup")}>
                                 {
                                 registeredLoading?(
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait...
                                    </>
                                 ) :"Sign Up"
                                }
                                </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here. After signup, you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-signedemail">Email</Label>
                                <Input id="tabs-demo-signed" onChange={(e)=>changeInputHandler(e,"login")} name="email" value={loginInput.email}  type="email" placeholder="Enter your email..." defaultValue="" required="true" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-signedPass"> Password</Label>
                                <Input id="tabs-demo-signedPass" onChange={(e)=>changeInputHandler(e,"login")}  name="password" value={loginInput.password}  type="password" placeholder="Ex.#Bxyz" required="true" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-role">Role</Label>
                                <select
                                    id="tabs-demo-role"
                                    name="role"
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    value={loginInput.role}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                </select>    
                                
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} className={'cursor-pointer'} onClick={()=>handleRegistration("login")} >
                                {
                                 loginIsLoading?(
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait...
                                    </>
                                 ) :"Login"
                                }
                                </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
