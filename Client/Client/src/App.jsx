import { useState } from 'react'

import './App.css'
import { Login } from './Pages/Login'
import HeroSection from './Pages/student/HeroSection'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Courses from './Pages/student/Courses'
import MyLearning from './Pages/student/MyLearning'
import Profile from './Pages/student/Profile'
import Sidebar from './Pages/admin/Sidebar'
import Dashboard from './Pages/admin/Dashboard'
import CourseTable from './Pages/admin/course/CourseTable'
import AddCourse from './Pages/admin/course/AddCourse'
import EditCourse from './Pages/admin/course/EditCourse'
import CreateLecture from './Pages/admin/lecture/CreateLecture'
import EditLecture from './Pages/admin/lecture/EditLecture'
import CourseDetail from './Pages/student/CourseDetail'
import CourseProgress from './Pages/student/CourseProgress'


const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
      path:"/",
      element:
      <>
      <HeroSection/>
      <Courses/>
      
      </>
      },
      {
        path:"course-detail/:courseId",
        element:<CourseDetail/>
      },
      {
        path:"course-progress/:courseId",
        element:<CourseProgress/>
      },
     {
      path:"login",
      element:<Login/>
     },
     {
      path:"my-learning",
      element:<MyLearning/>
     },
     {
      path:"profile",
      element:<Profile/>
     },

     //admin routes start from here
     {
      path:"admin",
      element:<Sidebar/>,
      children:[
        {
          path:"dashboard",
          element:<Dashboard/>
        },
        {
          path:"course",
          element:<CourseTable/>
        },
         {
          path:"course/create",
          element:<AddCourse/>
        },
        {
          path:"course/:courseId",
          element:<EditCourse/>
        },
        {
          path:"course/:courseId/lecture",
          element:<CreateLecture/>
        },
        {
          path:"course/:courseId/lecture/:lectureId",
          element:<EditLecture/>
        },
      ]
     }
    ]
  }
])
function App() {
  

  return (
    <main>
      <RouterProvider router={appRouter}/>
    </main>
  )
}

export default App
