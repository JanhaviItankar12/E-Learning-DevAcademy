import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideo } from "../utils/cloudinary.js";




export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Lecture title is required"
            });
        }
        //create lecture
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);

        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({
            lecture,
            message: "Lecture created Successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture"
        });
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        return res.status(200).json({
            lectures: course.lectures
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get all lectures of this course"
        });
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            })
        }

        //update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        //ensure the course still has  lecture id if was not already added
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit lecture "
        });
    }
}


export const removeLecture = async (req, res) => {
    try {
        const {lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found!"
            });
        }

        //delete the lecture from cloudinary
        if(lecture.publicId){
            await deleteVideo(lecture.publicId);
        }

        //deleted lecture from course
        await Course.updateOne(
            {lectures:lectureId},  //find the course who contain this lectureId
            {$pull:{lectures:lectureId}}  //delete lecture id from the lectures array
        )
         return res.status(200).json({
            success: true,
            message: "Lecture removed successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove lecture"
        });
    }
}


export const getLectureById=async(req,res)=>{
     try {
        const {lectureId}=req.params;
        const lecture=await Lecture.findById(lectureId);
        if(!lecture){
           return res.status(404).json({
            success: false,
            message: "Lecture not found!"
        }); 
        }
        return res.status(200).json({
            lecture,
            success:true
        })
        
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get lecture by its id"
        });
     }
}

