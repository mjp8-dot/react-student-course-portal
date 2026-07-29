import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import fetchData from "../utils/fetchData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Table spans 8 AM - 4 PM, one column per starting hour
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15];

const formatHourLabel = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour} ${period}`;
};

const parseTimeToDecimal = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
};

const buildDayCells = (sessions) => {
    const covered = new Array(HOURS.length).fill(false);
    const cells = [];

    for (let i = 0; i < HOURS.length; i++) {

        if (covered[i]) continue;

        const hour = HOURS[i];

        const session = sessions.find(
            (s) => Math.floor(s.startDecimal) === hour
        );

        if (session) {
            const endCeil = Math.ceil(session.endDecimal);
            const maxSpan = HOURS.length - i;
            const span = Math.min(Math.max(endCeil - hour, 1), maxSpan);

            for (let j = i; j < i + span; j++) covered[j] = true;

            cells.push({ key: `${session.courseCode}-${hour}`, type: "filled", span, session });
        } else {
            covered[i] = true;
            cells.push({ key: `empty-${hour}`, type: "empty", span: 1 });
        }
    }

    return cells;
};

export default function TimeTable() {
    const { state } = useLocation();
    const { username, fullName } = state || {};

    const registeredCourses = fetchData(username, "registedCourses") || [];

    const allSessions = [];

    registeredCourses.forEach((course) => {
        (course.schedule || []).forEach((session) => {
            allSessions.push({
                courseCode: course.courseCode,
                courseName: course.courseName,
                faculty: course.faculty,
                day: session.day,
                startTime: session.startTime,
                endTime: session.endTime,
                startDecimal: parseTimeToDecimal(session.startTime),
                endDecimal: parseTimeToDecimal(session.endTime)
            });
        });
    });

    return (
        <div className="myCourses">
            <Header username={username} />
            <Sidebar username={username} fullName={fullName} />
            <main className="body card">

                <div className="pageTitle">
                    <h2>📅 Timetable</h2>
                    <p>Your weekly schedule, generated from your registered courses.</p>
                </div>

                {registeredCourses.length > 0 ? (

                    <div className="timetableWrapper card">

                        <table className="timetableTable">

                            <thead>
                                <tr>
                                    <th className="timetableDayCol">Day</th>
                                    {HOURS.map((hour) => (
                                        <th key={hour}>{formatHourLabel(hour)}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>

                                {days.map((day) => {

                                    const daySessions = allSessions
                                        .filter((s) => s.day === day)
                                        .sort((a, b) => a.startDecimal - b.startDecimal);

                                    const cells = buildDayCells(daySessions);

                                    return (
                                        <tr key={day}>

                                            <th className="timetableDayCol" scope="row">{day}</th>

                                            {cells.map((cell) => (

                                                cell.type === "filled" ? (

                                                    <td
                                                        key={cell.key}
                                                        colSpan={cell.span}
                                                        className="timetableCell filled"
                                                    >
                                                        <div className="timetableCellContent">
                                                            <strong>{cell.session.courseName}</strong>
                                                            <span className="timetableCellTime">
                                                                {cell.session.startTime} - {cell.session.endTime}
                                                            </span>
                                                            <span className="timetableCellFaculty">
                                                                👨‍🏫 {cell.session.faculty}
                                                            </span>
                                                        </div>
                                                    </td>

                                                ) : (

                                                    <td key={cell.key} className="timetableCell empty"></td>

                                                )

                                            ))}

                                        </tr>
                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="courseCard card">
                        <div className="courseCardBody">
                            <h2>No Registered Courses</h2>
                            <p>Register for courses to see them here in your timetable.</p>
                        </div>
                    </div>

                )}

            </main>
        </div>
    )
}
