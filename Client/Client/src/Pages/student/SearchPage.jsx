import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle} from 'lucide-react'
import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import SearchResult from './SearchResult';
import Filter from './Filter';
import { useGetsearchCourseQueryQuery } from '@/features/api/courseApi';

const SearchPage = () => {
    const [searchParams]=useSearchParams();
    const query=searchParams.get('query');

    const [selectedCategories,setSelectedCategories]=useState([]);
    const [sortByPrice,setSortByPrice]=useState("");
    
    const handleFilterChange=(categories,price)=>{
        setSelectedCategories(categories);
        setSortByPrice(price);
    }
   
    
    const {data,isLoading}=useGetsearchCourseQueryQuery({
        searchQuery:query,
        categories:selectedCategories,
        sortByPrice
    });

    const isEmpty=!isLoading && data?.courses.length===0;

    
    return (
    <div className='max-w-7xl mx-auto  p-4 md:p-8 mt-9'>
        <div className='my-6'>
            <h1 className='font-bold text-xl md:text-2xl'>result for "{query}"</h1>
            <p>Showing results for {" "}

            <span className='text-blue-800 font-bold italic'>{query}</span>
            </p>
        </div>


        <div className='flex flex-col md:flex-row gap-10'>
           {/* filter side */}
           <Filter handleFilterChange={handleFilterChange}/>
           <div className='flex-1'>
             {
                isLoading? (
                    Array.from({length:3}).map((_,idx)=>(
                        <CourseSkeleton/>
                    ))
                ) :  isEmpty? (<CourseNotFound/>) :(
                    data?.courses.map((course)=>(
                        <SearchResult key={course._id} course={course}/>
                    ))
                )
             }
           </div>
        </div>

    </div>
  )
}

export default SearchPage


const CourseSkeleton=()=>{
    return(
        <div className='flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg shadow-sm'>
            <div className='h-32 w-full md:w-64'>
                <Skeleton className={'h-full w-full object-cover'}/>
            </div>

            <div className='flex-1 flex flex-col gap-2 px-4'>
                <Skeleton className='h-6 w-3/4'/>
                <Skeleton className='h-4 w-1/2'/>
                <div>
                    <Skeleton className='h-4 w-1/3'/>
                </div>
                <Skeleton className={'h-6 w-20 mt-2'}/>
                

            </div>

            <div className='flex flex-col items-end justify-between mt-4 md:mt-0'>
                <Skeleton className='h-6 w-12'/>

            </div>

        </div>
    )
}

const CourseNotFound=()=>{
    return(
       <div className='flex flex-col items-center justify-center h-64'>
        <AlertCircle className='text-red-500 h-16 w-16 mb-4'/>
         <h1 className='font-bold text-2xl text-gray-800'>Course Not Found</h1>
         <p className='text-lg text-gray-600 dark:text-gray-400 mb-2'>
            sorry, we couldn't find any courses matching your search criteria.
         </p>
         <Link to={'/'} className='italic text-blue-600 hover:text-blue-800'>
            Browse All Courses
         </Link>
       </div>
    )
}