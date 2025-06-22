import BuyCourseButton from '@/components/BuyCourseButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'

const CourseDetail = () => {
    const purchasedCourse = false;
    return (
        <div className='mt-20 space-y-5'>
            {/* Header Section */}
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>Course Title</h1>
                    <p className='text-base md:text-lg'>Course Sub-title</p>
                    <p>Created By{" "} <span className='text-[#C0C4FC] underline italic'>Patel MemStack</span></p>
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
                                This comprehensive course is designed for developers who want to learn how to build robust,
                                production-ready web applications using Next.js. You will master server-side rendering, static site
                                generation, API routes, dynamic routing, and much more. By the end of this course, you will be
                                able to create both flexible and fast web applications with ease.
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
                                    <BuyCourseButton />
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