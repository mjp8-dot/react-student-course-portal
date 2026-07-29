import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../App";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function SetUpAccount() {

    const navigate = useNavigate();

    const [verified, setVerified] = useState(false);
    const [create, setCreate] = useState(false);
    const [dashboard, setDashboard] = useState(false);
    const [width, setWidth] = useState("0%");
    const [showWarning, setShowWarning] = useState(false);

    const location = useLocation();

    if (!location.state) {
        return <h2>Unauthorized Access</h2>;
    }

    const { username, password } = location.state;

    const { state, dispatch } = useContext(userContext)

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        DOB: "",
        gender: "",
        rollNumber: "",
        department: "",
        semester: "",
        section: "",
        academicYear: "",
        registedCourses: [],
        credits: 0,
        attendance: 0,
        gpa: 0,
        recentActivities: [],
        upcomingDeadlines: []
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone || !formData.DOB || !formData.gender || !formData.rollNumber || !formData.department || !formData.semester || !formData.section || !formData.academicYear) {
            setShowWarning(true);
            return;
        }

        setVerified(false);
        setCreate(false);
        setDashboard(false);

        dispatch({
            type: "SETUP_ACCOUNT",
            payload: {
                username,
                password,
                ...formData
            }
        })
    }


    useEffect(() => {

        if (state.loginError === "PROFILE_SETUP_SUCCESS") {

            const verifyTimer = setTimeout(() => {
                setVerified(true);
                setWidth("35%");
            }, 1500);

            const createTimer = setTimeout(() => {
                setCreate(true);
                setWidth("70%");
            }, 3000);

            const dashboardTimer = setTimeout(() => {
                setDashboard(true);
                setWidth("100%");
            }, 4500);

            const navigateTimer = setTimeout(() => {
                console.log("Navigating to dashboard with fullName:", formData.fullName);
                navigate("/dashboard", {
                    state: {
                        fullName: state.currentUser.fullName,
                        username: username,
                    }
                });
            }, 5000);

            return () => {
                clearTimeout(verifyTimer);
                clearTimeout(createTimer);
                clearTimeout(dashboardTimer);
                clearTimeout(navigateTimer);
            };
        }
    }, [state.loginError]);

    return (
        <div className="setup">

            <div className="content">

                <div className="greet">

                    <h2>Complete Your Profile, <br />
                    We're almost done. Help us personalize
                        your student portal.</h2>
                    
                </div>
                

                <div className="details">

                    {state.loginError === "PROFILE_SETUP_SUCCESS" ? 
                        
                        <div className="saving-screen">
                            <h1 className="success" style={{fontSize : "25px", marginTop: "50px"}}>✓ Account Created</h1>
                            <h3>Saving your profile...</h3>
                            <p>Just a moment...</p>

                            <div className="checks">
                                <p>{verified ? "✓" : "○"} Verifying academic details </p>
                                <p>{create ? "✓" : "○"} Creating your student profile </p>
                                <p>{dashboard ? "✓" : "○"} Setting up your dashboard </p>
                            </div>

                            <div
                                className="progress-container"
                                style={{
                                    width: "70%",
                                    height: "10px",
                                    border: "1px solid #000",
                                    borderRadius: "20px",
                                    overflow: "hidden",          // <-- important
                                    marginTop: "20px"
                                }}>
                                
                                <div
                                    className="progressbar"
                                    style={{
                                        width,
                                        height: "100%",
                                        backgroundColor: "#000",
                                        transition: "width .5s ease",
                                        borderRadius: "20px"
                                    }}
                                />
                            </div>


                        </div>

                    : 
                        <>
                            <div className="personal">

                                <h2>Personal Information</h2>

                                    <form>
                                
                                        <input type="text" placeholder="Full Name" id = "input" name = "fullName" value={formData.fullName} onChange={handleChange}/>

                                        <input type="email" placeholder="Email" id = "input" name = "email" value={formData.email} onChange={handleChange}/>

                                        <input type="text" placeholder="Phone" id = "input" name = "phone" value={formData.phone} onChange={handleChange}/>

                                        <div className="dob" style={{display : "flex", gap : "20px"}}>
                                            <label htmlFor="DOB">Date of Birth : </label><input type="date" name="DOB" value={formData.DOB} onChange={handleChange}/>
                                        </div>

                                        <div className="gender" style={{display : "flex", gap : "20px"}}>
                                            <label htmlFor="gender">Gender : </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                </form>

                            </div>

                            <div className="achedemic">
                            
                                <h2>Acedemic Information</h2>

                                <form>

                                    <input type="text" placeholder="Roll Number" id="input" name="rollNumber" value={formData.rollNumber} onChange={handleChange}/>
                                    
                                    <input type="text" placeholder="Department" id="input" name="department" value={formData.department} onChange={handleChange}/>

                                    <input type="text" placeholder="Semester" id="input" name="semester" value={formData.semester} onChange={handleChange}/>

                                    <input type="text" placeholder="Section" id="input" name="section" value={formData.section} onChange={handleChange}/>

                                    <input type="text" placeholder="Academic Year " id="input" name="academicYear" value={formData.academicYear} onChange={handleChange} />
                                    
                                </form>

                            </div>

                            <button onClick={handleSubmit}>Save & Continue</button>
                        </>
                    }

                </div>

            </div>

            <Modal
                isOpen={showWarning}
                type="warning"
                title="Missing Details"
                message="Please fill all the fields."
                onConfirm={() => setShowWarning(false)}
                onCancel={() => setShowWarning(false)}
            />

        </div>
    )
}