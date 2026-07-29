import { useLocation } from "react-router-dom";
import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import courseData from "../data/courseData.json";

export default function RegisterCourses() {

    const location = useLocation();
    const { username, fullName } = location.state || {};

    const [, forceUpdate] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const registerCourse = (courseCode) => {

        const users = JSON.parse(localStorage.getItem("Users")) || [];

        const currentUser = users.find(
            user => user.username === username
        );

        if (!currentUser) {
            setFeedback({ type: "error", title: "User Not Found" });
            return;
        }

        const selectedCourse = courseData.find(
            course => course.courseCode === courseCode
        );

        if (!selectedCourse) {
            setFeedback({ type: "error", title: "Course Not Found" });
            return;
        }

        currentUser.registedCourses.push(selectedCourse);

        currentUser.credits += selectedCourse.credits;

        currentUser.recentActivities.unshift({
            title: "Course Registered",
            description: selectedCourse.courseName,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("Users", JSON.stringify(users));

        forceUpdate(prev => prev + 1);

        setFeedback({ type: "success", title: "Course Registered", message: selectedCourse.courseName });
    };

    const checkIfCourseRegistered = (courseCode) => {

        const users = JSON.parse(localStorage.getItem("Users")) || [];

        const currentUser = users.find(
            user => user.username === username
        );

        if (!currentUser) {
            return false;
        }

        return currentUser.registedCourses.some(
            course => course.courseCode === courseCode
        );
    };

    return (
        <div className="registerCourses">

            <Header username={username} />

            <Sidebar
                username={username}
                fullName={fullName}
            />

            <div className="body card">

                <div className="pageTitle">
                    <h2>📚 Register Courses</h2>
                    <p>Select the courses you'd like to enroll in this semester.</p>
                </div>

                <div className="courseBody">

                    {courseData.map((course) => {

                        const isRegistered =
                            checkIfCourseRegistered(course.courseCode);

                        return (

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
                                    <h4>💺 {course.availableSeats} / {course.maxSeats} Seats</h4>
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
                                        className="btn"
                                        disabled={isRegistered}
                                        onClick={() =>
                                            registerCourse(course.courseCode)
                                        }
                                        
                                    >
                                        {isRegistered
                                            ? "Registered"
                                            : "Register"}
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

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