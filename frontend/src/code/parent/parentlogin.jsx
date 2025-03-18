import React, {useState} from "react";
import './parentlogin.css'
function ParentLogin() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
    
        const handleForm = (e) => {
            e.preventDefault();
            setErrorMessage(""); // Clear previous errors
    
            let params = {
                email: email,
                password: password
            }
            fetch('http://localhost:8000/parentrouter/parentloginview', {
                method: 'post',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }).then((res) => {
                if (res.status === 403) {
                    throw new Error("You are not authorized to visit this page");
                }
                return res.json();
            })
            .then((result) => {
                console.log(result);
                if (result && result.message) {
                    setErrorMessage(result.message); // Show error message if login fails
                }else{
                    localStorage.setItem("get", JSON.stringify(result));
                    window.location.href = '/'; //navigate the data 
                }
            }).catch((err) => {
                console.error("Error during login:", err);
                setErrorMessage("Something went wrong. Please try again.");
            });
        }
    return(
        <>
        <section className="vh-100">
        <div className="container py-5 h-100">
            <div className="row d-flex align-items-center justify-content-center h-100">
                <div className="col-md-8 col-lg-7 col-xl-6">
                    <img src="./parent2.png" width={520}
                        className="img-fluid" alt="logo" />
                </div>
                <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                    <div>
                        <h2>Parent Login</h2>
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
                            <a href="/parentforgotpassword">Forgot password?</a>
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
export default ParentLogin;