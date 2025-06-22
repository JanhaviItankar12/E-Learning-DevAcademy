import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'

const AddCourse = () => {
  const navigate=useNavigate();
 

  const [courseTitle,setCourseTitle]=useState("");
  const [category,setCategory]=useState("");
  
  const [createCourse,{data,error,isSuccess,isLoading}]=useCreateCourseMutation();
  
  const getSelectedCategory=(value)=>{
    setCategory(value);
  }

  const createCourseHandler=async()=>{
    await createCourse({courseTitle,category});
  }

  //for displaying messsage
  useEffect(()=>{
   if(isSuccess) {
    toast.success(data.message || "Course created");
    navigate("/admin/course");
   }
  },[isSuccess,error])
  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4'>
        <h1 className='font-bold text-2xl'>Lets add course,add some basic course details for your new course </h1>
        <p className='text-lg'>Easily expand your learning platform by adding a new course. Provide the course title, description, category, and other details to make it available to students. Whether it's a beginner-friendly tutorial or an advanced module, start building your course today and help learners grow their skills!</p>
        <div className='space-y-8 mt-8'>
          <div className='space-y-2'>
            <Label>
              Title
            </Label>
            <Input type={'text'} value={courseTitle} name='courseTitle' onChange={(e)=>setCourseTitle(e.target.value)} placeholder='Your Course Name' />
          </div>
          <div  className='space-y-2'>
            <Label>
              Category
            </Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[180px]">
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
          <div className='flex items-center gap-2 '>
            <Button  variant={'outline'}  onClick={()=>navigate(-1)}>Back</Button>
             <Button disabled={isLoading} onClick={createCourseHandler} >
              {
                isLoading? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please Wait...
                  </>
                ) : "Create Course"
              }
              
              </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AddCourse