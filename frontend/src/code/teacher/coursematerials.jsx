import React, { useState, useEffect } from 'react';
import TeacherSidebar from "./teachersidebar";
import TeacherNav from './teachernavbar';

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


function CourseMaterials() {
    const [degree, setDegree] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('degree', degree);
        formData.append('department', department);
        formData.append('semester', semester);
        formData.append('title', title);
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/teacherrouter/uploadcoursematerial', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Course material uploaded successfully');
            } else {
                alert('Failed to upload course material');
            }
        } catch (err) {
            console.error('Error uploading course material:', err);
            alert('Failed to upload course material');
        }
    };

    return (
        <>
            <TeacherSidebar />
            <section id='content'>
                <TeacherNav />
                <main>
                    <div style={formStyle}>
                        <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>Upload Course Material</h3>
                        <form onSubmit={handleSubmit}>
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

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Title:</label>
                                <input type="text" style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>File:</label>
                                <input type="file" onChange={handleFileChange} required />
                            </div>

                            <button type="submit" style={buttonStyle}>Upload</button>
                        </form>
                    </div>

                </main>
            </section>
        </>
    );
}

export default CourseMaterials;