import { useLocation } from "react-router-dom";
import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import fetchData from "../utils/fetchData";

export default function MyCourses() {

    const location = useLocation();
    const { username, fullName } = location.state || {};

    const [courses, setCourses] = useState(
        fetchData(username, "registedCourses") || []
    );

    const [pendingDrop, setPendingDrop] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const dropCourse = (courseCode) => {

        const users = JSON.parse(localStorage.getItem("Users")) || [];

        const currentUser = users.find(
            user => user.username === username
        );

        if (!currentUser) {
            setFeedback({ type: "error", title: "User Not Found" });
            return;
        }

        const droppedCourse = currentUser.registedCourses.find(
            course => course.courseCode === courseCode
        );

        if (!droppedCourse) return;

        currentUser.registedCourses =
            currentUser.registedCourses.filter(
                course => course.courseCode !== courseCode
            );

        currentUser.credits -= droppedCourse.credits;

        currentUser.recentActivities.unshift({
            title: "Course Dropped",
            description: droppedCourse.courseName,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("Users", JSON.stringify(users));

        // Update React state
        setCourses([...currentUser.registedCourses]);

        setFeedback({ type: "success", title: "Course Dropped", message: droppedCourse.courseName });
    };

    return (
        <div className="myCourses">

            <Header username={username} />

            <Sidebar
                username={username}
                fullName={fullName}
            />

            <div className="body card">

                <div className="pageTitle">
                    <h2>📚 My Courses</h2>
                    <p>View all your registered courses.</p>
                </div>

                <div className="courseBody">

                    {courses.length > 0 ? (

                        courses.map((course) => (

                            <div
                                className="courseCard card"
                                key={course.courseCode}
                            >

                                <div className="courseCardHeader">

                                    <h3>{course.courseName}</h3>

                                    <p>{course.courseCode}</p>

                                </div>

                                <div className="courseCardBody">

                                    <h4>👨‍🏫 {course.faculty}</h4>

                                    <h4>⭐ {course.credits} Credits</h4>

                                    <h4>
                                        💺 {course.availableSeats} / {course.maxSeats} Seats
                                    </h4>

                                    <h4>🎓 Semester {course.semester}</h4>

                                    <h4>🏛 {course.department}</h4>

                                </div>

                                <div className="courseCardSchedule">

                                    <h3>📅 Schedule</h3>

                                    <div className="scheduleGrid">

                                        {course.schedule.map((session, idx) => (

                                            <div
                                                className="scheduleSlot"
                                                key={idx}
                                            >

                                                <strong>{session.day}</strong>

                                                <span>
                                                    {session.startTime} - {session.endTime}
                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                <div className="courseCardFooter">

                                    <button
                                        className="btn drop"
                                        onClick={() => setPendingDrop(course)}
                                    >
                                        Drop Course
                                    </button>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="courseCard card">

                            <div className="courseCardBody">

                                <h2>No Registered Courses</h2>

                                <p>
                                    You haven't registered for any courses yet.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

            <Modal
                isOpen={!!pendingDrop}
                type="confirm"
                title="Drop this course?"
                message={pendingDrop ? `${pendingDrop.courseName} (${pendingDrop.courseCode})` : ""}
                confirmText="Drop Course"
                cancelText="Keep Course"
                onCancel={() => setPendingDrop(null)}
                onConfirm={() => {
                    dropCourse(pendingDrop.courseCode);
                    setPendingDrop(null);
                }}
            />

            <Modal
                isOpen={!!feedback}
                type={feedback?.type}
                title={feedback?.title}
                message={feedback?.message}
                onConfirm={() => setFeedback(null)}
                onCancel={() => setFeedback(null)}
            />

        </div>
    );
}