import { useContext } from "react";
import { userContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "../Modal";

export default function SignUpPage() {

    const { state, dispatch } = useContext(userContext)

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [rePassword, setRePassword] = useState()

    const [checkPasswords, setCheckPassword] = useState(null)
    const [showWarning, setShowWarning] = useState(false)

    const navigate = useNavigate()
    
    const handleSignup = () => {

        if (!username || !password || !rePassword) {
            setShowWarning(true);
            return;
        }

        if (password !== rePassword) {
            setCheckPassword(true)
            return;
        }
        
        setCheckPassword(false)
        dispatch({
            type: "SIGNUP",
            payload: {
                username,
                password,
            }
        })
        
        
        

    } 

    useEffect(() => {
        if (state.loginError === "USER_CREATED") {

            const timer = setTimeout(() => {
                navigate("/signup-setup", { state: { username: username, password: password } });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state.loginError]);
    
    return (

            <>
                <div className="login-signup">

                    <div className="formbox">

                        <h1>SignUp</h1>

                    {state.loginError !== "USER_CREATED" ? 
                        <>
                            <form action="">
                                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                <input type="password" placeholder="Re-Enter Password" onChange={(e) => setRePassword(e.target.value)} onKeyDown={(e) => {e.key === "Enter" ? handleSignup() : null }}/>
                            </form>

                            <div className="button">
                                <button onClick={handleSignup}>Sign Up</button>

                            {checkPasswords && <p className="error">Passwords do not match. Please try again.</p>}
                            {state.loginError === "USER_EXISTS" && <p className="error">User already exists. Please choose a different username.</p>}
        
                            </div>
                            <p>Already have an account ? <Link to="/">Login</Link></p>
                        </>

                        :
                        <>
                            <h3 className="success" style={{ display: "block", fontSize: "20px", justifyContent: "center" }}> ✓ Account Created </h3>
                            <h3>Your account has been successfully created.</h3>
                            <p>Preparing your profile...</p>

                        </>
                    }

                    

                        <div className="message">
                            <p>🚀 Let's Get Started! <br />
                            Join the Student Course Portal and register for your courses with ease.</p>
                        </div>

                    </div>
                    
            </div>

            <Modal
                isOpen={showWarning}
                type="warning"
                title="Missing Details"
                message="Please fill in all fields."
                onConfirm={() => setShowWarning(false)}
                onCancel={() => setShowWarning(false)}
            />

            </>
    )
}

