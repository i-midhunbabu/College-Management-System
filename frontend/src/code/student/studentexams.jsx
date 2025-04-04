import React, { useState, useEffect } from "react";
import StudentNavBar from "./studentnavbar";
import './student.css'
import { useNavigate } from "react-router-dom";

function StudentExam() {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [filter, setFilter] = useState("All"); // Default filter is "Available"
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
            const studentData = JSON.parse(localStorage.getItem("get"));
            const response = await fetch(
                `http://localhost:8000/studentrouter/getstudentexams?degree=${studentDetails.degree}&department=${studentDetails.department}&semester=${studentDetails.semester}&studentId=${studentData._id}`
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
            setFilteredExams(sortedExams);
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


    const isAttendButtonEnabled = (startTime, endTime, dateOfExamination, attended) => {
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

        if (attended) {
            return "attended"; // Exam has been attended and submitted
        } else if (now < examDate) {
            return "upcoming"; // Exam has not started yet
        } else if (now >= examDate && now <= endDate) {
            return "attend"; // Exam is currently available to attend
        } else {
            return "unattended"; // Exam has ended but was not attended
        }
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);

        if (selectedFilter === "All") {
            setFilteredExams(exams);
        } else if (selectedFilter === "Attend") {
            const filtered = exams.filter((exam) => {
                const buttonState = isAttendButtonEnabled(
                    exam.startTime,
                    exam.endTime,
                    exam.dateOfExamination,
                    exam.attended
                );
                return buttonState === "attend";
            });
            setFilteredExams(filtered);
        } else if (selectedFilter === "Upcoming") {
            const filtered = exams.filter((exam) => {
                const buttonState = isAttendButtonEnabled(
                    exam.startTime,
                    exam.endTime,
                    exam.dateOfExamination,
                    exam.attended
                );
                return buttonState === "upcoming";
            });
            setFilteredExams(filtered);
        } else if (selectedFilter === "Attended") {
            const filtered = exams.filter((exam) => {
                const buttonState = isAttendButtonEnabled(
                    exam.startTime,
                    exam.endTime,
                    exam.dateOfExamination,
                    exam.attended
                );
                return buttonState === "attended";
            });
            setFilteredExams(filtered);
        } else if (selectedFilter === "Unattended") {
            const filtered = exams.filter((exam) => {
                const buttonState = isAttendButtonEnabled(
                    exam.startTime,
                    exam.endTime,
                    exam.dateOfExamination,
                    exam.attended
                );
                return buttonState === "unattended";
            });
            setFilteredExams(filtered);
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
                        <h2 style={{ textAlign: "center" }}>Examination List</h2>
                        <div style={{ textAlign: "right", marginBottom: "10px" }}>
                            <select
                                value={filter}
                                onChange={handleFilterChange}
                                className="form-select"
                                style={{ width: "200px", display: "inline-block" }}
                            >
                                <option value="All">All</option>
                                <option value="Attend">Attend</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Attended">Attended</option>
                                <option value="Unattended">Unattended</option>
                            </select>
                        </div>

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
                                {filteredExams.map((exam, index) => {
                                    const buttonState = isAttendButtonEnabled(exam.startTime, exam.endTime, exam.dateOfExamination, exam.attended);
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
                                                {buttonState === "attended" && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => navigate(`/studentexamattend/${exam._id}`)}
                                                    >
                                                        Attended
                                                    </button>
                                                )}
                                                {buttonState === "upcoming" && (
                                                    <button className="btn btn-secondary" disabled>
                                                        Upcoming
                                                    </button>
                                                )}
                                                {buttonState === "unattended" && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => navigate(`/studentexamattend/${exam._id}`)}
                                                    >
                                                        Unattended
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