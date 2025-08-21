import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

export const getCourseProgress = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId=req.id;

        // step1:fetch the user course progress
        let courseProgress=await CourseProgress.findOne({courseId,userId}).populate("courseId");
        const courseDetails=await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({ message: "Course not found" });
        }

        // step-2: if no progress found,return courseDetails with an empty progress
        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }

        // step-3: if progress found,return courseDetails with progress
        return res.status(200).json({
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed
            }
        });

    } catch (error) {
        console.error("Error fetching course progress:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }


}



export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        // step1:fetch or create course progress
        let courseProgress=await CourseProgress.findOne({courseId,userId});
       if(!courseProgress){
        // if no progress exits then create a new record
            courseProgress=await CourseProgress.create({
                userId,
                courseId,
                completed:false,
                lectureProgress:[],
            });
           
        }
        // find the lecture progress in the course progress
         const lectureIndex= courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId===lectureId);
        if(lectureIndex!==-1){
            // if lecture already exist,update its viewed status
            courseProgress.lectureProgress[lectureIndex].viewed=true;
        }
        else{
            // add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            });
        }

        // if all lecture is completed,update the completed status
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=>lectureProg.viewed).length;
        
        const course=await Course.findById(courseId);
        if(course.lectures.length === lectureProgressLength){
            courseProgress.completed=true;
            
            //check if already marked completed to avoid duplicates
            const alreadyCompleted=course.completions.some(
                (c)=>c.student.toString()===userId.toString()
            );

            if(!alreadyCompleted){
                course.completions.push({
                    student:userId,
                    completedAt:new Date()
                });
            }
        }

        await courseProgress.save();
        await course.save();
        
        return res.status(200).json({
            message: "Lecture progress updated successfully"
           
        });
    } catch (error) {
        console.log("Error updating lecture progress:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const markAsCompleted=async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if (!courseProgress) {
            return res.status(404).json({ message: "You have completed the course" });
        }

        // check if all lectures are viewed
        const course=await Course.findById(courseId);
        const totalLectures = course.lectures.length;
        const viewedLectures = courseProgress.lectureProgress.filter((lecture) => lecture.viewed).length;


        if(viewedLectures<totalLectures){
             return res.status(400).json({ message: "You must complete all lectures before marking the course as completed." });
        }
       
        courseProgress.completed = true;
        await courseProgress.save();
        course.completions(userId);
        await course.save();
        return res.status(200).json({ message: "Course marked as completed successfully" });
    } catch (error) {
        console.error("Error marking course as completed:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const markAsInCompleted=async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        // Update the completed status
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({ message: "Course marked as Incompleted successfully" });
    } catch (error) {
        console.error("Error marking course as completed:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
};


//count completed course count

export const  CourseCompletedCount=async(req,res)=>{
  const {courseId}= req.params;
  const completedCount=await CourseProgress.countDocuments({
    courseId:courseId,
    completed:true
});
}





