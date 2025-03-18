import React, { useState, useEffect } from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";

const formStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    // backgroundColor: "#e0e1dd",
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

const checkboxContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    fontWeight: "bold",
    color: "white",
};

const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
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


function AdminSem() {
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [semesters, setSemesters] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [degreeList, setDegreeList] = useState([]);

    // Fetch departments from the backend
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
    }, []);

    const semesterList = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

    const handleSemesterChange = (e) => {
        const value = e.target.value;
        setSemesters((prev) =>
            prev.includes(value) ? prev.filter((sem) => sem !== value) : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (semesters.length === 0) {
            alert("Please select at least one semester.");
            return;
        }

        const adminParams = {
            degree,
            department,
            semesters,
        };

        fetch("http://localhost:8000/adminrouter/addsemester", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminParams),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                alert("Semester added successfully!");
                setDegree("");
                setDepartment("");
                setSemesters([]);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to add semester. Try again.");
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
                            <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>
                                Semester Registration
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
                                    <label style={labelStyle} htmlFor="semesters">Semesters:</label>
                                    <div style={checkboxContainerStyle}>
                                        {semesterList.map((sem, index) => (
                                            <label key={index} style={checkboxLabelStyle}>
                                                <input
                                                    type="checkbox"
                                                    value={sem}
                                                    checked={semesters.includes(sem)}
                                                    onChange={handleSemesterChange}
                                                />{" "}
                                                {sem}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" style={buttonStyle}>Add Semester</button>
                            </form>
                        </div>
                    </div >
                </main >
            </section >


        </>
    )
}
export default AdminSem;