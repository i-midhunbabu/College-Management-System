import React, { useState, useEffect } from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";

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

function AdminSub() {
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");
    const [degreeList, setDegreeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);

    // Fetch degrees, departments, and semesters from the backend
    useEffect(() => {
        fetch("http://localhost:8000/adminrouter/admindepartmentview")
            .then((res) => res.json())
            .then((data) => {
                setDepartmentList(data);
                const uniqueDegrees = [...new Set(data.map((dept) => dept.degree))];
                setDegreeList(uniqueDegrees);
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
            });

        fetch("http://localhost:8000/adminrouter/viewsemesters")
            .then((res) => res.json())
            .then((data) => {
                setSemesterList(data);
            })
            .catch((error) => {
                console.error("Error fetching semesters:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!degree || !department || !semester || !subject) {
            alert("All fields are required.");
            return;
        }

        const subjectParams = {
            degree,
            department,
            semester,
            subject,
        };

        fetch("http://localhost:8000/adminrouter/addsubject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subjectParams),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                alert("Subject added successfully!");
                setDegree("");
                setDepartment("");
                setSemester("");
                setSubject("");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to add subject. Try again.");
            });
    };

    return (
        <>
        <AdminSidebar/>
        <section id="content">
            <AdminNav/>
            <main>
            <div style={{ paddingTop: "60px" }}>
                <div style={formStyle}>
                    <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>
                        Subject Registration
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="degree">Degree:</label>
                            <select
                                id="degree"
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select a Degree</option>
                                {degreeList.map((deg, index) => (
                                    <option key={index} value={deg}>
                                        {deg}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="department">Department:</label>
                            <select
                                id="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select a Department</option>
                                {departmentList
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
                            <label style={labelStyle} htmlFor="semester">Semester:</label>
                            <select
                                id="semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select a Semester</option>
                                {semesterList
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
                            <label style={labelStyle} htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter Subject Name"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <button type="submit" style={buttonStyle}>Add Subject</button>
                    </form>
                </div>
            </div>
            </main>
        </section>
        </>
    )
}
export default AdminSub;