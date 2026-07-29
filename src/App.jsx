import LoginPage from "./components/Login-Signup/LoginPage";
import SignUpPage from "./components/Login-Signup/SignUpPage";
import SetUpAccount from "./components/SetupAcc";
import Dashboard from "./components/Dashboard";
import MyCourses from "./components/MyCourses";
import RegisterCourses from "./components/RegisterCourse";
import TimeTable from "./components/TimeTable";
import MyProfile from "./components/MyProfile";
import Settings from "./components/Settings";

import { Routes, Route } from "react-router-dom";
import { useReducer } from "react";
import { createContext } from "react";
import { useEffect } from "react";

export const userContext = createContext();

const initialState = {
    currentUser: null,
    loginError: null,
    users: JSON.parse(localStorage.getItem("Users")) || []
};

const Reducer = (state, action) => {
    switch (action.type) {

        // ===================== LOGIN =====================
        case "LOGIN": {

            const user = state.users.find(
                (u) => u.username === action.payload.username
            );

            if (!user) {
                return {
                    ...state,
                    currentUser: null,
                    loginError: "USER_NOT_FOUND"
                };
            }

            if (user.password !== action.payload.password) {
                return {
                    ...state,
                    currentUser: null,
                    loginError: "WRONG_PASSWORD"
                };
            }

            return {
                ...state,
                currentUser: user,
                loginError: "LOGIN_SUCCESS"
            };
        }

        // ===================== SIGNUP =====================
        case "SIGNUP": {

            const existingUser = state.users.find(
                (user) => user.username === action.payload.username
            );

            if (existingUser) {
                return {
                    ...state,
                    loginError: "USER_EXISTS"
                };
            }

            const newUser = {
                ...action.payload,
                profileCompleted: false
            };

            return {
                ...state,
                users: [...state.users, newUser],
                currentUser: newUser,
                loginError: "USER_CREATED"
            };
        }

        // ===================== PROFILE SETUP =====================
        case "SETUP_ACCOUNT": {

            const updatedUsers = state.users.map((user) => {

                if (user.username === action.payload.username) {

                    return {
                        ...user,
                        ...action.payload,
                        profileCompleted: true
                    };
                }

                return user;
            });

            const updatedCurrentUser = updatedUsers.find(
                (user) => user.username === action.payload.username
            );

            return {
                ...state,
                users: updatedUsers,
                currentUser: updatedCurrentUser,
                loginError: "PROFILE_SETUP_SUCCESS"
            };
        }

        default:
            return state;
    }
};

export default function App() {

        const [state, dispatch] = useReducer(Reducer, initialState);

    useEffect(() => {
        localStorage.setItem("Users", JSON.stringify(state.users));
        }, [state.users]);

    return (
        <>
            <userContext.Provider value={{ state, dispatch }}>

                <Routes>

                    <Route path="/" element={<LoginPage/>} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signup-setup" element={<SetUpAccount />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-courses" element={<MyCourses />} />
                    <Route path="/register-courses" element={<RegisterCourses />} />
                    <Route path="/time-table" element={<TimeTable />} />
                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/settings" element={<Settings />} />

                </Routes>

            </userContext.Provider>
            
        </>
    )
  
}