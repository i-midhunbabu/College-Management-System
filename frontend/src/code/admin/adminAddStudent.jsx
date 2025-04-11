import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../admin/adminsidebar";
import AdminNav from "../admin/adminnavbar";

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

const radioLabelStyle = {
    fontWeight: "bold",
    marginRight: "57px",
    textAlign: "right",
    color: "white",

}

const radioLabelStyle1 = {
    fontWeight: "bold",
    marginRight: "5px",
    textAlign: "left",
    color: "white",

}

const radioContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    flex: "2",
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

function AdminAddStudent() {
    const [studentid, setStudentId] = useState('');
    const [studentname, setStudentname] = useState('');
    const [dateofbirth, setDateofBirth] = useState('');
    const [guardianname, setGuardianname] = useState('');
    const [guardianrelation, setGuardianrelation] = useState('');
    const [bloodgroup, setBloodgroup] = useState('');
    const [degree, setDegree] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [tenth, setTenth] = useState('');
    const [twelve, setTwelve] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [departmentData, setDepartmentData] = useState([]); // To store fetched degree and department data
    const [semesterData, setSemesterData] = useState([]); // To store fetched semester data

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

    // Function to generate the number with the first three digits constant
    const generateNumber = () => {
        const constantPart = 'STU'; //Replace with constant part
        const randomPart = Math.floor(Math.random() * 1000) //Generates a random number between 0 & 999
        setStudentId(`${constantPart}${randomPart.toString().padStart(3, '0')}`) //Ensures the random part is always 3 digits
    }

    useEffect(() => {
        generateNumber();
    }, []);

    // Function to handle button click to generate a new number
    // const handleGenerate = () => {
    // generateNumber();
    // };

    // const formattedDateOfBirth = dateofbirth.split('T')[0];


    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedDateOfBirth = new Date(dateofbirth).toISOString().split('T')[0];

        const adminparams = {
            studentid,
            studentname,
            dateofbirth: formattedDateOfBirth,
            guardianname,
            guardianrelation,
            bloodgroup,
            degree,
            department,
            semester,
            tenth,
            twelve,
            email,
            password,
            usertype: 3
        };

        fetch('http://localhost:8000/adminrouter/addstudent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminparams),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                toast.success("Student added successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setStudentId('');
                setStudentname('');
                setDateofBirth('');
                setGuardianname('');
                setGuardianrelation('');
                setBloodgroup('');
                setDegree('');
                setDepartment('');
                setSemester('');
                setTenth('');
                setTwelve('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error("Failed to add student. Try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
                            <h3 style={{ textAlign: "center", color: 'white', marginBottom: "20px", fontWeight: "bolder" }}>Student Registration</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="studentid">Student ID</label>
                                    <input type="text" id="studentid" value={studentid} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter Student ID" style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="studentname">Full Name</label>
                                    <input type="text" id="studentname" value={studentname} onChange={(e) => setStudentname(e.target.value)} placeholder="Enter Student Name" style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateofbirth">Date of Birth</label>
                                    <input type="date" id="dateofbirth" value={dateofbirth} onChange={(e) => setDateofBirth(e.target.value)} style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="guardianname">Guardian's Name</label>
                                    <input type="text" id="guardianname" value={guardianname} onChange={(e) => setGuardianname(e.target.value)} placeholder="Enter Guardian's Name" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="guardianrelation">Relation of Guardian</label>
                                    <div>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Father" name="guardianrelation" checked={guardianrelation === "Father"} onChange={(e) => setGuardianrelation(e.target.value)} /> Father
                                        </label>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Mother" name="guardianrelation" checked={guardianrelation === "Mother"} onChange={(e) => setGuardianrelation(e.target.value)} /> Mother
                                        </label>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Other" name="guardianrelation" checked={guardianrelation === "Other"} onChange={(e) => setGuardianrelation(e.target.value)} /> Other
                                        </label>
                                    </div>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="bloodgroup">Blood Group</label>
                                    <input type="text" id="bloodgroup" value={bloodgroup} onChange={(e) => setBloodgroup(e.target.value)} placeholder="Enter Student Blood Group" style={inputStyle} />
                                </div>

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
                                    <div style={radioContainerStyle}>
                                        {semesterData
                                            .filter((data) => data.degree === degree && data.department === department)
                                            .flatMap((data) => data.semesters)
                                            .map((sem, index) => (
                                                <label key={index} style={radioLabelStyle1}>
                                                    <input
                                                        type="radio"
                                                        value={sem}
                                                        name="semester"
                                                        checked={semester === sem}
                                                        onChange={(e) => setSemester(e.target.value)}
                                                    />{" "}
                                                    {sem}
                                                </label>
                                            ))}
                                    </div>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="tenth">10th CGPA(or %)</label>
                                    <input type="number" id="tenth" value={tenth} onChange={(e) => setTenth(e.target.value)} placeholder="Enter the CGPA or % of Class 10" style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="twelve">12th CGPA(or %)</label>
                                    <input type="number" id="twelve" value={twelve} onChange={(e) => setTwelve(e.target.value)} placeholder="Enter the CGPA or % of Class 12" style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="email">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="password">Password</label>
                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={inputStyle} />
                                </div>

                                <button type="submit" style={buttonStyle}>Submit Application</button>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    )
}
export default AdminAddStudent;