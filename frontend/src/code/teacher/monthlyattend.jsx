import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";

const formStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "rgb(85, 96, 216)",
    padding: "20px",
    borderRadius: "25px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const formGroupStyle = {
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const labelStyle = {
    fontWeight: "bold",
    flex: "1",
    marginRight: "10px",
    textAlign: "right",
    color: "white",
};

const inputStyle = {
    flex: "2",
    padding: "8px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
};

const buttonStyle = {
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
};

const attendanceStyle = {
    Present: {
        color: "green",
    },
    Absent: {
        color: "red",
    },
};

function MonthlyAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [month, setMonth] = useState("");
    const [degrees, setDegrees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        // Fetch degrees and departments
        fetch("http://localhost:8000/adminrouter/admindepartmentview")
            .then((res) => res.json())
            .then((data) => {
                setDegrees([...new Set(data.map((dept) => dept.degree))]);
                setDepartments(data);
            })
            .catch((err) => console.error("Error fetching departments:", err));

        // Fetch semesters
        fetch("http://localhost:8000/adminrouter/viewsemesters")
            .then((res) => res.json())
            .then((data) => setSemesters(data))
            .catch((err) => console.error("Error fetching semesters:", err));
    }, []);

    const fetchAttendance = async () => {
        if (!degree || !department || !semester || !month) {
            toast.error("Please select all fields.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/teacherrouter/monthlyattendance?degree=${degree}&department=${department}&semester=${semester}&month=${month}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch attendance data");
            }

            const data = await response.json();
            console.log("Fetched Attendance Data:", data); // Debugging log
            setAttendanceData(data);

            toast.success("Attendance data fetched successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            console.error("Error fetching attendance data:", err);
            toast.error("Failed to fetch attendance data.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const generatePDF = () => {
        if (attendanceData.length === 0) {
            toast.error("No attendance data to generate PDF.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            const doc = new jsPDF();

            // Format the month and year for the title
            const selectedDate = new Date(`${month}-01`);
            const formattedMonthYear = selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });

            doc.text(`Monthly Attendance Report - ${formattedMonthYear}`, 14, 10);

            const tableData = attendanceData.map((record) => [
                record.studentId.studentid,
                record.studentId.studentname,
                record.studentId.degree,
                record.studentId.department,
                record.semester,
                new Date(record.date).toLocaleDateString(),
            ]);

            doc.autoTable({
                head: [["Student ID", "Student Name", "Degree", "Department", "Semester", "Date"]],
                body: tableData,
            });

            doc.save("Monthly_Attendance.pdf");

            toast.success("PDF downloaded successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            console.error("Error generating PDF:", err);
            toast.error("Failed to generate PDF.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main>
                    <div style={formStyle}>
                        <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>Monthly Attendance</h3>
                        <div style={{ marginBottom: "20px" }}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Degree:</label>
                                <select
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Select Degree</option>
                                    {degrees.map((deg, index) => (
                                        <option key={index} value={deg}>
                                            {deg}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Department:</label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Select Department</option>
                                    {departments
                                        .filter((dept) => dept.degree === degree)
                                        .flatMap((dept) => dept.department)
                                        .map((deptName, index) => (
                                            <option key={index} value={deptName}>
                                                {deptName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Semester:</label>
                                <select
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters
                                        .filter((sem) => sem.degree === degree && sem.department === department)
                                        .flatMap((sem) => sem.semesters)
                                        .map((sem, index) => (
                                            <option key={index} value={sem}>
                                                {sem}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Month:</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <button onClick={fetchAttendance} style={buttonStyle}>
                            Fetch Attendance
                        </button>
                        <button onClick={generatePDF} style={buttonStyle}>Download PDF</button>
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    );
}

export default MonthlyAttendance;