import React, { useState, useEffect } from "react";
import StudentNavBar from "./studentnavbar";

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

const radioLabelStyle = {
    fontWeight: "bold",
    marginRight: "57px",
    textAlign: "right",
    color: "white",
};

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

function StudentAddParent() {
    const [parentid, setParentId] = useState('');
    const [parentname, setParentname] = useState('');
    const [studentid, setStudentId] = useState('');
    const [studentname, setStudentname] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [relation, setRelation] = useState('');
    const [dateofbirth, setDateofBirth] = useState('');
    const [job, setJob] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [guardianName, setGuardianName] = useState('');

    const generateNumber = () => {
        const constantPart = 'PAR';
        const randomPart = Math.floor(Math.random() * 1000);
        setParentId(`${constantPart}${randomPart.toString().padStart(3, '0')}`);
    };

    useEffect(() => {
        generateNumber();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("get");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.studentDetails) {
                if (userData.studentDetails.guardianname) {
                    setGuardianName(userData.studentDetails.guardianname || ''); //fill guardianname from localstorage
                    setParentname(userData.studentDetails.guardianname || '');
                }
                if (userData.studentDetails.studentid) {
                    setStudentId(userData.studentDetails.studentid || ''); //fill studentid from localstorage
                }
                if (userData.studentDetails.studentname) {
                    setStudentname(userData.studentDetails.studentname || ''); //fill studentname from localstorage
                }
                if (userData.studentDetails.guardianrelation) {
                    setRelation(userData.studentDetails.guardianrelation || ''); //fill relation from localstorage
                }
                if (userData.studentDetails.department) {
                    setDepartment(userData.studentDetails.department || ''); //fill department from localstorage
                }
                if (userData.studentDetails.semester) {
                    setSemester(userData.studentDetails.semester || ''); //fill semester from localstorage
                }

            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDateOfBirth = new Date(dateofbirth).toISOString().split('T')[0];
        const parentparams = {
            parentid,
            parentname,
            studentid,
            studentname,
            department,
            semester,
            relation,
            dateofbirth: formattedDateOfBirth,
            job,
            aadhaar,
            mobile,
            email,
            password,
            usertype: 4,
        };

        fetch('http://localhost:8000/studentrouter/addparent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parentparams),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                alert("Parent added successfully!");
                window.location.reload(); // Refresh the page
                setParentId('');
                // generateNumber();
                setParentname('');
                setStudentId('');
                setStudentname('');
                setDepartment('');
                setSemester('');
                setRelation('');
                setDateofBirth('');
                setJob('');
                setAadhaar('');
                setMobile('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Failed to add parent. Try again.");
            });
    };

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <div style={{ paddingTop: "60px" }}>
                        <div style={formStyle}>
                            <h3 style={{ textAlign: "center", color: 'white', marginBottom: "20px", fontWeight: "bolder" }}>Parent Registration</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="parentid">Parent ID</label>
                                    <input type="text" id="parentid" value={parentid} onChange={(e) => setParentId(e.target.value)} placeholder="Enter Parent ID" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="parentname">Guardian Name</label>
                                    <input type="text" id="parentname" value={parentname} onChange={(e) => setParentname(e.target.value)} placeholder="Enter Parent Name" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="studentid">Student ID</label>
                                    <input type="text" id="studentid" value={studentid} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter Student ID" style={inputStyle} />
                                </div>


                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="studentname">Student Name</label>
                                    <input type="text" id="studentname" value={studentname} onChange={(e) => setStudentname(e.target.value)} placeholder="Enter Student Name" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="department">Department</label>
                                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Enter the Department of Student" style={inputStyle} />
                                </div>
                                
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="semester">Semester</label>
                                    <input type="text" id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="Enter the Semester of Student" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="relation">Relation</label>
                                    <div>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Father" name="relation" checked={relation === "Father"} onChange={(e) => setRelation(e.target.value)} /> Father
                                        </label>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Mother" name="relation" checked={relation === "Mother"} onChange={(e) => setRelation(e.target.value)} /> Mother
                                        </label>
                                        <label style={radioLabelStyle}>
                                            <input type="radio" value="Other" name="relation" checked={relation === "Other"} onChange={(e) => setRelation(e.target.value)} /> Other
                                        </label>
                                    </div>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateofbirth">Date of Birth</label>
                                    <input type="date" id="dateofbirth" value={dateofbirth} onChange={(e) => setDateofBirth(e.target.value)} style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="job">Job</label>
                                    <input type="text" id="job" value={job} onChange={(e) => setJob(e.target.value)} placeholder="Enter Job" style={inputStyle} />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="aadhaar">Aadhaar No</label>
                                    <input type="tel" id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="Enter Aadhaar No" style={inputStyle} maxLength="12" />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="mobile">Mobile No</label>
                                    <input type="tel" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile No" style={inputStyle} required pattern="[0-9]{10}" maxLength="10" />
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
        </>
    );
}

export default StudentAddParent;