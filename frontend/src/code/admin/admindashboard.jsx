import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
// import './admindashboard.css'
function Admindashboard() {
    const [teacherCount, setTeacherCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        // Fetch the number of teachers
        fetch("http://localhost:8000/adminrouter/adminteacherview")
            .then((res) => res.json())
            .then((data) => {
                setTeacherCount(data.length); // Assuming the API returns an array of teachers
            })
            .catch((err) => {
                console.error("Error fetching teacher count:", err);
            });

        // Fetch the number of students
        fetch("http://localhost:8000/adminrouter/adminstudentview")
            .then((res) => res.json())
            .then((data) => {
                setStudentCount(data.length); // Assuming the API returns an array of students
            })
            .catch((err) => {
                console.error("Error fetching student count:", err);
            });
    }, []);

    return (
        <>
            <AdminSidebar />
            {/* Content */}
            <section id="content">
                <AdminNav />
                {/* Main */}
                <main>
                    <ul className="box-info">
                        <li>
                            <Link to="/adminteacherview" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="icon">
                                    <i className='bx bxs-chalkboard'></i>
                                </div>
                                <br />
                                <div className="text">
                                    <h3>{teacherCount}</h3>
                                    <p>Teacher</p>
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/adminstudentview" style={{ textDecoration: 'none', color: 'none' }}>
                                <div className="icon">
                                    <i class='bx bxs-graduation'></i>
                                </div>
                                <br />
                                <div className="text">
                                    <h3>{studentCount}</h3>
                                    <p>Student</p>
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/adminExaminationlist" style={{ textDecoration: 'none', color: 'none' }}>
                                <div className="icon">
                                    <i class='bx bxs-notepad'></i>
                                </div>
                                <br />
                                <div className="text">
                                    <h3>{studentCount}</h3>
                                    <p>Exam</p>
                                </div>
                            </Link>
                        </li>

                        {/* <li onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} style={{ cursor: 'pointer' }}>
                            <div className="icon">
                                <i class='bx bx-power-off'></i>
                            </div>
                            <br />
                            <div className="text">
                                <p>Logout</p>
                            </div>
                        </li> */}
                        
                    </ul>
                </main>
                {/* Main */}
            </section>
            {/* Content */}
        </>
    )
}
export default Admindashboard;