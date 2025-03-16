import React, { useEffect, useState } from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
function Adminreg() {
    const [adminname, setAdminname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [viewdata, setViewdata] = useState([]);

    const handleForm = (e) => {
        e.preventDefault(); // Prevent default form submission
        let params = {
            adminname: adminname,
            email: email,
            password: password,
            usertype: 1
        };
        fetch('http://localhost:8000/adminrouter/adminregisterIns', {
            method: 'post',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.json()).then((result) => {
            console.log(result);
            setAdminname('');
            setEmail('');
            setPassword('');
        }).catch((err) => {
            console.error("Error during registration:", err);
        });
    };

    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/adminregisterView')
            .then((res) => res.json())
            .then((result) => {
                setViewdata(result);
            })
            .catch((err) => {
                console.error("Error fetching admin data:", err);
            });
    }, []);

    return (
        <>
        <AdminSidebar/>
            <section className="vh-100" style={{ backgroundColor: '#eee' }}>
                <section id="content">
                    <AdminNav/>
                    <main>
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-11">
                            <div className="card text-black" style={{ borderRadius: '25px' }}>
                                <div className="card-body p-md-1">
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <p className="text-center h2 fw-bold mb-5 mx-1 mx-md-4 mt-4">Admin Registration</p>
                                            <form onSubmit={handleForm} className="mx-1 mx-md-4">
                                                {/* Admin Name */}
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                        <input type="text" placeholder="Admin Name" id="adminname" onChange={(e) => setAdminname(e.target.value)} value={adminname} className="form-control" required />
                                                        <label className="form-label" htmlFor="adminname"></label>
                                                    </div>
                                                </div>
                                                {/* E-mail Address */}
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                        <input type="email" placeholder="E-mail Address" id="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control" required />
                                                        <label className="form-label" htmlFor="email"></label>
                                                    </div>
                                                </div>
                                                {/* Password */}
                                                <div className="d-flex flex-row align-items-center mb-4">
                                                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                        <input type="password" placeholder="Password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" required />
                                                        <label className="form-label" htmlFor="password"></label>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg">Register</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                            <img src="admin3.png" className="img-fluid" alt="Sample" style={{ width: '100%', maxWidth: '370px', height: 'auto' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </main>
                </section>
            </section>
        </>
    );
}

export default Adminreg;