import React, { useState, useEffect } from "react";
import './teacher.css'
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";
function TeacherProfile() {
        const [teacherData, setTeacherData] = useState(null);
        const [showPassword, setShowPassword] = useState(false); // Password visibility state
    
        const teacher = JSON.parse(localStorage.getItem("get"))
        const teacherId = teacher ? teacher._id : null
        // console.log("User Id:",userId);
    
        useEffect(() => {
            if (teacherId) {
                fetch(`http://localhost:8000/teacherrouter/teacherprofile/${teacherId}`).then((res) => res.json()).then((data) => setTeacherData(data))
    
            }
        }, [teacherId]);
    
    return (
        <>
        <TeacherSidebar/>
            <section id="content">
                <TeacherNav/>
                <main className="profile-container2">
                    <div className="profile-box">
                        <h2 className="profile-title">Teacher Profile <i class='bx bxs-user'></i> </h2>
                        <hr />
                        {teacherData ? (
                            <>
                                <h5><strong>Teacher ID:</strong> {teacherData.teacherid}</h5>
                                <h5><strong>Teacher Name:</strong> {teacherData.teachername}</h5>
                                <h5><strong>Designation:</strong> {teacherData.designation}</h5>
                                <h5><strong>Date of Birth:</strong> {teacherData.dateofbirth}</h5>
                                <h5><strong>Qualification:</strong> {teacherData.qualification.join(', ')}</h5>
                                <h5><strong>Salary:</strong> {teacherData.salary} ₹</h5>
                                <h5><strong>Email:</strong> {teacherData.email}</h5>
                                {/* <h5><strong>Password:</strong>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={teacherData.password}
                                        readOnly
                                        className="password-input"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="eye-button"
                                    >
                                        {showPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
                                    </button>
                                </h5> */}
                            </>
                        ) : (
                            <h5>Loading your profile</h5>
                        )}
                    </div>

                </main>
            </section>


        </>
    )
}
export default TeacherProfile;