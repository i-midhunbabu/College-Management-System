import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParentNav from "./parentnavbar";
import ParentSidebar from "./parentsidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ProgressReport() {
    const [studentDetails, setStudentDetails] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const parentData = JSON.parse(localStorage.getItem("get"));
        if (parentData && parentData.parentDetails) {
            const studentId = parentData.parentDetails.studentid;

            // Fetch student details
            fetch(`http://localhost:8000/adminrouter/getstudentdetails/${studentId}`)
                .then((res) => res.json())
                .then((data) => {
                    setStudentDetails({
                        studentname: data.studentname,
                        degree: data.degree,
                        department: data.department,
                        semester: data.semester,
                        studentid: data._id,
                    });

                    // Fetch attendance
                    fetch(`http://localhost:8000/teacherrouter/get?studentId=${data._id}&degree=${data.degree}&department=${data.department}&semester=${data.semester}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (Array.isArray(data)) {
                                const totalDays = data.length;
                                const daysPresent = data.filter((day) => day.status === "Present").length;
                                const daysAbsent = totalDays - daysPresent;
                                setAttendance({ totalDays, daysPresent, daysAbsent });
                            } else {
                                setAttendance({ totalDays: 0, daysPresent: 0, daysAbsent: 0 });
                            }
                        })
                        .catch((err) => console.error("Error fetching attendance:", err));

                    // Fetch subjects for the current semester
                    fetch(`http://localhost:8000/adminrouter/viewSubjects?degree=${data.degree}&department=${data.department}&semester=${data.semester}`)
                        .then((res) => res.json())
                        .then((subjectsData) => {
                            setSubjects(subjectsData.filter((subject) => subject.semester === data.semester));
                        })
                        .catch((err) => console.error("Error fetching subjects:", err));
                })
                .catch((err) => console.error("Error fetching student details:", err));
        }
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add the logo
        const imgData = "/Logo2.png";
        doc.addImage(imgData, "PNG", 80, 10, 50, 20);

        // Add the title
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Student Progress Report", 105, 40, null, null, "center");

        // Add student details
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Student's Name: ${studentDetails.studentname || "N/A"}`, 14, 60);
        doc.text(`Degree and Department: ${studentDetails.degree || "N/A"}, ${studentDetails.department || "N/A"}`, 14, 70);
        doc.text(`Semester: ${studentDetails.semester || "N/A"}`, 14, 80);

        // Add subjects section
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Subjects", 14, 100);

        doc.autoTable({
            startY: 105,
            head: [["Subjects"]],
            body: subjects.map((subject) => [subject.subject]),
            theme: "grid",
            headStyles: { fillColor: [0, 51, 153] }, // Blue header
            styles: { halign: "center" }, // Center align text
        });


        // Add attendance section
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Attendance", 14, doc.lastAutoTable.finalY + 10);

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Total Number of Days", "Days Attended", "Days Absent"]],
            body: [[
                attendance.totalDays || "N/A",
                attendance.daysPresent || "N/A",
                attendance.daysAbsent || "N/A",
            ]],
            theme: "grid",
            headStyles: { fillColor: [0, 51, 153] }, // Blue header
            styles: { halign: "center" }, // Center align text
        });

        // Save the PDF
        doc.save("Student_Progress_Report.pdf");

        // Show Toastify popup
        toast.success("PDF downloaded successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <>
            <ParentSidebar />
            <section id="content">
                <ParentNav />
                <main>
                    <div style={{ padding: "20px" }}>
                        <div className="header" style={{ textAlign: "center" }}>
                            <img src="/Logo2.png" width="260px" alt="Logo" className="logo" />
                            <hr />
                            <h2>Student Report</h2>
                        </div>
                        <br />
                        <div
                            style={{
                                textAlign: "left",
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                marginBottom: "20px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p><strong>Student's Name:</strong> {studentDetails.studentname}</p>
                            <p><strong>Degree and Department:</strong> {studentDetails.degree}, {studentDetails.department}</p>
                            <p><strong>Semester:</strong> {studentDetails.semester}</p>
                        </div>
                        <br />
                        <h3>Subjects</h3>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                marginBottom: "20px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <ul>
                                {subjects.map((subject, index) => (
                                    <li key={index}>{subject.subject}</li>
                                ))}
                            </ul>
                        </div>
                        <br />
                        <h3>Attendance</h3>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                marginBottom: "20px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p><strong>Total Number of Days:</strong> {attendance.totalDays || "N/A"}</p>
                            <p><strong>Days Attended:</strong> {attendance.daysPresent || "N/A"}</p>
                            <p><strong>Days Absent:</strong> {attendance.daysAbsent || "N/A"}</p>
                        </div>
                        <br />
                        <button
                            onClick={generatePDF}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#003399",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "20px",
                            }}
                        >
                            Download PDF
                        </button>
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    );
}

export default ProgressReport;