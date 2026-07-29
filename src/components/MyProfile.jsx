import { useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import fetchData from "../utils/fetchData";

const personalFields = [
    { key: "fullName", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "DOB", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender", type: "select" }
];

const academicFields = [
    { key: "rollNumber", label: "Roll Number", type: "text" },
    { key: "department", label: "Department", type: "text" },
    { key: "semester", label: "Semester", type: "text" },
    { key: "section", label: "Section", type: "text" },
    { key: "academicYear", label: "Academic Year", type: "text" }
];

export default function MyProfile() {
    const { state } = useLocation();
    const { username, fullName } = state || {};

    const buildFormData = () => {
        const data = {};
        [...personalFields, ...academicFields].forEach((field) => {
            data[field.key] = fetchData(username, field.key) || "";
        });
        return data;
    };

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(buildFormData());
    const [feedback, setFeedback] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const startEditing = () => {
        setFormData(buildFormData());
        setEditing(true);
    };

    const cancelEditing = () => {
        setFormData(buildFormData());
        setEditing(false);
    };

    const saveProfile = () => {
        const users = JSON.parse(localStorage.getItem("Users")) || [];

        const currentUser = users.find(
            (user) => user.username === username
        );

        if (!currentUser) return;

        Object.assign(currentUser, formData);

        localStorage.setItem("Users", JSON.stringify(users));

        setEditing(false);
        setFeedback(true);
    };

    const renderField = (field) => {
        if (!editing) {
            return (
                <div className="profileField" key={field.key}>
                    <span className="profileLabel">{field.label}</span>
                    <span className="profileValue">{formData[field.key] || "—"}</span>
                </div>
            );
        }

        if (field.type === "select") {
            return (
                <div className="profileField" key={field.key}>
                    <label className="profileLabel" htmlFor={field.key}>{field.label}</label>
                    <select
                        id={field.key}
                        name={field.key}
                        className="profileInput"
                        value={formData[field.key]}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            );
        }

        return (
            <div className="profileField" key={field.key}>
                <label className="profileLabel" htmlFor={field.key}>{field.label}</label>
                <input
                    id={field.key}
                    type={field.type}
                    name={field.key}
                    className="profileInput"
                    value={formData[field.key]}
                    onChange={handleChange}
                />
            </div>
        );
    };

    return (
        <div className="myCourses">
            <Header username={username} />
            <Sidebar username={username} fullName={fullName} />
            <main className="body card">

                <div className="pageTitle profileHeader">
                    <div>
                        <h2>👤 My Profile</h2>
                        <p>View and update your student information.</p>
                    </div>

                    {!editing ? (
                        <button className="btn profileEditBtn" onClick={startEditing}>
                            Edit Profile
                        </button>
                    ) : (
                        <div className="profileEditActions">
                            <button className="modalBtn secondary" onClick={cancelEditing}>Cancel</button>
                            <button className="modalBtn primary confirm" onClick={saveProfile}>Save Changes</button>
                        </div>
                    )}
                </div>

                <div className="profileSection card">
                    <h3>Personal Information</h3>
                    <div className="profileGrid">
                        {personalFields.map(renderField)}
                    </div>
                </div>

                <div className="profileSection card">
                    <h3>Academic Information</h3>
                    <div className="profileGrid">
                        {academicFields.map(renderField)}
                    </div>
                </div>

            </main>

            <Modal
                isOpen={feedback}
                type="success"
                title="Profile Updated"
                message="Your changes have been saved."
                onConfirm={() => setFeedback(false)}
                onCancel={() => setFeedback(false)}
            />

        </div>
    );
}
