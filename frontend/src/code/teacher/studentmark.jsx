import React, { useState, useEffect } from "react";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";

const formStyle = {
    maxWidth: "900px",
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

function StudentMark() {
    const [degrees, setDegrees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedDegree, setSelectedDegree] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

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
            .then((data) => {
                setSemesters(data);
            })
            .catch((err) => console.error('Error fetching semesters:', err));
    }, []);

    useEffect(() => {
        if (selectedDegree && selectedDepartment && selectedSemester) {
            fetch(`http://localhost:8000/teacherrouter/getStudentExamMarks?degree=${selectedDegree}&department=${selectedDepartment}&semester=${selectedSemester}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('Fetched Exam Marks Data:', data);
                    setStudents(data);
                })
                .catch((err) => console.error('Error fetching student exam marks:', err));
        }
    }, [selectedDegree, selectedDepartment, selectedSemester]);

    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main>
                    <div style={formStyle}>
                        <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>
                            Student Marks
                        </h3>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Degree:</label>
                            <select
                                value={selectedDegree}
                                onChange={(e) => setSelectedDegree(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select Degree</option>
                                {degrees && degrees.length > 0 ? (
                                    degrees.map((degree, index) => (
                                        <option key={index} value={degree}>
                                            {degree}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No Degrees Available</option>
                                )}
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
                                {departments && departments.length > 0 ? (
                                    departments
                                        .filter((dept) => dept.degree === selectedDegree)
                                        .flatMap((dept) => dept.department)
                                        .map((deptName, index) => (
                                            <option key={index} value={deptName}>
                                                {deptName}
                                            </option>
                                        ))
                                ) : (
                                    <option value="">No Departments Available</option>
                                )}
                            </select>
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
                                {semesters && semesters.length > 0 ? (
                                    semesters
                                        .filter((sem) => sem.degree === selectedDegree && sem.department === selectedDepartment)
                                        .flatMap((sem) => sem.semesters)
                                        .map((sem, index) => (
                                            <option key={index} value={sem}>
                                                {sem}
                                            </option>
                                        ))
                                ) : (
                                    <option value="">No Semesters Available</option>
                                )}
                            </select>
                        </div>

                        {students.length > 0 ? (
                            <div>
                                <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>
                                    Students
                                </h3>
                                <table
                                    className="table table-bordered table-secondary table-hover"
                                    style={{ width: "100%", fontSize: "0.9rem", margin: "0 auto" }}
                                >
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Student Name</th>
                                            <th>Exam Type</th>
                                            <th>Mode</th>
                                            <th>Subject</th>
                                            <th>Date of Examination</th>
                                            <th>Maximum Mark</th>
                                            <th>Mark Obtained</th>
                                            <th>Pass / Fail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={index}>
                                                <td>{student.studentid}</td>
                                                <td>{student.studentName}</td>
                                                <td>{student.examType}</td>
                                                <td>{student.mode}</td>
                                                <td>{student.subject}</td>
                                                <td>{new Date(student.dateOfExamination).toLocaleDateString()}</td>
                                                <td>{student.maximumMark}</td>
                                                <td>{student.markObtained}</td>
                                                <td>{student.isPass ? 'Pass' : 'Fail'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ textAlign: "center", color: "white" }}>No students found.</p>
                        )}
                    </div>
                </main>
            </section>
        </>
    );
}

export default StudentMark;