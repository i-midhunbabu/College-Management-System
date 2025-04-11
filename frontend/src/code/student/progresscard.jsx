import React, { useEffect, useState, useRef } from 'react';
import StudentNavBar from './studentnavbar';
import { useReactToPrint } from 'react-to-print';

const ProgressCard = () => {
    const [studentDetails, setStudentDetails] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [attendance, setAttendance] = useState({});
    const pdfRef = useRef();

    useEffect(() => {
        const studentData = JSON.parse(localStorage.getItem('get'));
        if (!studentData || !studentData.studentDetails) {
            console.error("Student data not found in localStorage");
            return;
        }
        if (studentData && studentData.studentDetails) {
            setStudentDetails(studentData.studentDetails);

            // Fetch subjects for the semester
            fetch(`http://localhost:8000/teacherrouter/getsubjects?degree=${studentData.studentDetails.degree}&department=${studentData.studentDetails.department}&semester=${studentData.studentDetails.semester}`)
                .then((res) => res.json())
                .then((data) => setSubjects(data))
                .catch((err) => console.error("Error fetching subjects:", err));

            // Fetch attendance
            fetch(`http://localhost:8000/studentrouter/getattendance?studentId=${studentData.studentDetails._id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        const totalDays = data.length;
                        const daysPresent = data.filter((day) => day.status === 'Present').length;
                        const daysAbsent = totalDays - daysPresent;
                        setAttendance({ totalDays, daysPresent, daysAbsent });
                    } else {
                        console.error("Attendance data is not an array:", data);
                        setAttendance({ totalDays: 0, daysPresent: 0, daysAbsent: 0 });
                    }
                })
                .catch((err) => console.error("Error fetching attendance:", err));
        } else {
            console.error("Student data not found in localStorage");
        }
    }, []);

    const generatePDF = useReactToPrint({
        content: () => {
            console.log("pdfRef.current:", pdfRef.current);
            return pdfRef.current;
        },
        documentTitle: 'Progress_Report',
    });

    return (
        <>
            <section id='content' className='student-module'>
                <StudentNavBar />
                <main>
                    <div ref={pdfRef} className="progress-card">
                        <div className="header" style={{ textAlign: "center" }}>
                            <img src="/Logo2.png" width="260px" alt="Logo" className="logo" />
                            <hr />
                            <h2>Progress Report</h2>
                        </div>
                        <br />
                        <div
                            className="student-info"
                            style={{
                                textAlign: "left",
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                marginBottom: "20px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                            }}>
                            <p><strong>Student's Name:</strong> {studentDetails.studentname}</p>
                            <p><strong>Degree and Department:</strong> {studentDetails.degree} , {studentDetails.department}</p>
                            <p><strong>Semester:</strong> {studentDetails.semester}</p>
                        </div>
                        <br />
                        <div
                            className="subjects"
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                marginBottom: "20px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <table className='table table-light table-hover' style={{ width: "100%", fontSize: "0.9rem", margin: "0 auto" }}>
                                <thead>
                                    <tr>
                                        <th>Subjects</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject) => (
                                        <tr key={subject.subject}>
                                            <td>{subject.subject}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: "10px",
                                marginBottom: "20px"
                            }}
                        >
                            <div
                                className="attendance"
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    backgroundColor: "#f9f9f9",
                                    margin: "0 0 20px 0",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    width: "70%",
                                    maxWidth: "700px",
                                    minWidth: "200px"
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#4b3621",
                                        color: "white",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        textAlign: "left",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <h4>Attendance</h4>
                                </div>
                                <p><strong>Total Number of Days:</strong> {attendance.totalDays || 'N/A'}</p>
                                <p><strong>Days Attended:</strong> {attendance.daysPresent || 'N/A'}</p>
                                <p><strong>Days Absent:</strong> {attendance.daysAbsent || 'N/A'}</p>
                            </div>
                            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                                <img src="/Logo2.png" alt="Logo" style={{ width: "200px", marginBottom: "10px", display: "block" }} />
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
};

export default ProgressCard;