import { Link } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../App";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

export default function LoginPage() {

    const { state, dispatch } = useContext(userContext)

    const navigate = useNavigate()

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [showWarning, setShowWarning] = useState(false)

    const handleLogin = () => {
        if (!username || !password) {
            setShowWarning(true);
            return;
        }
        dispatch({
            type: "LOGIN",
            payload: {
                username,
                password
            }
        })
    }

    useEffect(() => {
        if (state.loginError === "LOGIN_SUCCESS") {
           const navigateTimer = setTimeout(() => {
                navigate("/dashboard", {
                    state: {
                        fullName: state.currentUser.fullName, 
                        username: state.currentUser.username
                    }
                });
            }, 3000);

            return () => clearTimeout(navigateTimer);
        }
    }, [state.loginError, state.currentUser, navigate]);

    return (
        <>
            <div className="login-signup">

                <div className="formbox">

                    <h1>Login</h1>

                    {state.loginError !== "LOGIN_SUCCESS" ? 
                        
                        <>
                            
                            <form action="">
                                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? handleLogin() : null}/>
                            </form>

                            <div className="button">

                                <button onClick={handleLogin}>Login</button>

                                {state.loginError === "USER_NOT_FOUND" && <p className="error">User not found. Please check your username.</p>}
                                {state.loginError === "WRONG_PASSWORD" && <p className="error">Incorrect password. Please try again.</p>}
                                {/* {state.loginError === "LOGIN_SUCCESS" && <p className="success">Login successful!</p>} */}
                                
                            </div>

                            <p>Dont have an account ? <Link to="/signup">Sign Up</Link></p>

                        </> 

                    :
                        <>
                            <h3 className="success" style={{ display: "block", fontSize: "20px", justifyContent: "center" }}>Login Successful!</h3>
                            <h4>Redirecting...</h4>
                        </>
                            
                    }

                    <div className="message">
                        <p>📚

                        Welcome Back! <br />

                        Sign in to continue managing your semester.</p>
                    </div>

                </div>
                
            </div>

            <Modal
                isOpen={showWarning}
                type="warning"
                title="Missing Details"
                message="Please enter both username and password."
                onConfirm={() => setShowWarning(false)}
                onCancel={() => setShowWarning(false)}
            />

        </>
    )
}