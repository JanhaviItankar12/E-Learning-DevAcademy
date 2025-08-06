import React from 'react'
import Course from './Course';
import { useGetEnrolledCourseOfUserQuery } from '@/features/api/courseApi';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Filter } from 'lucide-react';


const MyLearning = () => {
   const isLoading = false;

   const { data } = useGetEnrolledCourseOfUserQuery();
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('all');

   const filteredCourses = data?.courses.filter(course =>
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilter === 'all' || course.category.toLowerCase() === selectedFilter.toLowerCase())
   ) || [];

   const stats = {
      totalCourses: data?.courses.length || 0,
   };

   return (
    <div className='min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 mt-14'>
      <div className='max-w-7xl mx-auto px-4 py-12 md:px-6'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3'>
              <BookOpen className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                My Learning Journey
              </h1>
              <p className='text-gray-600 dark:text-gray-400 text-lg'>Track your progress and continue learning</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            <div className='bg-white  dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700'>
              <div className='text-2xl font-bold text-blue-600'>{stats.totalCourses}</div>
              <div className='text-lg text-gray-600 dark:text-gray-400'>Total Courses</div>
            </div>
            
          </div>

          {/* Search and Filter */}
          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search your courses...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full text-lg pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300'
              />
            </div>
            <div className='relative'>
              <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className='pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 appearance-none'
              >
                <option value='all'>All Categories</option>
                <option value='programming'>Programming</option>
                <option value='design'>Design</option>
                <option value='ai/ml'>AI/ML</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div>
          {isLoading ? (
            <MyLearningSkeleton />
          ) : filteredCourses.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <div className='bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6'>
                <BookOpen className='w-16 h-16 text-gray-400' />
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                {searchTerm || selectedFilter !== 'all' ? 'No courses found' : 'Start Your Learning Journey'}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-center max-w-md mb-6'>
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You haven\'t enrolled in any courses yet. Explore our course catalog to begin learning!'
                }
              </p>
              {(!searchTerm && selectedFilter === 'all') && (
                <button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                  Browse Courses
                </button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredCourses.map((course, index) => (
                <Course key={course._id || index} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default MyLearning

//skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
    {[...Array(6)].map((_, index) => (
      <div key={index} className='bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden'>
        <Skeleton className="w-full h-48" />
        <div className='px-5 py-4 space-y-3'>
          <Skeleton className="h-6 w-3/4" />
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Skeleton className="h-6 w-6 rounded-full"/>
              <Skeleton className="h-4 w-20"/>
            </div>
            <Skeleton className="h-4 w-16"/>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className="h-8 w-8 rounded-full"/>
              <Skeleton className="h-4 w-24"/>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Skeleton className="h-3 w-16"/>
              <Skeleton className="h-3 w-8"/>
            </div>
            <Skeleton className="h-2.5 w-full rounded-full"/>
          </div>
          <Skeleton className="h-12 w-full"/>
        </div>
      </div>
    ))}
  </div>
);

