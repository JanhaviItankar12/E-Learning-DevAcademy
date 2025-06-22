import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import React from 'react'

const Course = () => {
    return (
        <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-0">
            <div className="aspect-w-16 aspect-h-4 overflow-hidden">
                <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20230803130836/HTML.webp"
                    alt="course"
                    className="w-full h-full object-cover align-top"
                />
            </div>
            <CardContent className="px-5 py-4 space-y-3">
                <h1 className="hover:underline font-bold text-lg truncate">HTML Complete Course</h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="font-medium text-sm">Patel Mernstack</h1>
                    </div>
                    <Badge className="bg-blue-600 text-white px-2 py-1 text-sm rounded-full">
                        Advance
                    </Badge>
                </div>
                <div>
                    <span className="text-lg font-bold">₹599</span>
                </div>
            </CardContent>
        </Card>


    )
}

export default Course;