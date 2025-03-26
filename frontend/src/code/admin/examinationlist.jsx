import React, { useEffect, useState } from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";

function ExaminationList() {
    const [examData, setExamData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/teacherrouter/getexams")
            .then((res) => res.json())
            .then((data) => {
                // Sort exams by date & time in descending order
                    const sortedData = data.sort((a, b) => {
                    const dateA = new Date(`${a.dateOfExamination}T${a.startTime}`);
                    const dateB = new Date(`${b.dateOfExamination}T${b.startTime}`);
                    return dateB - dateA;
                });   
                setExamData(sortedData);
            })
            .catch((err) => console.error("Error fetching exam data:", err));
    }, []);

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div>
                        <h2 style={{ textAlign: "center" }}>Examination List</h2>
                        <br />
                    </div>
                    <table
                        className="table table-bordered table-secondary table-hover"
                        style={{ width: "90%", fontSize: "0.9rem", margin: "0 auto" }}
                    >
                        <thead>
                            <tr>
                                <th>Exam Type</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Maximum Mark</th>
                                <th>Pass Mark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examData.map((exam, index) => (
                                <tr key={index}>
                                    <td>{exam.examType}</td>
                                    <td>{exam.department}</td>
                                    <td>{exam.semester}</td>
                                    <td>{new Date(exam.dateOfExamination).toLocaleDateString()}</td>
                                    <td>{formatTime(exam.startTime)}</td>
                                    <td>{formatTime(exam.endTime)}</td>
                                    <td>{exam.maximumMark}</td>
                                    <td>{exam.passMark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </section>
        </>
    );
}

export default ExaminationList;