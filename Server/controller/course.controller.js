
import { Course } from "../models/course.model.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import { removeLecture } from "./lecture.controller.js";
import { Lecture } from "../models/lecture.model.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Couse title and category are required"

            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })
        return res.status(201).json({
            course,
            message: "Course Created"

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"

        })
    }
}

export const getAllCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found",
                courses: []

            })
        }
        return res.status(200).json({
            courses,

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to load courses"

        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, coursePrice, courseLevel, category } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"

            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId);  //delete old image
            }
            //upload thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = { courseTitle, subTitle, description, coursePrice, courseLevel, category, courseThumbnail: courseThumbnail?.secure_url };
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json({
            course,
            message: "Course updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit course"

        })
    }
};

//get enrolled course of user
export const getEnrolledCourseOfUser=async(req,res)=>{
    try {
       const userId = req.id;
       
       const courses=await Course.find({enrolledStudents:userId}).populate({path:"creator",select:"name photoUrl"});
        console.log(courses);
        return res.status(200).json({
            courses,
            message: "Fetched enrolled courses successfully"
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch enrolled courses"
        });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate({path:"creator",select:"name"});
       
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"

            })
        }
        return res.status(200).json({
            course

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id"

        })
    }
};

//publish and unpublish course logic
export const togglePublishCourse = async (req, res) => {
    try {
        const {courseId}=req.params;
        const {publish}=req.query;  //true,false
        const course=await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"

            })
        }
        //publish status based on the query parameter
        course.isPublished=publish==="true";
        await course.save();

        const statusMessage=course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status of course"

        })
    }
}


export const removeCourse=async (req,res) => {
      try {
        const {courseId}=req.params;
        const course=await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }

        //step 1:delete all referenced lectures
        await Lecture.deleteMany({_id:{$in:course.lectures}});
        
        //step 2:delete course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message:"Course deleted Successfully"
        })
        
      } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove course"

        })
      } 
}

export const getPublishedCourses=async (_,res) => {
    try {
       const courses=await Course.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"}) ;
       if(!courses){
        return res.status(404).json({
            message:"Courses not Found"
        })
       }
       return res.status(200).json({
        courses,

       })
    } catch (error) {
      console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"

        })  
    }
}

export const searchCourse=async(req,res)=>{
    try {
        let {query="",categories=[],sortByPrice=""}=req.query;

        console.log("query",query);
        console.log("categories",categories);
        console.log("sortByPrice",sortByPrice);
        
        // fix:convert categories to array if it's string
        if(typeof categories==="string" && categories.length>0){
            categories=categories.split(",");
        }
        // create a search query
        const searchCriteria={
            isPublished:true,
            $or:[
                {courseTitle:{$regex:query,$options:"i"}},
                {subTitle:{$regex:query,$options:"i"}},
                {categories:{$regex:query,$options:"i"}}
                
            ]
        };

        // if categories are selected
        if(categories.length>0){
            searchCriteria.category={$in:categories};
        }

        // if sort by price is selected
        const sortOptions={};
        if(sortByPrice==="low"){
            sortOptions.coursePrice=1; // ascending order
        }

        if(sortByPrice==="high"){
            sortOptions.coursePrice=-1; // descending order
        }

        let courses=await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            courses:courses || [],
            success:true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to search courses"
        })
    }
}


