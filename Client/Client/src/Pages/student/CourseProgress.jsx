import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    CheckCircle, 
    CheckCircle2, 
    CirclePlay, 
    Star, 
    MessageSquare, 
    Edit,
    Trash2,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { useAddReviewsMutation, useDeleteReviewsMutation,  useUpdateReviewsMutation } from '@/features/api/courseApi';
import { useGetCurrentUserQuery } from '@/features/api/authApi';

const CourseProgress = () => {
    const params = useParams();
    const courseId = params.courseId;
   
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
    const {data:currentUserData} = useGetCurrentUserQuery();

    // Existing mutations
    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [completeCourse, { data: markAsCompletedData, isSuccess: completedSuccess, error: completedError }] = useCompleteCourseMutation();
    const [incompleteCourse, { data: markAsInCompletedData, isSuccess: inCompletedSuccess }] = useIncompleteCourseMutation();

    // Review mutations
    const [addReview, { isLoading: isAddingReview }] = useAddReviewsMutation();
    const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewsMutation();
    const [deleteReview, { isLoading: isDeletingReview }] = useDeleteReviewsMutation();

    // Existing state
    const [currentLecture, setCurrentLecture] = useState(null);

    // Review state
    const [showAddReview, setShowAddReview] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    // Mock user data - replace with actual user context
    const currentUser = {
        id: currentUserData?._id,
        name: currentUserData?.name,
        avatar: currentUserData?.photoUrl
    };

    // Set initial lecture when data loads
    useEffect(() => {
        if (data?.data?.courseDetails?.lectures?.length && !currentLecture) {
            setCurrentLecture(data.data.courseDetails.lectures[0]);
        }
    }, [data, currentLecture]);

    // Handle course completion status changes
    useEffect(() => {
        if (completedSuccess) {
            toast.success(markAsCompletedData?.message || "Course marked as completed");
            refetch();
        }
        if (completedError) {
            toast.error(completedError?.data?.message || 
                completedError?.error ||         
                "Complete all lectures before completion mark.")
        }
        if (inCompletedSuccess) {
            toast.success(markAsInCompletedData?.message || "Course marked as incomplete");
            refetch();
        }
    }, [completedSuccess, completedError, inCompletedSuccess, markAsCompletedData, markAsInCompletedData, refetch]);

    // Reset review form when user changes
    useEffect(() => {
        setShowAddReview(false);
        setEditingReview(null);
    }, [currentUser.id]);

    // Loading and error states
    if (isLoading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
    if (isError) return <div className="flex justify-center items-center h-64"><p>Failed to fetch course details</p></div>;
    if (!data?.data?.courseDetails?.lectures?.length) return <div className="flex justify-center items-center h-64"><p>No lectures found for this course.</p></div>;

    const { courseDetails, progress = [], completed} = data?.data;
    const { courseTitle } = courseDetails;
    const {reviews=[]}=courseDetails;
   
    

    // Calculate average rating and total ratings from reviews
    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0 
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalRatings 
        : 0;
    
    // Get current user's review
    const currentUserReview = reviews.find(review => review.student._id === currentUser.id);

    // Check if a lecture is completed
    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    };

    // Handle lecture progress update
    const handleLectureProgress = async (lectureId) => {
        try {
            await updateLectureProgress({ courseId, lectureId });
            refetch();
        } catch (error) {
            console.error('Error updating lecture progress:', error);
            toast.error('Failed to update lecture progress');
        }
    };

    // Handle selecting a specific lecture
    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
    };

    // Handle course completion
    const handleCompleteCourse = async () => {
        try {
            await completeCourse(courseId);
        } catch (error) {
            console.error('Error completing course:', error);
            toast.error('Failed to mark course as completed');
        }
    };

    // Handle course incompletion
    const handleInCompleteCourse = async () => {
        try {
            await incompleteCourse(courseId);
        } catch (error) {
            console.error('Error marking course as incomplete:', error);
            toast.error('Failed to mark course as incomplete');
        }
    };

    // Handle adding new review
    const handleAddReview = async () => {
        if (newRating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!newComment.trim()) {
            toast.error('Please add a comment');
            return;
        }
        
        try {
            const newReview=await addReview({ 
                courseId, 
                rating: newRating, 
                comment: newComment 
            }).unwrap();

            //optimistically update local reviews so button hides immediately

            data?.data.reviews.push({
                _id:newReview._id,
                student:{
                    _id:currentUser.id,
                    name:currentUser.name,
                    avatar:currentUser.avatar,
                },
                rating:newRating,
                comment:newComment,
                createdAt:new Date().toISOString(),
            });
            
            setNewRating(0);
            setNewComment('');
            setShowAddReview(false);
            toast.success('Review added successfully!');
            refetch();
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error(error.data?.message || 'Failed to add review');
        }
    };

    // Handle editing review
    const handleUpdateReview = async (reviewId) => {
        if (editRating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (!editComment.trim()) {
            toast.error('Please add a comment');
            return;
        }
        
        try {
            await updateReview({ 
                reviewId, 
                rating: editRating, 
                comment: editComment 
            }).unwrap();
            
            setEditingReview(null);
            setEditRating(0);
            setEditComment('');
            toast.success('Review updated successfully!');
            refetch();
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error(error.data?.message || 'Failed to update review');
        }
    };

    // Handle deleting review
    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId).unwrap();
            toast.success('Review deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(error.data?.message || 'Failed to delete review');
        }
    };

    // Start editing review
    const startEditReview = (review) => {
        setEditingReview(review._id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingReview(null);
        setEditRating(0);
        setEditComment('');
    };

    // Cancel adding review
    const cancelAddReview = () => {
        setShowAddReview(false);
        setNewRating(0);
        setNewComment('');
    };

    // Render star rating
    const renderStars = (rating, interactive = false, size = 20, onStarClick = null, onHover = null, onLeave = null) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${
                            star <= (interactive ? (hoverRating || rating) : rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
                        onMouseEnter={interactive && onHover ? () => onHover(star) : undefined}
                        onMouseLeave={interactive && onLeave ? () => onLeave() : undefined}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            {/* Course header */}
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            {renderStars(averageRating)}
                            <span className="text-sm text-gray-600">
                                {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    </div>
                </div>
                <Button
                    variant={completed ? "outline" : "default"}
                    onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
                >
                    {completed ? (
                        <div className='flex items-center'>
                            <CheckCircle className='h-4 w-4 mr-2' />
                            <span>Completed</span>
                        </div>
                    ) : (
                        "Mark as Completed"
                    )}
                </Button>
            </div>

            {/* Main content */}
            <div className='flex flex-col md:flex-row gap-6'>
                {/* Video section */}
                {currentLecture && (
                    <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                        <div className="w-full max-w-3xl aspect-video mx-auto">
                            <video
                                src={currentLecture.videoUrl}
                                controls
                                className="w-full h-full object-contain rounded-lg"
                                onEnded={() => handleLectureProgress(currentLecture._id)}
                                onError={(e) => {
                                    console.error('Video loading error:', e);
                                    toast.error('Failed to load video');
                                }}
                            />
                        </div>
                        {/* Current lecture title */}
                        <div className='mt-2'>
                            <h3 className='font-medium text-lg'>
                                {`Lecture ${courseDetails.lectures.findIndex((lecture) => lecture._id === currentLecture._id) + 1}: ${currentLecture.lectureTitle}`}
                            </h3>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-semibold">Reviews & Ratings</h4>
                                        {!currentUserReview && !showAddReview && (
                                            <Button 
                                                onClick={() => setShowAddReview(true)}
                                                size="sm"
                                                disabled={isAddingReview}
                                            >
                                                <Plus size={16} className="mr-2" />
                                                Add Review
                                            </Button>
                                        )}
                                    </div>

                                    {/* Add Review Form */}
                                    {showAddReview && (
                                        <Card className="mb-4 border-2 border-blue-200">
                                            <CardContent className="p-4">
                                                <h5 className="font-medium mb-3">Write a Review</h5>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">Rating</label>
                                                        {renderStars(
                                                            newRating, 
                                                            true, 
                                                            24,
                                                            setNewRating,
                                                            setHoverRating,
                                                            () => setHoverRating(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">Comment</label>
                                                        <Textarea
                                                            placeholder="Share your experience with this course..."
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={handleAddReview} 
                                                            size="sm"
                                                            disabled={isAddingReview}
                                                        >
                                                            {isAddingReview ? 'Submitting...' : 'Submit Review'}
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={cancelAddReview}
                                                            size="sm"
                                                            disabled={isAddingReview}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Reviews List */}
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="border rounded-lg p-3">
                                                {editingReview === review._id ? (
                                                    // Edit Review Form
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-sm font-medium mb-2 block">Rating</label>
                                                            {renderStars(
                                                                editRating, 
                                                                true, 
                                                                20,
                                                                setEditRating,
                                                                setHoverRating,
                                                                () => setHoverRating(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium mb-2 block">Comment</label>
                                                            <Textarea
                                                                value={editComment}
                                                                onChange={(e) => setEditComment(e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                size="sm" 
                                                                onClick={() => handleUpdateReview(review._id)}
                                                                disabled={isUpdatingReview}
                                                            >
                                                                {isUpdatingReview ? 'Updating...' : 'Update Review'}
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={cancelEdit}
                                                                disabled={isUpdatingReview}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Display Review
                                                    <>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="w-10 h-10">
                                                                    <AvatarImage src={review.student?.photoUrl} />
                                                                    <AvatarFallback>
                                                                        {review.student?.name?.charAt(0) || 'U'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{review.student?.name || 'Anonymous'}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {renderStars(review.rating, false, 16)}
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {review.student?._id === currentUser.id && (
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => startEditReview(review)}
                                                                        disabled={isDeletingReview}
                                                                    >
                                                                        <Edit size={14} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteReview(review._id)}
                                                                        disabled={isDeletingReview}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 ml-13">{review.comment}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {reviews.length === 0 && !showAddReview && (
                                            <div className="text-center py-8">
                                                <MessageSquare size={48} className="mx-auto text-gray-400 mb-2" />
                                                <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Lecture sidebar */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
                    <h2 className='font-semibold text-xl mb-4'>Course Lectures</h2>
                    <div className='flex-1 overflow-y-auto max-h-96'>
                        {courseDetails?.lectures?.map((lecture) => (
                            <Card
                                key={lecture._id}
                                onClick={() => handleSelectLecture(lecture)}
                                className={`mb-3 hover:cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    lecture._id === currentLecture?._id
                                        ? 'bg-gray-100 border-blue-300 dark:bg-gray-700'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <CardContent className='flex items-center justify-between p-4'>
                                    <div className='flex items-center flex-1'>
                                        {isLectureCompleted(lecture._id) ? (
                                            <CheckCircle2 size={24} className='text-green-500 mr-2 flex-shrink-0' />
                                        ) : (
                                            <CirclePlay size={24} className='text-gray-500 mr-2 flex-shrink-0' />
                                        )}
                                        <div className='flex-1 min-w-0'>
                                            <CardTitle className='text-lg font-medium truncate'>
                                                {lecture.lectureTitle}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture._id) && (
                                        <Badge variant='outline' className='bg-green-100 text-green-600 ml-2'>
                                            Completed
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;