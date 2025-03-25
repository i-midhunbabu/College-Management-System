import React, { useState, useEffect } from "react";
import StudentNavBar from "./studentnavbar"
import './student.css'

const tableStyle = {
    width: "100%",
    margin: "20px auto",
    borderCollapse: "collapse",
    textAlign: "center",
};

const thStyle = {
    backgroundColor: "#003399",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
};

const presentStyle = {
    color: "green",
};

const absentStyle = {
    color: "red",
};

function ViewAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const studentData = JSON.parse(localStorage.getItem('get'));
        if (studentData && studentData.studentDetails) {
            fetch(`http://localhost:8000/studentrouter/getattendance?studentId=${studentData.studentDetails._id}`)
                .then((res) => res.json())
                .then((data) => {
                    
                    // Sort the attendance data by date in ascending order
                    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setAttendanceData(sortedData)
                })
                .catch((err) => console.error('Error fetching attendance:', err));
        } else {
            console.error('Student data not found in local storage');
            alert('Student data not found. Please log in again.');
            window.location.href = '/';
        }
    }, []);

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <h3 style={{ textAlign: "center", marginBottom: "20px" }}>View Attendance</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Date Marked</th>
                                <th style={thStyle}>Attendance</th>
                                <th style={thStyle}>Teacher ID</th>
                                <th style={thStyle}>Teacher Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((record) => (
                                <tr key={record._id}>
                                    <td style={tdStyle}>{new Date(record.date).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <span style={record.status === 'Present' ? presentStyle : absentStyle}>
                                            {record.status === 'Present' ? 'P' : 'A'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{record.teacherId.teacherid}</td>
                                    <td style={tdStyle}>{record.teacherId.teachername}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </section>
        </>

    )
}
export default ViewAttendance;