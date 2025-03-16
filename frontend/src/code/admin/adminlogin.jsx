import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import './adminlogin.css'

function Adminlogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleForm = (e) => {
        e.preventDefault();
        let params = {
            email: email,
            password: password
        }
        fetch('http://localhost:8000/adminrouter/adminloginview', {
            method: 'post',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.json()).then((result) => {
            console.log(result);
            if (result != null) {
                localStorage.setItem("get", JSON.stringify(result));
                window.location.href = '/'; //navigate the data 
            } else {
                console.log("Invalid");
            }
        }).catch((err) => {
            console.error("Error during login:", err);
        });
    }

    return (
        <>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img src="./admin2.png" width={400}
                                className="img-fluid" alt="logo" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <div>
                                <h2>Admin Login</h2>
                            </div>
                            <form onSubmit={handleForm}>
                                {/* E-mail */}
                                <div data-mdb-input-init className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">Email address</label>
                                    <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control form-control-lg" required />
                                </div>

                                {/* Password */}
                                <div data-mdb-input-init className="form-outline mb-4">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} className="form-control form-control-lg" required />
                                </div>

                                {/* Forgot Password */}
                                <div data-mdb-input-init className="form-outline mb-4">
                                    <a href="/adminforgotpassword">Forgot password?</a>
                                </div>

                                {/* Submit Button */}
                                <button id="logbtn" type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block">Sign in</button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Adminlogin;