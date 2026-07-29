import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { IoMoonOutline, IoNotificationsOutline, IoTrashOutline, IoLogOutOutline } from "react-icons/io5";

export default function Settings() {
    const { state } = useLocation();
    const { username, fullName } = state || {};

    const navigate = useNavigate();

    const [confirmModal, setConfirmModal] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const resetPortalData = () => {
        localStorage.removeItem("Users");
        setConfirmModal(null);
        setFeedback({
            title: "Portal Data Reset",
            message: "All local data has been cleared.",
            after: () => navigate("/")
        });
    };

    const logout = () => {
        setConfirmModal(null);
        setFeedback({
            title: "Logged Out",
            message: "See you next time!",
            after: () => navigate("/")
        });
    };

    return (
        <div className="myCourses">
            <Header username={username} />
            <Sidebar username={username} fullName={fullName} />
            <main className="body card">

                <div className="pageTitle">
                    <h2>⚙️ Settings</h2>
                    <p>Manage your portal preferences.</p>
                </div>

                <div className="settingsSection card">
                    <div className="settingsRow">
                        <div className="settingsRowLabel">
                            <IoMoonOutline className="settingsIcon" />
                            <div>
                                <h4>Appearance</h4>
                                <p>Theme options are coming soon.</p>
                            </div>
                        </div>
                        <span className="settingsBadge">Coming Soon</span>
                    </div>

                    <div className="settingsRow">
                        <div className="settingsRowLabel">
                            <IoNotificationsOutline className="settingsIcon" />
                            <div>
                                <h4>Notifications</h4>
                                <p>Email and push alerts are coming soon.</p>
                            </div>
                        </div>
                        <span className="settingsBadge">Coming Soon</span>
                    </div>
                </div>

                <div className="settingsSection card">
                    <div className="settingsRow">
                        <div className="settingsRowLabel">
                            <IoTrashOutline className="settingsIcon danger" />
                            <div>
                                <h4>Reset Portal Data</h4>
                                <p>Erase all locally stored accounts and progress.</p>
                            </div>
                        </div>
                        <button
                            className="btn drop settingsActionBtn"
                            onClick={() => setConfirmModal("reset")}
                        >
                            Reset Data
                        </button>
                    </div>

                    {/* <div className="settingsRow">
                        <div className="settingsRowLabel">
                            <IoLogOutOutline className="settingsIcon" />
                            <div>
                                <h4>Logout</h4>
                                <p>Sign out of your student portal account.</p>
                            </div>
                        </div>
                        <button
                            className="btn settingsActionBtn"
                            onClick={() => setConfirmModal("logout")}
                        >
                            Logout
                        </button>
                    </div> */}
                </div>

            </main>

            <Modal
                isOpen={confirmModal === "reset"}
                type="warning"
                title="Reset Portal Data?"
                message="This will permanently erase all accounts and progress stored on this device."
                confirmText="Reset Data"
                cancelText="Cancel"
                onCancel={() => setConfirmModal(null)}
                onConfirm={resetPortalData}
            />

            <Modal
                isOpen={confirmModal === "logout"}
                type="confirm"
                title="Log out?"
                message="You'll need to sign in again to access your portal."
                confirmText="Logout"
                cancelText="Stay Logged In"
                onCancel={() => setConfirmModal(null)}
                onConfirm={logout}
            />

            <Modal
                isOpen={!!feedback}
                type="success"
                title={feedback?.title}
                message={feedback?.message}
                onConfirm={() => { feedback?.after?.(); setFeedback(null); }}
                onCancel={() => { feedback?.after?.(); setFeedback(null); }}
            />

        </div>
    )
}
