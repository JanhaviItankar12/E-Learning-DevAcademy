import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SelectLabel } from '@radix-ui/react-select'
import React, { useEffect, useState } from 'react'

const Filter = ({ handleFilterChange }) => {

    const category = [
        { id: "NextJS", label: "NextJS" },
        { id: "ReactJs", label: "ReactJS" },
        { id: "Javascript", label: "Javascript" },
        { id: "HTML", label: "HTML" },
        { id: "CSS", label: "CSS" },
        { id: "NodeJS", label: "NodeJS" },
        { id: "ExpressJS", label: "ExpressJS" },
        { id: "MongoDB", label: "MongoDB" },
        { id: "Python", label: "Python" },
        { id: "Django", label: "Django" },
        { id: "Flask", label: "Flask" },
        { id: "Java", label: "Java" },
        { id: "SpringBoot", label: "Spring Boot" },
        { id: "PHP", label: "PHP" },
    ];

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    useEffect(() => {
        handleFilterChange(selectedCategories, sortByPrice);
    }, [selectedCategories, sortByPrice]);


    const handleCategoryChange = (categoryId) => {
        // Handle category change logic here
        setSelectedCategories((prevCategories) => {
             prevCategories.includes(categoryId) ? prevCategories.filter((id) => id !== categoryId) : [...prevCategories, categoryId];

        })
    }

    const selectByPriceHandler = (selectedValue) => {
        setSortByPrice(selectedValue);

    }
    return (
        <div className='w-full md:w-1/4'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>
                <Select onValueChange={selectByPriceHandler}>
                    <SelectTrigger>
                        <SelectValue placeholder={"Sort by"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort By Price</SelectLabel>
                            <SelectItem value="low">Low to High</SelectItem>
                            <SelectItem value="high">High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>


            </div>
            <Separator className={'my-4'} />

            <div>
                <h1 className='font-semibold md-2'>Category</h1>
                {
                    category.map((category) => (
                        <div className='flex items-center space-x-2 my-2'>
                            <Checkbox className="w-6 h-6" id={category.id} onCheckedChange={() => handleCategoryChange(category.id)} />
                            <Label className={'text-lg font-medium leading-none peer-disabled:cursor-not-allowed  peer-disabled:opacity-70'} htmlFor={category.id}>
                                {category.label}
                            </Label>

                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default Filter