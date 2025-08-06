import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
    const params = useParams();
    const courseId = params.courseId;
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [completeCourse, { data: markAsCompletedData, isSuccess: completedSuccess, error: completedError }] = useCompleteCourseMutation();
    const [incompleteCourse, { data: markAsInCompletedData, isSuccess: inCompletedSuccess }] = useIncompleteCourseMutation();

    const [currentLecture, setCurrentLecture] = useState(null);

    // Set initial lecture when data loads
    useEffect(() => {
        if (data?.data?.courseDetails?.lectures?.length && !currentLecture) {
            setCurrentLecture(data.data.courseDetails.lectures[0]);
        }
    }, [data, currentLecture]);

    // Handle course completion status changes
    useEffect(() => {
        if (completedSuccess) {
            toast.success(markAsCompletedData?.message || "Course marked as completed");
            refetch();
        }
        if (completedError) {
            toast.error(completedError?.data?.message || // RTK Query error format
                completedError?.error ||         // fallback
                "Complete all lectures before completion mark.")
        }
        if (inCompletedSuccess) {
            toast.success(markAsInCompletedData?.message || "Course marked as incomplete");
            refetch();
        }
    }, [completedSuccess, completedError, inCompletedSuccess, markAsCompletedData, markAsInCompletedData, refetch]);

    // Loading and error states
    if (isLoading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
    if (isError) return <div className="flex justify-center items-center h-64"><p>Failed to fetch course details</p></div>;
    if (!data?.data?.courseDetails?.lectures?.length) return <div className="flex justify-center items-center h-64"><p>No lectures found for this course.</p></div>;

    const { courseDetails, progress = [], completed } = data.data;
    const { courseTitle } = courseDetails;

    // Check if a lecture is completed
    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    };

    // Handle lecture progress update
    const handleLectureProgress = async (lectureId) => {
        try {
            await updateLectureProgress({ courseId, lectureId });
            refetch();
        } catch (error) {
            console.error('Error updating lecture progress:', error);
            toast.error('Failed to update lecture progress');
        }
    };

    // Handle selecting a specific lecture
    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);

    };



    // Handle course completion
    const handleCompleteCourse = async () => {
        try {
            await completeCourse(courseId);
        } catch (error) {
            console.error('Error completing course:', error);
            toast.error('Failed to mark course as completed');
        }
    };

    // Handle course incompletion
    const handleInCompleteCourse = async () => {
        try {
            await incompleteCourse(courseId);
        } catch (error) {
            console.error('Error marking course as incomplete:', error);
            toast.error('Failed to mark course as incomplete');
        }
    };

    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            {/* Course header */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <Button
                    variant={completed ? "outline" : "default"}
                    onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                >
                    {completed ? (
                        <div className='flex items-center'>
                            <CheckCircle className='h-4 w-4 mr-2' />
                            <span>Completed</span>
                        </div>
                    ) : (
                        "Mark as Completed"
                    )}
                </Button>
            </div>

            {/* Main content */}
            <div className='flex flex-col md:flex-row gap-6'>
                {/* Video section */}
                {currentLecture && (
                    <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                        <div className="w-full max-w-3xl aspect-video mx-auto">
                            <video
                                src={currentLecture.videoUrl}
                                controls
                                className="w-full h-full object-contain rounded-lg"
                                onEnded={() => handleLectureProgress(currentLecture._id)}
                                onError={(e) => {
                                    console.error('Video loading error:', e);
                                    toast.error('Failed to load video');
                                }}
                            />
                        </div>
                        {/* Current lecture title */}
                        <div className='mt-2'>
                            <h3 className='font-medium text-lg'>
                                {`Lecture ${courseDetails.lectures.findIndex((lecture) => lecture._id === currentLecture._id) + 1}: ${currentLecture.lectureTitle}`}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Lecture sidebar */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
                    <h2 className='font-semibold text-xl mb-4'>Course Lectures</h2>
                    <div className='flex-1 overflow-y-auto max-h-96'>
                        {courseDetails?.lectures?.map((lecture) => (
                            <Card
                                key={lecture._id}
                                onClick={() => handleSelectLecture(lecture)}
                                className={`mb-3 hover:cursor-pointer transition-all duration-200 hover:shadow-md ${lecture._id === currentLecture?._id
                                        ? 'bg-gray-100 border-blue-300 dark:bg-gray-700'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <CardContent className='flex items-center justify-between p-4'>
                                    <div className='flex items-center flex-1'>
                                        {isLectureCompleted(lecture._id) ? (
                                            <CheckCircle2 size={24} className='text-green-500 mr-2 flex-shrink-0' />
                                        ) : (
                                            <CirclePlay size={24} className='text-gray-500 mr-2 flex-shrink-0' />
                                        )}
                                        <div className='flex-1 min-w-0'>
                                            <CardTitle className='text-lg font-medium truncate'>
                                                {lecture.lectureTitle}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && (
                                        <Badge variant='outline' className='bg-green-100 text-green-600 ml-2'>
                                            Completed
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;