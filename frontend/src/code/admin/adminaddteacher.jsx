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

const checkboxLabelStyle = {
    fontWeight: "bold",
    marginRight: "80px",
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

function AdminAddTeacher() {
    const [teacherid, setTeacherId] = useState('');
    const [teachername, setTeachername] = useState('');
    const [designation, setDesignation] = useState('');
    const [dateofbirth, setDateofBirth] = useState('');
    const [qualification, setQualification] = useState([]);
    const [salary, setSalary] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    // Function to generate the number with the first three digits constant
    const generateNumber = () => {
        const constantPart = 'EMP'; //Replace with constant part
        const randomPart = Math.floor(Math.random() * 1000) //Generates a random number between 0 & 999
        setTeacherId(`${constantPart}${randomPart.toString().padStart(3, '0')}`) //Ensures the random part is always 3 digits
    }

    useEffect(() => {
        generateNumber();
    }, []);


    const handleQualificationChange = (e) => {
        const value = e.target.value;
        setQualification((prev) =>
            prev.includes(value) ? prev.filter((q) => q !== value) : [...prev, value]
        );
    };

    // const formattedDateOfBirth = dateofbirth.split('T')[0];
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedDateOfBirth = new Date(dateofbirth).toISOString().split('T')[0];

        const adminparams = {
            teacherid,
            teachername,
            designation,
            dateofbirth: formattedDateOfBirth,
            qualification,
            salary,
            email, 
            password,
            usertype:2,
        };

        fetch('http://localhost:8000/adminrouter/addteacher', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminparams),
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            alert("Teacher added successfully!");
            
            setTeacherId('');
            setTeachername('');
            setDesignation('');
            setDateofBirth('');
            setQualification([]);
            setSalary('');
            setEmail('');
            setPassword('');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Failed to add teacher. Try again.");
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
                            <h3 style={{ textAlign: "center", color:'white', marginBottom: "20px", fontWeight: "bolder" }}>Teacher Registration</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="teacherid">Teacher ID</label>
                                    <input type="text" id="teacherid" value={teacherid} onChange={(e) => setTeacherId(e.target.value)} placeholder="Enter Teacher ID" style={inputStyle} />
                                </div>
                                
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="teachername">Full Name</label>
                                    <input type="text" id="teachername" value={teachername} onChange={(e) => setTeachername(e.target.value)} placeholder="Enter Teacher Name" style={inputStyle} />
                                </div>
                                
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="designation">Designation</label>
                                    <input type="text" id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Enter the Designation" style={inputStyle} />
                                </div>
                                
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateofbirth">Date of Birth</label>
                                    <input type="date" id="dateofbirth" value={dateofbirth} onChange={(e) => setDateofBirth(e.target.value)} style={inputStyle} />
                                </div>
                                
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="qualification">Qualification</label> 
                                    <label style={checkboxLabelStyle}>
                                        <input type="checkbox" value="UG" checked={qualification.includes("UG")} onChange={handleQualificationChange} /> UG
                                    </label>
                                    <label style={checkboxLabelStyle}>
                                        <input type="checkbox" value="PG" checked={qualification.includes("PG")} onChange={handleQualificationChange} /> PG
                                    </label>
                                    <label style={checkboxLabelStyle}>
                                        <input type="checkbox" value="PhD" checked={qualification.includes("PhD")} onChange={handleQualificationChange} /> PhD
                                    </label>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="salary">Salary</label>
                                    <input type="number" id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Enter Salary" style={inputStyle} />
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

export default AdminAddTeacher;
