import React, { useState, useEffect } from 'react';
import StudentNavBar from './studentnavbar';
import './student.css'

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
const inputStyle = {
    flex: "2",
    padding: "8px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
};

const radioContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    flex: "2",
};

const radioLabelStyle1 = {
    fontWeight: "bold",
    marginRight: "5px",
    textAlign: "left",
    color: "white",

}

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


function ViewCourseMaterials() {
    const [degree, setDegree] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [courseMaterials, setCourseMaterials] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

        useEffect(() => {
            const fetchDegreesAndDepartments = async () => {
                try {
                    const response = await fetch('http://localhost:8000/adminrouter/admindepartmentview');
                    const data = await response.json();
                    setDegrees(data.map(item => item.degree));
                    setDepartments(data);
                } catch (err) {
                    console.error('Error fetching degrees and departments:', err);
                }
            };
    
            const fetchSemesters = async () => {
                try {
                    const response = await fetch('http://localhost:8000/adminrouter/viewsemesters');
                    const data = await response.json();
                    setSemesters(data);
                } catch (err) {
                    console.error('Error fetching semesters:', err);
                }
            };
    
            fetchDegreesAndDepartments();
            fetchSemesters();
        }, []);
    

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8000/teacherrouter/coursematerials?degree=${degree}&department=${department}&semester=${semester}`);
            const data = await response.json();
            setCourseMaterials(data);
        } catch (err) {
            console.error('Error fetching course materials:', err);
            alert('Failed to fetch course materials');
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/teacherrouter/coursematerials/${id}/download`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'course-material.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Error downloading course material:', err);
            alert('Failed to download course material');
        }
    };

    return (
        <>
            <section id='content' className="student-module">
                <StudentNavBar />
                <main>
                    <div style={formStyle}>
                        <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>View Course Materials</h3>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Degree:</label>
                            <select
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                style={inputStyle}
                                required
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
                                required
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
                            <div style={radioContainerStyle}>
                                {semesters
                                    .filter((sem) => sem.degree === degree && sem.department === department)
                                    .flatMap((sem) => sem.semesters)
                                    .map((semItem, index) => (
                                        <div key={index}>
                                            <input
                                                type="radio"
                                                name="semester"
                                                style={radioLabelStyle1}
                                                value={semItem}
                                                onChange={(e) => setSemester(e.target.value)}
                                                required
                                            />
                                            <label>{semItem}</label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <button onClick={handleSearch} style={buttonStyle}>Search</button>
                        
                        <div>
                            {courseMaterials.map((material) => (
                                <div key={material._id}>
                                    <h3>{material.title}</h3>
                                    <p>{material.degree} - {material.department} - {material.semester}</p>
                                    <button onClick={() => handleDownload(material._id)} style={buttonStyle}>Download</button>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </section>
        </>
    );
}

export default ViewCourseMaterials;