import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'


 


const CourseTable = () => {
  const {data,isLoading}=useGetCreatorCoursesQuery();
  const navigate=useNavigate();

  if(isLoading || !data) return <h1>Loading...</h1>
  
  return (
    <div>
      <Button onClick={()=>navigate('create')}>Create a new Course</Button>
      
        <Table className={'mt-10'}>
          <TableCaption>A list of your recent courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">{course.courseTitle}</TableCell>
                <TableCell>{course?.coursePrice || "NA"}</TableCell>
                <TableCell><Badge>{course.isPublished? "Published" : "Draft"}</Badge></TableCell>
                <TableCell className="text-right"><Button size='sm' onClick={()=>navigate(`${course._id}`)} variant={'ghost'}><Edit/></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
         
        </Table>
      </div>

   
  )
}

export default CourseTable