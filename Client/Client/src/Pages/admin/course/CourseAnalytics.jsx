import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, PlayCircle, Star, Eye, Calendar, Download, IndianRupee } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { data, useNavigate, useParams } from 'react-router-dom';
import { useGetCourseAnalyticsQuery } from '@/features/api/courseApi';

// Register Chart.js components
Chart.register(...registerables);

const CourseAnalytics = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    
    const params = useParams();
    const courseId = params.courseId;
    const navigate=useNavigate();

    const { data: analyticsData, isAnalyticsLoading } = useGetCourseAnalyticsQuery(courseId);
     
    console.log(analyticsData);

    if (isAnalyticsLoading) {
        return <p className="text-center text-gray-500">Loading analytics...</p>;
    }
    const course = data?.course;


    // Refs for chart canvases
    const revenueChartRef = useRef(null);
    const ratingChartRef = useRef(null);
    const engagementChartRef = useRef(null);

    useEffect(() => {
        // Destroy existing charts if they exist
        let revenueChartInstance = null;
        let ratingChartInstance = null;
        let engagementChartInstance = null;

        if (revenueChartRef.current && analyticsData) {
            revenueChartInstance = new Chart(revenueChartRef.current, {
                type: 'bar',
                data: {
                    labels: analyticsData.monthlyData.map(item => item.month),
                    datasets: [
                        {
                            label: 'Revenue (₹)',
                            data: analyticsData.monthlyData.map(item => item.revenue),
                            backgroundColor: 'rgba(59, 130, 246, 0.7)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Enrollments',
                            data: analyticsData.monthlyData.map(item => item.enrollments),
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1,
                            type: 'line',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Revenue (₹)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false,
                            },
                            title: {
                                display: true,
                                text: 'Enrollments'
                            }
                        }
                    }
                }
            });
        }

        if (ratingChartRef.current && analyticsData) {
            ratingChartInstance = new Chart(ratingChartRef.current, {
                type: 'doughnut',
                data: {
                    labels:analyticsData.monthlyData.map,
                    datasets: [{
                        data: [65, 25, 5, 3, 2], // Mock distribution
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 99, 132, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Rating Distribution'
                        }
                    }
                }
            });
        }

        if (engagementChartRef.current) {
            engagementChartInstance = new Chart(engagementChartRef.current, {
                type: 'radar',
                data: {
                    labels: analyticsData?.lectureEngagement.map(item => item.title),
                    datasets: [{
                        label: 'Lecture Engagement',
                        data: analyticsData?.lectureEngagement.map(item => 100 - item.dropOff),
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(79, 70, 229, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 50,
                            suggestedMax: 100
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Lecture Completion Rates (%)'
                        }
                    }
                }
            });
        }

        // Cleanup function to destroy charts when component unmounts
        return () => {
            if (revenueChartInstance) revenueChartInstance.destroy();
            if (ratingChartInstance) ratingChartInstance.destroy();
            if (engagementChartInstance) engagementChartInstance.destroy();
        };
    }, [selectedPeriod]); // Re-run effect when period changes

    const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>{title}</p>
                    <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
                    {trend && (
                        <div className='flex items-center mt-2 text-sm'>
                            <TrendingUp className='h-4 w-4 text-green-500 mr-1' />
                            <span className='text-green-600'>+{trend}% this month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
                    <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
            </div>
        </div>
    );

   

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-800 border-b shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                                <ArrowLeft className='h-5 w-5' onClick={()=>navigate(-1)} />
                            </button>
                            <div>
                                <h1 className='text-xl font-bold text-gray-900 dark:text-white'>Course Analytics</h1>
                                <p className='text-lg text-gray-500'>{course?.courseTitle}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className='px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm'
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                                <option value="1y">Last year</option>
                            </select>
                            <button className='flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
                                <Download className='h-4 w-4' />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
                {/* Key Metrics */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${analyticsData?.overview?.totalRevenue}`}
                        icon={IndianRupee}

                        color="green"
                    />
                    <StatCard
                        title="Total Students"
                        value={`${analyticsData?.overview.totalStudents}`}
                        icon={Users}

                        color="blue"
                    />
                    <StatCard
                        title="Average Rating"
                        value={analyticsData?.overview.averageRating}
                        icon={Star}

                        color="yellow"
                    />
                    <StatCard
                        title="Completion Rate"
                        value={`${analyticsData?.overview.completionRate}%`}
                        icon={PlayCircle}

                        color="purple"
                    />
                </div>

                {/* Revenue & Enrollment Chart */}
                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm mb-8'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>Revenue & Enrollments</h3>
                    <div className='h-80'>
                        <canvas ref={revenueChartRef} />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Rating Distribution */}
                    <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>Rating Distribution</h3>
                        <div className='h-64'>
                            <canvas ref={ratingChartRef} />
                        </div>
                    </div>

                    {/* Lecture Engagement */}
                    <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>Lecture Engagement</h3>
                        <div className='h-64'>
                            <canvas ref={engagementChartRef} />
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className='bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm mt-8'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>Recent Activity</h3>
                    <div className='space-y-4'>
                        {analyticsData?.recentActivity.map((activity, index) => (
                            <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                <div className={`p-2 rounded-full ${activity.type === 'enrollment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                        activity.type === 'completion' ? 'bg-green-100 dark:bg-green-900/30' :
                                            'bg-yellow-100 dark:bg-yellow-900/30'
                                    }`}>
                                    {activity.type === 'enrollment' && <Users className='h-4 w-4 text-blue-600' />}
                                    {activity.type === 'completion' && <PlayCircle className='h-4 w-4 text-green-600' />}
                                    {activity.type === 'review' && <Star className='h-4 w-4 text-yellow-600' />}
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                        {activity.student} {' '}
                                        {activity.type === 'enrollment' && 'enrolled in the course'}
                                        {activity.type === 'completion' && 'completed the course'}
                                        {activity.type === 'review' && `left a ${activity.rating}-star review`}
                                    </p>
                                    <p className='text-xs text-gray-500'>{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAnalytics;