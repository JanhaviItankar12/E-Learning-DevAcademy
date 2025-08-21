import React, { useState } from 'react';
import { ArrowLeft, BadgeInfo, PlayCircle, Lock, Edit, Settings, Eye, BarChart3, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '@/features/api/courseApi';

const CoursePreview = () => {
    const navigate=useNavigate();
    
    const params=useParams();
    const courseId=params.courseId;
    
    const {data,isLoading}=useGetCourseByIdQuery(courseId);
    
    const course=data?.course;
    
    console.log(course);
   

    const handleViewAnalytics = () => {
        navigate(`/instructor/course/${courseId}/preview/analytics`);
    };

    

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Instructor Header - Shows this is preview mode */}
            <div className='bg-white dark:bg-gray-800 border-b shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button 
                                onClick={()=>navigate(-1)}
                                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                            >
                                <ArrowLeft className='h-5 w-5' />
                            </button>
                            <div>
                                <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>Course Preview</h1>
                                <p className='text-sm text-gray-500'>This is how students see your course</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button 
                                onClick={handleViewAnalytics}
                                className='flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors'
                            >
                                <BarChart3 className='h-4 w-4' />
                                Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content - Matches student view exactly */}
            <div className='mt-6 space-y-5'>
                {/* Header Section - Same as student view */}
                <div className='bg-[#2D2F31] text-white'>
                    <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                        <h1 className='font-bold text-2xl md:text-3xl'>{course?.courseTitle}</h1>
                        <p className='text-base md:text-lg'>{course?.subTitle}</p>
                        <p>Created By{" "} <span className='text-[#C0C4FC] underline italic'>{course?.creator?.name}</span></p>
                        <div className='flex items-center gap-2 text-sm'>
                            <BadgeInfo size={16} />
                            <p>Last updated {course?.createdAt.split("T")[0]}</p>
                        </div>
                        <p>Students enrolled: {course?.enrolledStudents.length}</p>
                    </div>
                </div>

                {/* Main Content Section - Same layout as student view */}
                <div className='max-w-7xl mx-auto px-4 md:px-8'>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        {/* Left Side - Description and Course Content */}
                        <div className='flex-1 lg:w-2/3 space-y-6'>
                            <div>
                                <h1 className='font-bold text-xl md:text-2xl mb-4'>Description</h1>
                                <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {course?.description}
                                </p>
                            </div>

                            {/* Course Content Card */}
                            <div className='bg-white dark:bg-gray-800 rounded-lg border shadow-sm'>
                                <div className='p-6 border-b'>
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Course Content</h3>
                                    <p className='text-sm text-gray-500 mt-1'>Total Lecture: {course?.lectures?.length}</p>
                                </div>
                                <div className='p-6 space-y-3'>
                                    {course?.lectures.map((lecture, index) => (
                                        <div key={index} className='flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded'>
                                            <span className='text-blue-600'>
                                                <PlayCircle size={16} />
                                            </span>
                                            <p className='text-lg text-gray-700 dark:text-gray-300'>{lecture?.lectureTitle}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Instructor Stats Card - Additional info for instructor */}
                            <div className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700 p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Instructor Overview</h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                                            {course?.enrolledStudents?.length}
                                        </div>
                                        <div className='text-sm text-gray-600 dark:text-gray-400'>Total Students</div>
                                    </div>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                            ₹{course?.coursePrice}
                                        </div>
                                        <div className='text-sm text-gray-600 dark:text-gray-400'>Course Price</div>
                                    </div>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                                            {course?.lectures?.length}
                                        </div>
                                        <div className='text-sm text-gray-600 dark:text-gray-400'>Total Lectures</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Video Player and Course Actions */}
                        <div className='lg:w-1/3 lg:min-w-[300px]'>
                            <div className='bg-white dark:bg-gray-800 rounded-lg border shadow-sm'>
                                <div className='p-4 flex flex-col'>
                                    <div className='w-full aspect-video mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                                        {course?.lectures[0]?.videoUrl ? (
                                            <div className='w-full h-full bg-black rounded-lg flex items-center justify-center'>
                                                <div className='text-white text-center'>
                                                    <PlayCircle className='h-12 w-12 mx-auto mb-2' />
                                                    <p className='text-sm'>Preview Video</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='text-gray-400 text-center'>
                                                <PlayCircle className='h-12 w-12 mx-auto mb-2' />
                                                <p className='text-sm'>No preview video</p>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className='font-medium text-gray-900 dark:text-white'>{course?.courseTitle}</h1>
                                    <div className='h-px bg-gray-200 dark:bg-gray-600 my-2'></div>
                                    <h1 className='text-lg md:text-xl font-semibold text-gray-900 dark:text-white'>Course Price: ₹ {course?.coursePrice}</h1>
                                </div>
                                
                                {/* Instructor Action Buttons */}
                                <div className='p-4 border-t space-y-3'>
                                   
                                    <button 
                                        onClick={handleViewAnalytics}
                                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                                    >
                                        <BarChart3 className='h-4 w-4' />
                                        View Analytics
                                    </button>
                                    
                                    <button 
                                        onClick={() => console.log('Navigate to students page')}
                                        className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                                    >
                                        <Users className='h-4 w-4' />
                                        View Students
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        

       
    );
};

export default CoursePreview;