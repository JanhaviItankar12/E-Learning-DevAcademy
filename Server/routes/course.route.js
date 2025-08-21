import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCourse, editCourse, getAllCreatorCourses, getCourseAnalytics, getCourseById, getEnrolledCourseOfUser, getPublishedCourses, removeCourse, searchCourse, togglePublishCourse } from "../controller/course.controller.js";
import { createLecture, editLecture, getCourseLecture, getLectureById, removeLecture } from "../controller/lecture.controller.js";
import upload from "../utils/multer.js";
import { createOrder, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, verifyOrder } from "../controller/purchaseCourse.controller.js";

const router=express.Router();

router.route("/").post(isAuthenticated,createCourse);

// public route
router.route("/search").get(isAuthenticated,searchCourse)
router.route("/published-courses").get(getPublishedCourses);
router.route("/").get(isAuthenticated,getAllCreatorCourses);

// private route
// route for  getting user enrolled courses
router.route("/getEnrolledCourse").get(isAuthenticated,getEnrolledCourseOfUser);

router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId").delete(isAuthenticated,removeCourse);



//lectures
router.route("/:courseId/lecture").post(isAuthenticated,createLecture);
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);


//published and unpublished course
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse);

//purchase course
router.route("/:courseId/purchase").post(isAuthenticated,createOrder);
router.route("/:courseId/purchase/verify").post(isAuthenticated,verifyOrder);

// it must visible to all users
router.route("/:courseId/detail-with-status").get(getCourseDetailWithPurchaseStatus);


router.route("/:courseId/allPurchasedCourse").get(isAuthenticated,getAllPurchasedCourses);


// course analytics
router.route("/:courseId/analytics").get(isAuthenticated,getCourseAnalytics);
export default router;