import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const course_api = "http://localhost:8080/api/v1/course/";

export const courseApi = createApi({
  reducerPath: 'courseApi',
  tagTypes: ['Refetch_Creator_Course', "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: course_api,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category }
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),
    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET"
      }),
      providesTags: ['Refetch_Creator_Course']
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),

    // get enrolled course by user
    getEnrolledCourseOfUser:builder.query({
       query:()=>({
        url:"/getEnrolledCourse",
        method:"GET"
       })
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET"
      }),
      providesTags: ['Refetch_Creator_Course']
    }),

    //create lectures
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle }
      })
    }),

    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ['Refetch_Lecture']
    }),

    editLecture: builder.mutation({
      query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree }
      })
    }),
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Refetch_Lecture']
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET"
      })
    }),

    //publish and unpublish course
    togglePublishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH"
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),

    removeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),

    getPublishedCourses: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET"
      })
    }),

    //course purchase--
    createOrder: builder.mutation({
      query: ({ courseId, amount }) => ({
        url: `/${courseId}/purchase`,
        method: "POST",
        body: { amount }
      })
    }),

    //verify order
    verifyOrder: builder.mutation({
      query: ({ courseId, response, amount }) => ({
        url: `/${courseId}/purchase/verify`,
        method: "POST",
        body: { response, amount }
      })
    }),

    //course detail with status
    getCourseDetailWithPurchaseStatus: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),


    //get all purchased courses
    getAllPurchasedCourses: builder.query({
      query: ( courseId ) => ({
        url: `/${courseId}/allPurchasedCourse`,
        method: "Get"
      })
    }),

    // get search courses
    getsearchCourseQuery: builder.query({
      query:({searchQuery,categories,sortByPrice})=>{
        // build query String
        let queryString=`/search?query=${encodeURIComponent( searchQuery)}`
        
        // append categories if provided
        if(categories && categories.length>0){
            const categoriesString=categories.map(category=>encodeURIComponent(category)).join(",");    
            queryString+=`&categories=${categoriesString}`;
          }

          // append sortByPrice if provided
          if(sortByPrice){
            queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`;
          }

          return{
            url:queryString,
            method:"GET"
          }
        
      }

      
    })
})
});

export const {
  useCreateCourseMutation,
  useGetCreatorCoursesQuery,
  useEditCourseMutation,
  useGetEnrolledCourseOfUserQuery,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  useTogglePublishCourseMutation,
  useRemoveCourseMutation,
  useGetPublishedCoursesQuery,
  useCreateOrderMutation,
  useVerifyOrderMutation,
  useGetAllPurchasedCoursesQuery,
  useGetCourseDetailWithPurchaseStatusQuery,
  useGetsearchCourseQueryQuery
} = courseApi

