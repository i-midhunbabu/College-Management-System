import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import TeacherSidebar from './teachersidebar';
import TeacherNav from './teachernavbar';

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

function MarkAttendance() {
    const [degrees, setDegrees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedDegree, setSelectedDegree] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [date, setDate] = useState('');
    const [attendance, setAttendance] = useState({});
    const [teacherId, setTeacherId] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/admindepartmentview')
            .then((res) => res.json())
            .then((data) => {
                setDegrees([...new Set(data.map((dept) => dept.degree))]);
                setDepartments(data);
            })
            .catch((err) => console.error('Error fetching departments:', err));

        fetch('http://localhost:8000/adminrouter/viewsemesters')
            .then((res) => res.json())
            .then((data) => setSemesters(data))
            .catch((err) => console.error('Error fetching semesters:', err));
    }, []);

    useEffect(() => {
        if (selectedDegree && selectedDepartment && selectedSemester) {
            fetch(`http://localhost:8000/adminrouter/getstudentsbyclass?degree=${selectedDegree}&department=${selectedDepartment}&semester=${selectedSemester}`)
                .then((res) => res.json())
                .then((data) => setStudents(data))
                .catch((err) => console.error('Error fetching students:', err));
        }
    }, [selectedDegree, selectedDepartment, selectedSemester]);

    useEffect(() => {
        const teacherData = JSON.parse(localStorage.getItem('get'));
        if (teacherData && teacherData.teacherDetails) {
            setTeacherId(teacherData.teacherDetails._id);
        } else {
            console.error('Teacher data not found in local storage');
            alert('Teacher data not found. Please log in again.');
            window.location.href = '/';
        }
    }, []);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const attendanceData = students.map((student) => ({
            studentId: student._id,
            date,
            status: attendance[student._id] || 'Absent',
            // subject: selectedSubject,
            teacherId,
            degree: selectedDegree,
            department: selectedDepartment,
            semester: selectedSemester
        }));

        try {
            const response = await fetch('http://localhost:8000/teacherrouter/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceData),
            });

            if (response.ok) {
                console.log("Attendance marked successfully");
                // alert('Attendance marked successfully');
                toast.success("Attendance marked successfully!", {
                    position: "top-right",
                    autoClose: 3000, // Auto close after 3 seconds
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } else {
                console.log("Failed to mark attendance");
                // alert('Failed to mark attendance');
                toast.error("Failed to mark attendance", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            console.error('Error marking attendance:', err);
            // alert('Failed to mark attendance');
            toast.error("An error occurred while marking the attendance.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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
                        <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>Mark Attendance</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Degree:</label>
                                <select
                                    value={selectedDegree}
                                    onChange={(e) => setSelectedDegree(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Degree</option>
                                    {degrees.map((degree, index) => (
                                        <option key={index} value={degree}>
                                            {degree}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Department:</label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments
                                        .filter((dept) => dept.degree === selectedDegree)
                                        .flatMap((dept) => dept.department)
                                        .map((deptName, index) => (
                                            <option key={index} value={deptName}>
                                                {deptName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Semester:</label>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {semesters
                                        .filter((sem) => sem.degree === selectedDegree && sem.department === selectedDepartment)
                                        .flatMap((sem) => sem.semesters)
                                        .map((sem, index) => (
                                            <option key={index} value={sem}>
                                                {sem}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <table className="table table-bordered table-secondary table-hover" style={{ width: '100%', fontSize: '0.9rem', margin: '0 auto' }}>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Student ID</th>
                                        <th>Attendance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.studentname}</td>
                                            <td>{student.studentid}</td>
                                            <td>
                                                <select
                                                    value={attendance[student._id] || 'Absent'}
                                                    onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                                                    // style={inputStyle}
                                                    style={{ ...inputStyle, ...attendanceStyle[attendance[student._id] || 'Absent'] }}
                                                >
                                                    <option value="Present" style={attendanceStyle.Present}>P</option>
                                                    <option value="Absent" style={attendanceStyle.Absent}>A</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button type="submit" style={buttonStyle}>Mark Attendance</button>
                        </form>
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    );
}

export default MarkAttendance;