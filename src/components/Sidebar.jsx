import { useNavigate, useLocation } from "react-router-dom"
import {
    IoGridOutline,
    IoBookOutline,
    IoAddCircleOutline,
    IoCalendarOutline,
    IoTimeOutline,
    IoAlarmOutline,
    IoSchoolOutline,
    IoCheckmarkDoneOutline,
    IoPersonOutline,
    IoSettingsOutline,
    IoLogOutOutline
} from "react-icons/io5";

export default function Sidebar(props) {

    const location = useLocation();
    const { fullName, username } = location.state || props;

    const navigate = useNavigate(); 

    return (

        <div className="sidebar card">

                <button className="btn" onClick={() => navigate("/dashboard", {state : { username : username, fullName: fullName }})}>
                    <IoGridOutline size={20} />
                    <span>Dashboard</span>
                </button>

                <button className="btn" onClick ={() => navigate("/my-courses", {state : { username : username, fullName: fullName }})}>
                    <IoBookOutline size={20} />
                    <span>My Courses</span>
                </button>

                <button className="btn" onClick={() => navigate("/register-courses", {state : { username : username, fullName: fullName }})}>
                    <IoAddCircleOutline size={20} />
                    <span>Register Courses</span>
                </button>

                <button className="btn" onClick={() => navigate("/time-table", {state : { username : username, fullName: fullName }})}>
                    <IoCalendarOutline size={20} />
                    <span>Timetable</span>
                </button>

                <button className="btn" onClick={() => navigate("/my-profile", {state : { username : username, fullName: fullName }})}>
                    <IoPersonOutline size={20} />
                    <span>My Profile</span>
                </button>

                <button className="btn" onClick={() => navigate("/settings", {state : { username : username, fullName: fullName }})}>
                    <IoSettingsOutline size={20} />
                    <span>Settings</span>
                </button>

                <button className="btn" onClick={() => navigate("/")}>
                    <IoLogOutOutline size={20} />
                    <span>Logout</span>
                </button>

            </div>
    )
}
