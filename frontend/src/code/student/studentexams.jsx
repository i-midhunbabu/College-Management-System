import React, { useState, useEffect } from "react";
import StudentNavBar from "./studentnavbar";
import './student.css'
import { useNavigate } from "react-router-dom";
function StudentExam() {
    const [exams, setExams] = useState([]);
    const [studentDetails, setStudentDetails] = useState({
        degree: "",
        department: "",
        semester: "",
    });
    const navigate = useNavigate();

    // Fetch student details 
    const fetchStudentDetails = () => {
        try {
            const storedData = JSON.parse(localStorage.getItem("get"));
            if (storedData && storedData.studentDetails) {
                const { degree, department, semester } = storedData.studentDetails;
                setStudentDetails({ degree, department, semester });
            } else {
                console.error("No student details found in localStorage");
            }
        } catch (err) {
            console.error("Error fetching student details from localStorage:", err);
        }
    };

    const fetchExams = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/studentrouter/getstudentexams?degree=${studentDetails.degree}&department=${studentDetails.department}&semester=${studentDetails.semester}`
            );
            const data = await response.json();
            setExams(data);
        } catch (err) {
            console.error("Error fetching exams:", err);
        }
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };


    const isAttendButtonEnabled = (startTime, dateOfExamination) => {
        const now = new Date();
        const examDate = new Date(dateOfExamination);
        const [hours, minutes] = startTime.split(":");
        examDate.setHours(hours, minutes, 0, 0);

        return now >= examDate;
    };

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    useEffect(() => {
        if (studentDetails.degree && studentDetails.department && studentDetails.semester) {
            fetchExams();
        }
    }, [studentDetails]);

    // useEffect(() => {
    //     fetchExams();
    // }, [studentDetails]);

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <div style={{ padding: "20px" }}>
                        <h2 style={{ textAlign: "center" }}>Available Exams</h2>
                        <table
                            className="table table-bordered table-secondary table-hover"
                            style={{ width: "90%", fontSize: "0.9rem", margin: "0 auto" }}
                        >
                            <thead>
                                <tr>
                                    <th>Exam Type</th>
                                    <th>Mode</th>
                                    <th>Subject</th>
                                    <th>Date of Examination</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Maximum Mark</th>
                                    <th>Pass Mark</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.examType}</td>
                                        <td>{exam.mode}</td>
                                        <td>{exam.subject}</td>
                                        <td>{new Date(exam.dateOfExamination).toLocaleDateString()}</td>
                                        <td>{formatTime(exam.startTime)}</td>
                                        <td>{formatTime(exam.endTime)}</td>
                                        <td>{exam.maximumMark}</td>
                                        <td>{exam.passMark}</td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => navigate(`/studentexamattend/${exam._id}`)}
                                                disabled={!isAttendButtonEnabled(exam.startTime, exam.dateOfExamination)}
                                            >
                                                Attend
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </main>
            </section>
        </>
    )
}
export default StudentExam;