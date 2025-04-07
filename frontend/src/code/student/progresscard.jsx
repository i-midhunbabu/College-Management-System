import React, { useEffect, useState, useRef } from 'react';
import StudentNavBar from './studentnavbar';
import { useReactToPrint } from 'react-to-print';
import { PDFExport } from 'react-to-pdf';

const ProgressCard = ({ studentId  }) => {
    const [studentDetails, setStudentDetails] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [marks, setMarks] = useState([]);
    const pdfRef = useRef(); // Reference for the PDF content

    useEffect(() => {
        // Fetch student details from localStorage
        const studentData = JSON.parse(localStorage.getItem('get'));
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

            // Fetch marks
            fetch(`http://localhost:8000/studentrouter/getstudentexamresults?studentId=${studentData.studentDetails._id}`)
                .then((res) => res.json())
                .then((data) => setMarks(data))
                .catch((err) => console.error("Error fetching marks:", err));
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
    useEffect(() => {
        const fetchExaminationsAndMarks = async () => {
            try {
                const studentData = JSON.parse(localStorage.getItem("get"));
                if (!studentData || !studentData.studentDetails) {
                    console.error("Student data not found in localStorage");
                    return;
                }

                const { degree, department, semester, _id: studentId } = studentData.studentDetails;

                // Fetch examinations for the student's degree, department, and semester
                const examsResponse = await fetch(
                    `http://localhost:8000/studentrouter/getstudentexams?degree=${degree}&department=${department}&semester=${semester}&studentId=${studentId}`
                );
                const exams = await examsResponse.json();

                // Fetch marks for the student
                const marksResponse = await fetch(
                    `http://localhost:8000/studentrouter/getstudentexamresults?studentId=${studentId}`
                );
                const marks = await marksResponse.json();

                // Combine examinations with marks
                const combinedData = exams.map((exam) => {
                    const markEntry = marks.find((mark) => mark.examId === exam._id);
                    return {
                        ...exam,
                        mark: markEntry ? markEntry.mark : "Not Attempted",
                        isPass: markEntry ? markEntry.isPass : "Not Attempted",
                    };
                });

                setMarks(combinedData);
            } catch (err) {
                console.error("Error fetching examinations and marks:", err);
            }
        };

        fetchExaminationsAndMarks();
    }, []);

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
                                        <th>No of Internal Exams</th>
                                        <th>No of Semester Exams</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject) => {
                                        const internalExamsAttended = marks.filter(
                                            (mark) => mark.subject === subject.subject && mark.examType === 'internal' && mark.marks !== "Not Attempted"
                                        ).length;

                                        const semesterExamsAttended = marks.filter(
                                            (mark) => mark.subject === subject.subject && mark.examType === 'semester' && mark.marks !== "Not Attempted"
                                        ).length;

                                        return (
                                            <tr key={subject.subject}>
                                                <td>{subject.subject}</td>
                                                <td>{internalExamsAttended || 'N/A'}</td>
                                                <td>{semesterExamsAttended || 'N/A'}</td>
                                            </tr>
                                        );
                                    })}
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
                                {/* <button 
                                onClick={generatePDF} 
                                className="btn btn-primary download-button" 
                                style={{ display: "inline-block", padding: "10px 20px", fontSize: "16px" }}
                                >
                                    Download Report
                                </button> */}
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
};

export default ProgressCard;