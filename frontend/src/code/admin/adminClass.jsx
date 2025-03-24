import React, { useState, useEffect } from "react";
import AdminNav from "./adminnavbar";
import AdminSidebar from "./adminsidebar";

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

const tableStyle = {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
};

const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    backgroundColor: "#003399",
    color: "white",
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    color: "white",
};

function AdminClass() {
    const [degree, setDegree] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [students, setStudents] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [semesterData, setSemesterData] = useState([]);
    const [fetchAttempted, setFetchAttempted] = useState(false);

    // Fetch degrees and departments from the backend
    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/admindepartmentview')
            .then((res) => res.json())
            .then((data) => {
                setDepartmentData(data);
            })
            .catch((err) => {
                console.error("Error fetching department data:", err);
            });
    }, []);

    // Fetch semesters from the backend
    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/viewsemesters')
            .then((res) => res.json())
            .then((data) => {
                setSemesterData(data);
            })
            .catch((err) => {
                console.error("Error fetching semester data:", err);
            });
    }, []);

    const handleFetchStudents = () => {
        setFetchAttempted(true);
        fetch(`http://localhost:8000/adminrouter/getstudentsbyclass?degree=${degree}&department=${department}&semester=${semester}`)
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
            });
    };

    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div style={{ paddingTop: "60px" }}>
                        <div style={formStyle}>
                            <h3 style={{ textAlign: "center", color: 'white', marginBottom: "20px", fontWeight: "bolder" }}>Class Management</h3>
                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="degree">Degree</label>
                                <select
                                    id="degree"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Degree</option>
                                    {departmentData.map((data, index) => (
                                        <option key={index} value={data.degree}>
                                            {data.degree}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="department">Department</label>
                                <select
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departmentData
                                        .filter((data) => data.degree === degree)
                                        .flatMap((data) => data.department)
                                        .map((dept, index) => (
                                            <option key={index} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="semester">Semester</label>
                                <select
                                    id="semester"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {semesterData
                                        .filter((data) => data.degree === degree && data.department === department)
                                        .flatMap((data) => data.semesters)
                                        .map((sem, index) => (
                                            <option key={index} value={sem}>
                                                {sem}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <button type="button" style={buttonStyle} onClick={handleFetchStudents}>Fetch Students</button>

                            {fetchAttempted && (
                                students.length > 0 ? (
                            <div style={{ marginTop: "30px", marginLeft: "20px" }}>
                                <h4 style={{ textAlign: "center", color: 'white', marginBottom: "20px", fontWeight: "bolder" }}>Students List</h4>
                                <table style={tableStyle}>
                                <thead>
                                        <tr>
                                            <th style={thStyle}>Student Name</th>
                                            <th style={thStyle}>Student ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td style={tdStyle}>{student.studentname}</td>
                                            <td style={tdStyle}>{student.studentid}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            ) : (
                                <div style={{ marginTop: "30px", marginLeft: "20px", color: 'white', textAlign: 'center' }}>
                                    <h4>No students found for the selected class.</h4>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}
export default AdminClass;