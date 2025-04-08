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
                setTeacherCount(data.length); 
            })
            .catch((err) => {
                console.error("Error fetching teacher count:", err);
            });

        // Fetch the number of students
        fetch("http://localhost:8000/adminrouter/adminstudentview")
            .then((res) => res.json())
            .then((data) => {
                setStudentCount(data.length); 
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
                    <div className="add-parent2-container">
                        <div className="add-parent2-box">
                            <Link to="/adminaddteacher" className="add-parent2-link">
                                <i class='bx bxs-user-plus'></i>
                                <span>Add Teacher</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/adminaddteacher" className="add-parent2-link">
                                <i class='bx bxs-user-plus'></i>
                                <span>Add Student</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/adminlistteachers" className="add-parent2-link">
                                <i class='bx bxs-user-check' ></i>
                                <span>Assign Teacher</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/examapprove" className="add-parent2-link">
                                <i class='bx bxs-check-square'></i>
                                <span>Approve Exam</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/adminparentview" className="add-parent2-link">
                                <i class='bx bx-block' ></i>
                                <span>Block Parent</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box" onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} style={{ cursor: 'pointer' }}>
                            <div className="add-parent2-link">
                                <i className='bx bx-power-off'></i>
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                </main>
                {/* Main */}
            </section>
            {/* Content */}
        </>
    )
}
export default Admindashboard;