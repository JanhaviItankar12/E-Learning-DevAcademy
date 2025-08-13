import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, useRemoveCourseMutation, useTogglePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {
  

  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: ""
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [editCourse, { data, isLoading, isSuccess, isError }] = useEditCourseMutation();
  const { data: courseByIdData, isLoading: courseByIdLoading,refetch } = useGetCourseByIdQuery(courseId);
  const [togglePublishCourse,{}]=useTogglePublishCourseMutation();
  const [removeCourse,{data:removeCourseData}]=useRemoveCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value })
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value })
  }
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value })
  }
  //get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  }


  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description || " ");
    console.log(input.description);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ formData, courseId });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated.")
    }
    if (isError) {
      toast.error(isError.data.message || "Failed to update");
    }
  }, [isSuccess, isError]);


  useEffect(() => {
    refetch();
    if (courseByIdData?.course) {
      const course = courseByIdData?.course;
      

     

      
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description:course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail
      })
    }
  }, [courseByIdData]);

  if (courseByIdLoading) return <h1>Loading...</h1>

  const publishStatusHandler=async(action)=>{
       try {
        const response=await togglePublishCourse({courseId,query:action});
        if(response.data){
         
          toast.success(response.data.message);
        }
       } catch (error) {
         toast.error("Failed to publish or unpublish course");
       }
  }

  const removeCourseHandler=async()=>{
    try {
        const result=await removeCourse(courseId);
        if(result.data){
          toast.success(result.data.message);
          navigate("/instructor/course");
        }
    } catch (error) {
      toast.error("Failed to remove course");
    }
     
      
  }

  return (
    <Card>
      <CardHeader className={'flex flex-row justify-between'}>
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className='space-x-4'>
          <Button variant={'outline'} disabled={courseByIdData?.course.lectures.length===0} className={'cursor-pointer'} onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished?"false" :"true")}>
            {
              (courseByIdData?.course.isPublished ? "Unpublished" : "Publish") 
            }
          </Button>
          <Button className={'mt-4 cursor-pointer'} onClick={removeCourseHandler}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4 mt-5'>
          <div className='space-y-3'>
            <Label>Title</Label>
            <Input
              type={'text'}
              name='courseTitle'
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex.Fullstack Developer"
            />
          </div>
          <div className='space-y-3'>
            <Label>SubTitle</Label>
            <Input
              type={'text'}
              name='subTitle'
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex.Become a Fullstack Developer from Zero to Hero"
            />
          </div>
          <div className='space-y-3'>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className='flex items-center gap-5'>
            <div className='space-y-3'>
              <Label>Category</Label>
              <Select onValueChange={selectCategory} value={input.category}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel >Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                    <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="Tailwind CSS">Tailwind CSS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-3'>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel >Course Level</SelectLabel>

                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-3'>
              <Label>Price in (INR)

              </Label>
              <Input type={'number'} name='coursePrice' value={input.coursePrice} onChange={changeEventHandler} placeholder='199' className={'w-fit'} />
            </div>

          </div>
          <div className='space-y-3'>
            <Label>Course Thunbnail</Label>
            <Input type={'file'} accept="image/*" className={'w-fit'} onChange={selectThumbnail} />
            {
              previewThumbnail && (
                <img src={previewThumbnail} alt="Course Thumbnail" className='w-64 my-2' />
              )
            }
          </div>
          <div className='flex items-center gap-2 mt-3'>
            <Button variant={'outline'} onClick={() => navigate('/instructor/course')}>Cancel</Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {
                isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait... </>
                ) : "Save"
              }</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseTab