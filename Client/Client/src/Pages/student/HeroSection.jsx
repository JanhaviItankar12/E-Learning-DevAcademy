import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const searchHandler = (e) => {
        e.preventDefault();
        if(searchQuery.trim()!== "") {
            navigate(`/course/search?query=${searchQuery}`);
        }
        searchQuery(""); // Clear the search input after submission
        
    }
    return (
        <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 to dark:to-gray-900 py-20 px-4 text-center'>
            <div className='max-w-3xl mx-auto mt-7'>
                <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for you</h1>
                <p className='text-gray-200 dark:text-gray-400 mb-8'>Empowering students with high-quality, accessible, and affordable online courses. Learn at your own pace, anytime, anywhere — from expert-led lessons to real-world skills, we help you succeed in your academic and career journey.</p>
                <form onSubmit={searchHandler} action="" className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-2xl w-full mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e)=> setSearchQuery(e.target.value)}
                        className="flex-grow bg-white dark:bg-gray-800 border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Search Courses..."
                    />
                    <Button type="submit" className="bg-blue-600 cursor-pointer dark:bg-blue-700 h-full text-white px-6 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
                        Search
                    </Button>
                    
                </form>
                <Button className="bg-white dark:bg-gray-800 text-blue-600 dark:text-gray-100 cursor-pointer rounded-full hover:bg-gray-200 mt-7" onClick={()=>navigate(`/course/search?query`)}>
                        Explore Courses
                </Button>

            </div>
        </div>
    )
}

export default HeroSection