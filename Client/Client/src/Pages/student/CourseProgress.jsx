import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';


const CourseProgress = () => {
   
    const params = useParams();
    const courseId = params.courseId;
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
    
    const [updateLectureProgress]=useUpdateLectureProgressMutation();
    const [completeCourse,{data:markAsCompletedData,isSuccess:completedSuccess}]=useCompleteCourseMutation();
    const [incompleteCourse,{data:markAsInCompletedData,isSuccess:inCompletedSuccess}]=useIncompleteCourseMutation();
    
   
    
    const [currentLecture, setCurrentLecture] = useState(null);

    useEffect(() => {
        if (data?.data?.courseDetails?.lectures?.length && !currentLecture) {
            setCurrentLecture(data.data.courseDetails.lectures[0]);
        }
    }, [data, currentLecture]);
    
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Failed to fetch course details</p>
    if(!data?.data?.courseDetails?.lectures?.length) return <p>No lectures found for this course.</p>

    
    
    const { courseDetails, progress, completed } = data.data;
    const { courseTitle } = courseDetails;

    // inintialize the first lecture if not exist
    const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0]
    
    const isLectureCompleted=(lectureId)=>{
        return progress.some((prog)=>prog.lectureId===lectureId && prog.viewed) 
    }

    // handle select  a specific lecture to watch
    const handleSelectLecture=(lecture)=>{
        setCurrentLecture(lecture)
    }

    const handleLectureProgress=async(lectureId)=>{
         await updateLectureProgress({courseId,lectureId});
         refetch();
    }

    const handleCompleteCourse=async()=>{
       await completeCourse(courseId);
    }

    const handleInCompleteCourse=async()=>{
       await incompleteCourse(courseId);
    }

    useEffect(() => {
        if (completedSuccess) {
            toast.success(markAsCompletedData?.message || "Course marked as completed");
            refetch();
        }
        if (inCompletedSuccess) {
            toast.success(markAsInCompletedData?.message || "Course marked as incomplete");
            refetch();
        }
    },[completedSuccess, inCompletedSuccess, markAsCompletedData, markAsInCompletedData, refetch]);




    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            {/* display course name */}
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <Button variant={completed? "outline" :"default"} onClick={completed ? handleInCompleteCourse : handleCompleteCourse}>
                    {
                        completed? <div className='flex items-center'><CheckCircle className='h-4 w-4 mr-2'/><span>Completed</span> </div>:
                     "Mark as Completed"
            }

            </Button>
            </div>

            {/* video section */}
            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div className="w-full max-w-3xl aspect-video mx-auto">
                        <video
                            src={currentLecture?.videoUrl || initialLecture.videoUrl}
                            controls
                            className="w-full h-full object-contain rounded-lg"
                            onPlay={()=>handleLectureProgress(currentLecture?._id)}
                        />
                    </div>

                    {/* Display current watching title */}
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>{`Lecture ${courseDetails.lectures.findIndex((lecture)=>lecture._id===currentLecture?._id )+1} : ${currentLecture?.lectureTitle}`}</h3>
                    </div>
                </div>
                {/* lecture sideBar */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
                    <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
                    <div className='flex-1 overflow-y-auto'>
                        {
                            courseDetails?.lectures.map((lecture) => (
                                <Card key={lecture._id} onClick={()=>handleSelectLecture(lecture)} className={`mb-3 hover:cursor-pointer transition transform ${lecture._id===currentLecture?._id  ? 'bg-gray-200' :'dark:bg-gray-800'}`}>
                                    <CardContent className={'flex items-center justify-between p-4'}>
                                        <div className='flex items-center'>
                                            {
                                               isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) :
                                                    (<CirclePlay size={24} className='text-gray-500 mr-2' />)
                                            }

                                            <div>
                                                <CardTitle className={'text-lg font-medium'}>{lecture.lectureTitle}</CardTitle>
                                            </div>
                                        </div>
                                        {
                                            isLectureCompleted(lecture._id) && (
                                             <Badge variant={'outline'} className={'bg-green-200 text-green-600'}>Completed</Badge>
                                            )
                                        }
                                        
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