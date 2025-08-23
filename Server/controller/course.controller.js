
import mongoose from "mongoose";
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
export const getEnrolledCourseOfUser = async (req, res) => {
    try {
        const userId = req.id;
        console.log(userId)
        const courses = await Course.find({ enrolledStudents: new mongoose.Types.ObjectId(userId) }).populate({ path: "creator", select: "name photoUrl" });

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
        const course = await Course.findById(courseId).populate({ path: "creator lectures", select: "name lectureTitle" });

        if (!course) {
            return res.status(404).json({
                message: "Course not found!"

            });
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
        const { courseId } = req.params;
        const { publish } = req.query;  //true,false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"

            })
        }
        //publish status based on the query parameter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status of course"

        })
    }
}


export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }

        //step 1:delete all referenced lectures
        await Lecture.deleteMany({ _id: { $in: course.lectures } });

        //step 2:delete course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course deleted Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove course"

        })
    }
}

export const getPublishedCourses = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "Courses not Found"
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

export const searchCourse = async (req, res) => {
    try {
        let { query = "", categories = [], sortByPrice = "" } = req.query;



        // fix:convert categories to array if it's string
        if (typeof categories === "string" && categories.length > 0) {
            categories = categories.split(",");
        }
        // create a search query
        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }

            ]
        };



        // if categories are selected
        if (categories.length > 0) {
            categories = categories.map(cat => cat.toLowerCase());
            searchCriteria.category = { $in: categories };
        }

        // if sort by price is selected
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1; // ascending order
        }

        if (sortByPrice === "high") {
            sortOptions.coursePrice = -1; // descending order
        }

        let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

        return res.status(200).json({
            courses: courses || [],
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to search courses"
        })
    }
}

// course Analytics
export const getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate("enrolledStudents", "name")
            .populate("reviews.student", "name")
            .populate("lectures");  //get full lectures

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // overview
        const totalRevenue = course.enrolledStudents.length * course.coursePrice;
        const totalStudents = course.enrolledStudents.length;
        const avgRating =
            course.reviews.length > 0
                ? (
                    course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
                ).toFixed(1)
                : 0;

        const completionRate =
            totalStudents > 0
                ? Math.round((course.completions.length / totalStudents) * 100)
                : 0;


        //lecture engagement
        const lectureEngagement = course.lectures.map((lec) => ({
            title: lec.title,
            views: lec.views,
            avgTime: lec.avgTime,
            dropOff: lec.dropOff
        }));

        //build monthly data dynamically
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // count enrollements per month
        const enrollmentsByMonth = {};
        course.enrolledStudents.forEach((enroll) => {
            const month = months[new Date(enroll.enrolledAt).getMonth()];
            enrollmentsByMonth[month] = (enrollmentsByMonth[month] || 0) + 1;
        });


        // Count completions per month
        const completionsByMonth = {};
        course.completions.forEach((comp) => {
            const month = months[new Date(comp.completedAt).getMonth()];
            completionsByMonth[month] = (completionsByMonth[month] || 0) + 1;
        });

        // construct final monthlyData
        const monthlyData = months.map((m) => ({
            month: m,
            enrollments: enrollmentsByMonth[m] || 0,
            completions: completionsByMonth[m] || 0,
            revenue: (enrollmentsByMonth[m] || 0) * course.coursePrice,
        }));

        //recent activity
        const recentActivity = [
            ...course.enrolledStudents.slice(-3).map((s) => ({
                type: "enrollment",
                student: s.name,
                time: "recently"
            })),
            ...course.completions.slice(-2).map((c) => ({
                type: "completion",
                student: c.student?.name || "Student",
                time: "recently",
            })),
            ...course.reviews.slice(-2).map((r) => ({
                type: "review",
                student: r.student?.name || "Student",
                rating: r.rating,
                time: "recently",
            })),
        ];

        res.json({
            overview: {
                totalRevenue,
                totalStudents,
                averageRating: avgRating,
                completionRate,
            },
            monthlyData,
            lectureEngagement,
            recentActivity
        });

    } catch (error) {

    }
}


//reviews section

export const addReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const { rating, comment } = req.body;

        if (!rating || !comment || !courseId) {
            return res.status(400).json({
                message: "All Fields are Reuired"
            })
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        //check if user already reviwed this course
        const alreadyReviewed =  course.reviews.find(
            (r) => r.student.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed this course" });
        }

        course.reviews.push({
            student: userId,
            rating,
            comment,
        });

        await course.save();
        res.status(201).json({
            message: "Review added Successfully",
            reviews: course.reviews
        });

    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { courseId, reviewId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const review = course.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.student.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to update this review" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await course.save();
        res.json({ message: "Review updated successfully", reviews: course.reviews });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { courseId, reviewId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const review = course.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.student.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        review.remove();
        await course.save();
        res.json({ message: "Review deleted successfully", reviews: course.reviews });
    } catch (error) {

    }
}







