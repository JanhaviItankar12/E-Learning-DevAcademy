import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='flex'>
            <div className='hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] p-5 sticky top-0 h-screen '>
                <div className='mt-20 space-y-4 font-semibold text-lg'>
                    <Link to='dashboard' className='flex items-center gap-2 hover:text-blue-500'>
                        <ChartNoAxesColumn size={24}  />
                        <h1 >Dashboard</h1>

                    </Link>
                    <Link to='course' className='flex items-center gap-2 hover:text-blue-500'>
                        <SquareLibrary size={24}  />
                        <h1 >Courses</h1>
                    </Link>
                </div>

            </div>
            <div className={'flex-1 md:p-30 p-2 bg-white'}>
                <Outlet/>
            </div>
        </div>
    )
}

export default Sidebar