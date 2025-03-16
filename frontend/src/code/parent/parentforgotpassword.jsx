import React, {useState} from "react";
function ParentForgotPass() {
        const [email, setEmail] = useState('');
        const [message, setMessage] = useState('');
    
        const handleForgotPassword = (e) => {
            e.preventDefault();
            fetch('http://localhost:8000/parentrouter/parentforgotpassword', {
                method: 'post',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            }).then((res) => res.json()).then((result) => {
                setMessage(result.message);
            }).catch((err) => {
                console.error("Error during password reset request:", err);
                setMessage("An error occurred");
            });
        };
    
    
    return(
        <>
                <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <div>
                                <h2>Forgot Password</h2>
                            </div>
                            <form onSubmit={handleForgotPassword}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">Email address</label>
                                    <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control form-control-lg" required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg btn-block">Reset Password</button>
                            </form>
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default ParentForgotPass;