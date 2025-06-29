import BuyCourseButton from '@/components/BuyCourseButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetCourseByIdQuery } from '@/features/api/courseApi'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import { useParams } from 'react-router-dom'

const CourseDetail = () => {
    const params=useParams();
    const courseId=params.courseId;
    
   
    const {data,isLoading,isError}=useGetCourseByIdQuery(courseId);
    const course=data?.course;
    if(isLoading) return <p className='text-white'>Loadingcourse...</p>
    if(isError || !course) return <p className='text-red-500'>Failed to load course.</p>
    
    const purchasedCourse = false;
    return (
        <div className='mt-20 space-y-5'>
            {/* Header Section */}
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{course.courseTitle}</h1>
                    <p className='text-base md:text-lg'>{course.subTitle}</p>
                    <p>Created By{" "} <span className='text-[#C0C4FC] underline italic'>{course.creator.name}</span></p>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last updated 11-11-2024</p>
                    </div>
                    <p>Students enrolled: 10</p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className='max-w-7xl mx-auto px-4 md:px-8'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Side - Description and Course Content */}
                    <div className='flex-1 lg:w-2/3 space-y-6'>
                        <div>
                            <h1 className='font-bold text-xl md:text-2xl mb-4'>Description</h1>
                            <p className='text-lg text-gray-600 leading-relaxed'>
                                {course.description}
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className={'text-xl'}>Course Content</CardTitle>
                                <CardDescription>4 Lectures</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                {[1, 2, 3, 4].map((lecture, index) => (
                                    <div key={index} className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded'>
                                        <span className='text-blue-600'>
                                            {true ? (<PlayCircle size={16} />) : <Lock size={16} />}
                                        </span>
                                        <p className='text-lg'>Lecture title {lecture}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Video Player */}
                    <div className='lg:w-1/3 lg:min-w-[300px]'>
                        <Card>
                            <CardContent className='p-4 flex flex-col'>
                                <div className='w-full aspect-video  mb-4'>
                                    <p className='text-white text-sm'>React Player Video</p>
                                </div>

                                <h1>Lecture title</h1>
                                <Separator className={'my-2'} />
                                <h1 className='text-lg md:text-xl font-semibold'>Course Price</h1>

                            </CardContent>
                            <CardFooter className={'flex justify-center p-4'}>{
                                purchasedCourse ? (
                                    <Button className={'w-full bg-blue-600'}>Continue Course</Button>
                                ) : (
                                    <BuyCourseButton amount={course.coursePrice} courseId={course._id} />
                                )
                            }

                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail