import React, { useState, useEffect } from "react";
import StudentNavBar from "./studentnavbar";
import './student.css';

function StudentExamResult() {
    const [examResults, setExamResults] = useState([]);

    // Fetch exam results for the logged-in student
    useEffect(() => {
        const fetchExamResults = async () => {
            try {
                const studentData = JSON.parse(localStorage.getItem("get"));
                if (!studentData || !studentData._id) {
                    console.error("Invalid student data in localStorage.");
                    return;
                }

                // Debugging: Log the studentId being sent
                console.log("Sending studentId:", studentData._id);

                const response = await fetch(
                    `http://localhost:8000/studentrouter/getstudentexamresults?studentId=${studentData._id}`
                );
                const data = await response.json();
                console.log("Fetched Exam Results:", data); // Debug log
                if (response.ok) {
                    setExamResults(data);
                } else {
                    console.error("Error fetching exam results:", data.message);
                }
            } catch (err) {
                console.error("Error fetching exam results:", err);
            }
        };

        fetchExamResults();
    }, []);

    const formatTime = (time) => {
        if (!time) {
            return "N/A";
        }
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };
    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <div style={{ padding: "20px" }}>
                        <h2 style={{ textAlign: "center" }}>Exam Results</h2>
                        <br />
                        {examResults.length === 0 ? (
                            <p style={{ textAlign: "center", color: "red" }}>No exam results available.</p>
                        ) : (
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
                                        <th>Mark Obtained</th>
                                        <th>Pass / Fail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examResults.map((exam, index) => (
                                        <tr key={index}>
                                            <td>{exam.examType || "N/A"}</td>
                                            <td>{exam.mode || "N/A"}</td>
                                            <td>{exam.subject || "N/A"}</td>
                                            <td>{exam.dateOfExamination ? new Date(exam.dateOfExamination).toLocaleDateString() : "N/A"}</td>
                                            <td>{formatTime(exam.startTime)}</td>
                                            <td>{formatTime(exam.endTime)}</td>
                                            <td>{exam.maximumMark || "N/A"}</td>
                                            <td>{exam.passMark || "N/A"}</td>
                                            <td>{exam.mark !== undefined ? exam.mark : "N/A"}</td>
                                            <td>
                                                {exam.isPass === "Not Attempted"
                                                    ? "Not Attempted"
                                                    : exam.isPass
                                                        ? "Pass"
                                                        : "Fail"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>                            </table>
                        )}
                    </div>
                </main>
            </section>
        </>
    );
}

export default StudentExamResult;