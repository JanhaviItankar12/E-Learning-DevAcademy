import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Dashboard = () => {
    return (

        <div className=" grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-900 shadow-md border rounded-xl ">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                        Total Sales
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>


    )
}

export default Dashboard