import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useGetCourseProgressQuery } from '@/features/api/courseProgressApi';
import { CheckCircle2, CirclePlay } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';


const CourseProgress = () => {
    const isCompleted = true;
    const params = useParams();
    const courseId = params.courseId;
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

    const [currentLecture, setCurrentLecture] = useState(null);

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Failed to fetch course details</p>
    console.log(data);
    const { courseDetails, progress, completed } = data.data;
    const { courseTitle } = courseDetails;

    // inintialize the first lecture if not exist
    const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0]
    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            {/* display course name */}
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <Button>Completed</Button>
            </div>

            {/* video section */}
            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div className="w-full max-w-3xl aspect-video mx-auto">
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl}
                            controls
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>

                    {/* Display current watching title */}
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>{`Lecture ${courseDetails.lectures.findIndex((lecture)=>lecture._id===(currentLecture?._id || initialLecture._id))+1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`}</h3>
                    </div>
                </div>
                {/* lecture sideBar */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
                    <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
                    <div className='flex-1 overflow-y-auto'>
                        {
                            courseDetails?.lectures.map((lecture) => (
                                <Card key={lecture._id} className={"mb-3 hover:cursor-pointer transition transform "}>
                                    <CardContent className={'flex items-center justify-between p-4'}>
                                        <div className='flex items-center'>
                                            {
                                                isCompleted ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) :
                                                    (<CirclePlay size={24} className='text-gray-500 mr-2' />)
                                            }

                                            <div>
                                                <CardTitle className={'text-lg font-medium'}>{lecture.lectureTitle}</CardTitle>
                                            </div>
                                        </div>
                                        <Badge variant={'outline'} className={'bg-green-200 text-green-600'}>Completed</Badge>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CourseProgress