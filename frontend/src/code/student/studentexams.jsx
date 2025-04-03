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

            // Sort exams by dateOfExamination and startTime (ascending)
            const sortedExams = data.sort((a, b) => {
                const dateA = new Date(a.dateOfExamination);
                const dateB = new Date(b.dateOfExamination);

                if (dateA.getTime() === dateB.getTime()) {
                    // If dates are the same, compare startTime
                    const [hourA, minuteA] = a.startTime.split(":").map(Number);
                    const [hourB, minuteB] = b.startTime.split(":").map(Number);
                    return hourA - hourB || minuteA - minuteB;
                }

                return dateA - dateB;
            });

            setExams(sortedExams);
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


    const isAttendButtonEnabled = (startTime, endTime, dateOfExamination) => {
        const now = new Date();
        const examDate = new Date(dateOfExamination);

        // Set the start time
        const [startHours, startMinutes] = startTime.split(":");
        examDate.setHours(startHours, startMinutes, 0, 0);

        // Set the end time + 5 minutes
        const [endHours, endMinutes] = endTime.split(":");
        const endDate = new Date(dateOfExamination);
        endDate.setHours(endHours, endMinutes, 0, 0);
        endDate.setMinutes(endDate.getMinutes() + 5); // Add 5 minutes to the end time

        if (now >= examDate && now <= endDate) {
            return "attend"; 
        } else if (now > endDate) {
            return "view"; 
        } else {
            return "upcoming"; 
        }
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
                                {exams.map((exam, index) => {
                                    const buttonState = isAttendButtonEnabled(exam.startTime, exam.endTime, exam.dateOfExamination);
                                    // const isButtonEnabled = isAttendButtonEnabled(exam.startTime, exam.dateOfExamination);
                                    return (
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
                                                {buttonState === "attend" && (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => navigate(`/studentexamattend/${exam._id}`)}
                                                    >
                                                        Attend
                                                    </button>
                                                )}
                                                {buttonState === "view" && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => navigate(`/studentexamattend/${exam._id}`)}
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                {buttonState === "upcoming" && (
                                                    <button className="btn btn-secondary" disabled>
                                                        Upcoming
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
        </>
    )
}
export default StudentExam;