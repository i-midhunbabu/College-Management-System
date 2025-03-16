import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/adminrouter/resetpassword', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
        }).then((res) => res.json()).then((result) => {
            setMessage(result.message);
        }).catch((err) => {
            console.error("Error during password reset:", err);
            setMessage("An error occurred");
        });
    };

    return (
        <>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <div>
                                <h2>Reset Password</h2>
                            </div>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-outline mb-4">
                                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter new password" required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg btn-block">Reset</button>
                            </form>
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ResetPassword;