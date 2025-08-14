import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Edit, Eye, GraduationCap, Loader2, Plus, Save, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useGetCreatorCoursesQuery, useGetEnrolledCourseOfUserQuery } from '@/features/api/courseApi'


const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [photoUrl,setPhotoUrl]=useState("");

    const { data, isLoading, refetch } = useLoadUserQuery();
    const [updateUser, { data: updateUserdata, isLoading: updateUserisLoading, isError, isSuccess }] = useUpdateUserMutation();
    const { data: courseEnrolledData } = useGetEnrolledCourseOfUserQuery();
    const { data: createdCoursesData } = useGetCreatorCoursesQuery(); // Add this query for instructor's created courses

    useEffect(() => {
        if (data?.user?.name) {
            setName(data.user.name);
        }
    }, [data]);

    useEffect(()=>{
       if(data?.user?.photoUrl){
        setPhotoUrl(data.user.photoUrl);
       }
    },[data]);

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateUserdata?.message || "Profile Updated Successfully");
        }
        if (isError) {
            toast.error("Failed to Update UserProfile");
        }
    }, [isSuccess, isError, updateUserdata]);

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhoto(file);
            setPhotoUrl(URL.createObjectURL(file));
        }
    };

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
       
       try {
           const res= await updateUser(formData).unwrap();
           setPhotoUrl(res.user.photoUrl);
           setName(res.user.name);
           toast.success(res.message || "Profile updated successfully");
       } catch (error) {
           toast.error("Failed to update profile");
       } 


    }
    if (isLoading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <h1 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Profile...</h1>
                </div>
            </div>
        );
    }

    const { user } = data;
    

    return (
        <div className='min-h-screen bg-gradient-to-br mt-10  from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='text-center mb-12'>
                    
                    <p className='text-lg text-gray-600 dark:text-gray-300'>Manage your account and view your learning journey</p>
                </div>

                {/* Profile Card */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700'>
                    <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8'>
                        {/* Avatar Section */}
                        <div className='flex flex-col items-center'>
                            <div className='relative group'>
                                <Avatar className="h-32 w-32 mb-4 ring-4 ring-indigo-500 ring-offset-4 ring-offset-white dark:ring-offset-gray-800 transition-transform group-hover:scale-105">
                                    <AvatarImage src={user?.photoUrl}/>
                                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='absolute inset-0 rounded-full bg-black opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold mt-3 ${
                                user.role === 'instructor' 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                                {user.role.toUpperCase()}
                            </div>
                        </div>

                        {/* User Info Section */}
                        <div className='flex-1 space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                                        Full Name
                                    </label>
                                    <p className='text-xl font-semibold text-gray-900 dark:text-white'>{user.name}</p>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                                        Email Address
                                    </label>
                                    <p className='text-xl font-semibold text-gray-900 dark:text-white'>{user.email}</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8'>
                                <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                                    <div className='text-2xl font-bold'>
                                        {user.role === 'student' 
                                            ? courseEnrolledData?.courses?.length || 0
                                            : createdCoursesData?.courses?.length || 0
                                        }
                                    </div>
                                    <div className='text-blue-100 text-sm'>
                                        {user.role === 'student' ? 'Enrolled Courses' : 'Created Courses'}
                                    </div>
                                </div>
                               
                            </div>

                            {/* Edit Profile Button */}
                            <div className='pt-4'>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size='lg' className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                                            <Edit className='mr-2 h-4 w-4' />
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md'>
                                        <DialogHeader>
                                            <DialogTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
                                                Edit Profile
                                            </DialogTitle>
                                            <DialogDescription className='text-gray-600 dark:text-gray-300'>
                                                Update your profile information and photo
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='grid gap-6 py-4'>
                                            <div className='space-y-2'>
                                                <Label className='text-sm font-medium'>Full Name</Label>
                                                <Input 
                                                    type="text" 
                                                    placeholder='Enter your full name' 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)}
                                                    className='h-11'
                                                />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label className='text-sm font-medium'>Profile Photo</Label>
                                                <Input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={onChangeHandler}
                                                    className='h-11'
                                                />
                                                <p className='text-xs text-gray-500'>Upload a new profile photo (JPG, PNG)</p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button 
                                                disabled={updateUserisLoading} 
                                                onClick={updateUserHandler}
                                                className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                                            >
                                                {updateUserisLoading ? (
                                                    <>
                                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                        Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className='mr-2 h-4 w-4' />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700'>
                    {user.role === "student" ? (
                        <>
                            <div className='flex items-center mb-6'>
                                <BookOpen className='h-6 w-6 text-blue-500 mr-3' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Your Enrolled Courses
                                </h2>
                            </div>
                            {courseEnrolledData?.courses?.length > 0 ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {courseEnrolledData.courses.map((course) => (
                                        <div key={course._id} className='group'>
                                            <Course course={course} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-12'>
                                    <BookOpen className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                        No Enrolled Courses Yet
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-300 mb-6'>
                                        Start your learning journey by enrolling in courses
                                    </p>
                                    <Button className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'>
                                        Browse Courses
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='flex items-center mb-6'>
                                <GraduationCap className='h-6 w-6 text-purple-500 mr-3' />
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Your Created Courses
                                </h2>
                            </div>
                            {createdCoursesData?.courses?.length > 0 ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {createdCoursesData.courses.map((course) => (
                                        <div key={course._id} className='group'>
                                            <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2'>
                                                <div className='relative'>
                                                    <img 
                                                        src={course.courseThumbnail || '/api/placeholder/400/200'} 
                                                        alt={course.courseTitle}
                                                        className='w-full h-48 object-cover'
                                                    />
                                                    <div className='absolute top-4 right-4'>
                                                        <span className='bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                                                            Instructor
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='p-6'>
                                                    <h3 className='font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2'>
                                                        {course.courseTitle}
                                                    </h3>
                                                    <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
                                                        {course.subTitle || 'Course description goes here...'}
                                                    </p>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                                                             ₹ {course.coursePrice || '0'}
                                                        </span>
                                                        <div className='flex items-center text-sm text-gray-500'>
                                                            <Users className='h-4 w-4 mr-1' />
                                                            {course.enrolledStudents?.length || 0} students
                                                        </div>
                                                    </div>
                                                    <div className='mt-4 flex gap-2'>
                                                        <Button size='sm' variant='outline' className='flex-1'>
                                                            <Edit className='h-4 w-4 mr-1' />
                                                            Edit
                                                        </Button>
                                                        <Button size='sm' className='flex-1 bg-purple-500 hover:bg-purple-600'>
                                                            <Eye className='h-4 w-4 mr-1' />
                                                            View
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-12'>
                                    <GraduationCap className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                        No Courses Created Yet
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-300 mb-6'>
                                        Share your knowledge by creating your first course
                                    </p>
                                    <Button className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'>
                                        <Plus className='h-4 w-4 mr-2' />
                                        Create Course
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;