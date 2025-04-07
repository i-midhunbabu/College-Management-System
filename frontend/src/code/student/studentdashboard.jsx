import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StudentNavBar from "./studentnavbar";
import './student.css'

function Studentdashboard() {
    const [studentName, setStudentName] = useState("");
    const [upcomingExams, setUpcomingExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch student details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const studentData = JSON.parse(storedData);
            if (studentData.studentDetails && studentData.studentDetails.studentname) {
                setStudentName(studentData.studentDetails.studentname);
            }
        }

        // Fetch upcoming exams
        fetchUpcomingExams();
    }, []);

    const fetchUpcomingExams = async () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("get"));
            if (storedData && storedData.studentDetails) {
                const { degree, department, semester } = storedData.studentDetails;
                const studentId = storedData._id;

                if (!studentId || studentId.length !== 24) {
                    console.error("Invalid studentId:", studentId);
                    return;
                }

                const response = await fetch(
                    `http://localhost:8000/studentrouter/getstudentexams?degree=${encodeURIComponent(degree)}&department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}&studentId=${studentId}`
                );
                const exams = await response.json();

                if (!exams || exams.length === 0) {
                    console.log("No exams found in API response.");
                    setUpcomingExams([]);
                    return;
                }

                // Filter exams to show only upcoming ones
                const now = new Date();
                const filteredExams = exams.filter((exam) => {
                    const examDate = new Date(exam.dateOfExamination);
                    const [hours, minutes] = exam.startTime.split(":");
                    examDate.setHours(hours, minutes, 0, 0);
                    return examDate > now;
                });

                // Sort exams by date and time
                const sortedExams = filteredExams.sort((a, b) => {
                    const dateA = new Date(a.dateOfExamination + "T" + a.startTime);
                    const dateB = new Date(b.dateOfExamination + "T" + b.startTime);
                    return dateA - dateB;
                });

                setUpcomingExams(sortedExams);
            } else {
                console.error("Student details not found in localStorage.");
            }
        } catch (err) {
            console.error("Error fetching exams:", err);
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(hours, minutes);
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        return date.toLocaleTimeString("en-US", options);
    };

    const handleAttendExam = () => {
        navigate("/studentexamlist");
    };

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <div className="head-title">
                        <div className="student-name">
                            <span style={{ fontSize: "30px" }}>Welcome </span>
                            <span style={{ fontSize: "30px", fontWeight: "bolder" }}>
                                {studentName || "Student"}
                            </span>
                        </div>
                    </div>

                    <div className="add-parent-container">
                        <div className="add-parent-box">
                            <Link to="/studentaddparent" className="add-parent-link">
                                <i className="bx bxs-user-plus"></i>
                                <span>Parent</span>
                            </Link>
                        </div>
                        <div className="add-parent-box">
                            <Link to="/viewattendance" className="add-parent-link">
                                <i class='bx bx-search-alt-2'></i>
                                <span>Attendance</span>
                            </Link>
                        </div>
                        <div className="add-parent-box">
                            <Link to="/examresult" className="add-parent-link">
                                <i class='bx bx-file'></i>
                                <span>Result</span>
                            </Link>
                        </div>
                        <div className="add-parent-box">
                            <Link to="/studentprogress" className="add-parent-link">
                                <i class='bx bx-file'></i>
                                <span> Progress</span>
                            </Link>
                        </div>
                    </div>

                    <div
                        className="exam-list-container"
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            marginTop: "20px",
                            // width: "300px",
                            // height: "300px", 
                            // margin: "20px auto",
                            // overflowY: "auto", 
                        }}
                    >
                        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                            Upcoming Examinations
                        </h3>
                        {upcomingExams.length > 0 ? (
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                {upcomingExams.map((exam, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #ccc",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <strong>Exam Type:</strong> {exam.examType} <br />
                                        <strong>Subject:</strong> {exam.subject} <br />
                                        <strong>Date:</strong>{" "}
                                        {new Date(exam.dateOfExamination).toLocaleDateString()} <br />
                                        <strong>Start Time:</strong> {formatTime(exam.startTime)} <br />
                                        <strong>End Time:</strong> {formatTime(exam.endTime)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ textAlign: "center" }}>No upcoming exams found.</p>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={handleAttendExam}
                            style={{ marginTop: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                        >
                            View All Exams
                        </button>
                    </div>
                </main>
                {/* Main */}
            </section>
            {/* Content */}

        </>
    )
}
export default Studentdashboard;