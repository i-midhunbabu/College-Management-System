import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";

function ExaminationView() {
    const [examData, setExamData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/teacherrouter/getexams")
            .then((res) => res.json())
            .then((data) => setExamData(data))
            .catch((err) => console.error("Error fetching exam data:", err));
    }, []);

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const handleDelete = async (examId) => {
        try {
            const response = await fetch(`http://localhost:8000/teacherrouter/deleteexam/${examId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setExamData(examData.filter((exam) => exam._id !== examId));
                console.log("Exam deleted successfully");
            } else {
                console.error("Error deleting exam");
            }
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    };


    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
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
                                <th>Exam Mode</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Maximum Mark</th>
                                <th>Pass Mark</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examData.map((exam, index) => (
                                <tr key={index}>
                                    <td>{exam.examType}</td>
                                    <td>{exam.mode}</td>
                                    <td>{exam.department}</td>
                                    <td>{exam.semester}</td>
                                    <td>{new Date(exam.dateOfExamination).toLocaleDateString()}</td>
                                    <td>{formatTime(exam.startTime)}</td>
                                    <td>{formatTime(exam.endTime)}</td>
                                    <td>{exam.maximumMark}</td>
                                    <td>{exam.passMark}</td>
                                    <td>
                                        <Link to={`/editexam/${exam._id}`}>
                                            <button type="button" className="btn btn-primary">
                                            <i class='bx bxs-edit' undefined ></i> 
                                            </button>
                                        </Link>
                                        &nbsp;
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(exam._id)}
                                        >
                                            <i class='bx bx-trash' undefined ></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </section>
        </>
    );
}

export default ExaminationView;