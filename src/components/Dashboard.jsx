import Header from "./Header";
import Sidebar from "./Sidebar";
import fetchData from "../utils/fetchData";

import {
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoNotificationsOutline,
    IoAlarmOutline
} from "react-icons/io5";

import { useLocation, useNavigate } from "react-router-dom";

const activityIcon = (title) => {
    if (title === "Course Registered") return IoCheckmarkCircleOutline;
    if (title === "Course Dropped") return IoCloseCircleOutline;
    return IoNotificationsOutline;
};

export default function Dashboard() {

    const location = useLocation();

    const navigate = useNavigate();


    if (!location.state) {
        return <h2>Unauthorized Access</h2>;
    }


    const { fullName, username } = location.state;



    return (
        <div className="dashboard">
            
            <Header username={username} />

            <Sidebar username={username} fullName={fullName} />

            <main className="body">
                <div className="welcomeCard card">
                    <div className="greet">
                        {new Date().getHours() < 12 ? <h2>Good Morning!</h2> : new Date().getHours() < 18 ? <h2>Good Afternoon!</h2> : <h2>Good Evening!</h2>}

                        <p>{fullName}</p>

                        <p>Semester {fetchData(username, "semester")} <br />
                            {fetchData(username, "department")}
                        </p>

                        <p>Ready for today's classes?</p>
                    </div>
                </div>

                <div className="statscard card">
                    <div className="stat">
                        <h3>Registed Courses</h3>
                        <p style={{ fontSize: "20px"}}>{fetchData(username, "registedCourses").length}</p>
                    </div>

                    <div className="stat">
                        <h3>Credits</h3>
                        <p style={{ fontSize: "20px" }}>{fetchData(username, "credits")}</p>
                    </div>

                    <div className="stat">
                        <h3>Attendance</h3>
                        <p style={{ fontSize: "20px" }}>{fetchData(username, "attendance")}%</p>
                    </div>

                    <div className="stat">
                        <h3>GPA</h3>
                        <p style={{ fontSize: "20px" }}>{fetchData(username, "gpa")}</p>
                    </div>
                </div>

                <div className="recentActi card">
                    <h3 className="sectionTitle">Recent Activities</h3>

                    {fetchData(username, "recentActivities").length > 0 ? (
                        fetchData(username, "recentActivities").map((activity, index) => {

                            const Icon = activityIcon(activity.title);

                            return (
                                <div key={index} className="notificationCard">
                                    <Icon className="notificationIcon" />

                                    <div className="notificationBody">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.description}</p>
                                        <span>{activity.date}</span>
                                    </div>
                                </div>
                            );
                        })
                        )
                        :
                        (
                            <div className="stat">
                                <h3>No Recent Activities</h3>
                            </div>
                        )}
                </div>

                <div className="upcomingDeadlines card">
                    <h3 className="sectionTitle">Upcoming Deadlines</h3>

                    {fetchData(username, "upcomingDeadlines").length > 0 ? (
                        fetchData(username, "upcomingDeadlines").map((deadline, index) => (
                            <div key={index} className="notificationCard">
                                <IoAlarmOutline className="notificationIcon deadline" />

                                <div className="notificationBody">
                                    <h4>{deadline.title}</h4>
                                    <p>{deadline.description}</p>
                                    <span>{deadline.date}</span>
                                </div>
                            </div>
                        ))
                        )
                        :
                        (
                            <div className="stat">
                                <h3>No Upcoming Deadlines</h3>
                            </div>
                        )}
                </div>
            </main>

        </div>
    );
}
