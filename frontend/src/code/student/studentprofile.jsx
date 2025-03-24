import React, { useState, useEffect } from "react";
import './student.css'
import StudentNavBar from "./studentnavbar";

function StudentProfile() {
    const [studentData, setStudentData] = useState(null);
    const student = JSON.parse(localStorage.getItem("get"))
    const studentId = student ? student._id : null
    // console.log("User Id:",userId);

    useEffect(() => {
        if (studentId) {
            fetch(`http://localhost:8000/studentrouter/studentprofile/${studentId}`).then((res) => res.json()).then((data) => setStudentData(data))

        }
    }, [studentId]);

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main className="profile-container1">
                    <div className="profile-box">
                        <h2 className="profile-title">Student Profile <i class='bx bxs-user'></i> </h2>
                        <hr />
                        {studentData ? (
                            <>
                                <h5><strong>Student ID:</strong> {studentData.studentid}</h5>
                                <h5><strong>Student Name:</strong> {studentData.studentname}</h5>
                                <h5><strong>Date of Birth:</strong> {studentData.dateofbirth}</h5>
                                <h5><strong>Guardian:</strong> {studentData.guardianname}</h5>
                                <h5><strong>Relation:</strong> {studentData.guardianrelation}</h5>
                                <h5><strong>Blood Group:</strong> {studentData.bloodgroup}</h5>
                                <h5><strong>Department:</strong> {studentData.department}</h5>
                                <h5><strong>Semester:</strong> {studentData.semester}</h5>
                                <h5><strong>10th CGPA(or %):</strong> {studentData.tenth}</h5>
                                <h5><strong>12th CGPA(or %):</strong> {studentData.twelve}</h5>
                                <h5><strong>Email:</strong> {studentData.email}</h5>
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
export default StudentProfile;