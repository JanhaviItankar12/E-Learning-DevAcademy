import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Lecture from './Lecture'
import { toast } from 'sonner'

const CreateLecture = () => {

    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;

    const [lectureTitle, setLectureTitle] = useState("");

    const [createLecture, { data, isLoading, isSuccess, isError,error }] = useCreateLectureMutation();

    const { data: lectureData, isLoading: lectureLoading, Error: lectureError,refetch } = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data?.message || "Failed to create lecture");
        }
        if (isError) {
            console.log(isError?.data?.message);
            toast.error(error?.data?.message || "Failed to create lecture");
        }
    }, [isSuccess, isError,error]);

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-2xl'>Lets add lectures,add some basic details for your new lecture </h1>
                <p className='text-lg'>Easily expand your learning platform by adding a more lectures.</p>
                <div className='space-y-8 mt-8'>
                    <div className='space-y-2'>
                        <Label>
                            Title
                        </Label>
                        <Input type={'text'} value={lectureTitle} name='lectureTitle' onChange={(e) => setLectureTitle(e.target.value)} placeholder='Your Title Name' />
                    </div>

                    <div className='flex items-center gap-4 '>
                        <Button variant={'outline'} onClick={() => navigate(`/admin/course/${courseId}`)} className={'cursor-pointer'}>Back to Course</Button>
                        <Button disabled={isLoading} onClick={createLectureHandler} className={'cursor-pointer'} >
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait...
                                    </>
                                ) : "Create Lecture"
                            }

                        </Button>
                    </div>

                    {/* all lectures data */}
                    <div className='mt-10'>
                        {
                            lectureLoading ? <p>Loading Lectures...</p> : lectureError ? (<p>Failed to load lectures</p>) : lectureData.lectures.length === 0 ? <p>No Lecture available...</p> :( 
                            lectureData.lectures.map((lecture,index)=>(
                                <Lecture key={lecture._id} lecture={lecture} index={index}/>
                            ))
                            )
                        }

                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateLecture