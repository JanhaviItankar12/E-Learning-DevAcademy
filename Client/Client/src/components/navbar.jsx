import { Menu, School } from 'lucide-react';
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import DarkMode from '../DarkMode';

import {
    Sheet,

    SheetContent,

    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedOutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';


const Navbar = () => {
    const navigate = useNavigate();

    const { user } = useSelector(store => store.auth);

    const [loggedOutUser, { data, isSuccess }] = useLoggedOutUserMutation();

    const logoutHandler = async () => {
        await loggedOutUser();
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User Log Out Successfully")
            navigate("/login");
        }
    }, [isSuccess])

    return (
        <div className='h-20 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* Desktop */}
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
                <div className='flex items-center gap-2'>
                    <School size={"30"} />
                    <Link to={'/'}>
                        <h1 className='hidden md:block font-extrabold text-2xl'>DevAcademy</h1>
                    </Link>
                </div>

                {/* User icons and dark mode icon */}
                <div className='flex items-center gap-8'>
                    {
                        user ?
                            (<DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        {/* Student Role Menu Items */}
                                        {user.role === "student" && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link to="my-learning">My Learning</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="profile">Edit Profile</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        {/* Instructor Role Menu Items */}
                                        {user.role === "instructor" && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link to="my-courses">My Courses</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="create-course">Create Course</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="earnings">Earnings / Students</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        {/* Admin Role Menu Items */}
                                        {user.role === "admin" && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link to="admin-dashboard">Admin Dashboard</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="manage-users">Manage Users</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="manage-courses">Manage Courses</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to="reports">Reports</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        
                                        
                                        {/* back button for home page */}
                                        <DropdownMenuItem>
                                            <Link to="/">Back to Home</Link>
                                        </DropdownMenuItem> 


                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logoutHandler}>
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>)
                            : (
                                <div className='flex items-center gap-2'>
                                    <Button onClick={() => navigate("/login", { state: { tab: "signup" } })} className={'cursor-pointer'}>Signup</Button>
                                    <Button variant="outline" onClick={() => navigate("/login")} className={'cursor-pointer'}>Login</Button>
                                </div>
                            )
                    }
                    <DarkMode />
                </div>
            </div>
            {/* Mobile Device */}
            {/* <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>DevAcademy</h1>
                <MobileNavbar />
            </div> */}
        </div>
    )
}

export default Navbar;

// const MobileNavbar = () => {
//     const role = "instructor";
//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <Button variant="outline" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-400">
//                     <Menu />
//                 </Button>
//             </SheetTrigger>
//             <SheetContent className="flex flex-col">
//                 <SheetHeader className="flex flex-row items-center justify-between mt-8">
//                     <SheetTitle> DevAcademy</SheetTitle>
//                     <DarkMode />
//                 </SheetHeader>
//                 <Separator className='mr-2' />
//                 <nav className='flex flex-col space-y-4 ml-4 text-lg'>
//                     <span>My Learning</span>
//                     <span>Edit Profile</span>
//                     <span>Log out</span>
//                 </nav>
//                 {
//                     role === "instructor" && (
//                         <SheetFooter>
//                             <Button type="submit">Dashboard</Button>

//                         </SheetFooter>
//                     )
//                 }

//             </SheetContent>
//         </Sheet>
//     )
// }