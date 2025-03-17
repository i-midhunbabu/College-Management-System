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
    flexDirection: "column",
    gap: "10px",
    fontWeight: "bold",
    color: "white",
};

// const checkboxLabelStyle = {
//     fontWeight: "bold",
//     marginRight: "80px",
//     textAlign: "right",
//     color: "white",
// };

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

function AdminAddDepartment() {
    // const [teacherid, setTeacherId] = useState('');
    const [degree, setDegree] = useState('');
    const [department, setDepartment] = useState([]);

    // Function to generate the number with the first three digits constant
    // const generateNumber = () => {
    //     const constantPart = 'EMP'; //Replace with constant part
    //     const randomPart = Math.floor(Math.random() * 1000) //Generates a random number between 0 & 999
    //     setTeacherId(`${constantPart}${randomPart.toString().padStart(3, '0')}`) //Ensures the random part is always 3 digits
    // }

    // useEffect(() => {
    //     generateNumber();
    // }, []);

    // List of departments
    const departmentList = [
        "Civil Engineering",
        "Computer Engineering",
        "Electrical and Electronics Engineering",
        "Electronics and Communication Engineering",
        "Mechanical Engineering",
    ];


    const handleDepartmentChange = (e) => {
        const value = e.target.value;
        setDepartment((prev) =>
            prev.includes(value) ? prev.filter((q) => q !== value) : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (department.length === 0) {
            alert("Please select at least one department.");
            return;
        }

        const adminparams = {
            // teacherid,
            degree,
            department,
            // usertype:2,
        };

        fetch('http://localhost:8000/adminrouter/adddepartment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminparams),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                alert("Department added successfully!");

                // setTeacherId('');
                setDegree('');
                setDepartment([]);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Failed to add department. Try again.");
            });
    }

    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div style={{ paddingTop: "60px" }}>
                        <div style={formStyle}>
                            <h3 style={{ textAlign: "center", color: 'white', marginBottom: "20px", fontWeight: "bolder" }}>Department Registration</h3>
                            <form onSubmit={handleSubmit}>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="degree">Degree:</label>
                                    <input type="text" id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Enter your Degree (B.Tech/M.Tech)" style={inputStyle} required />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="department">Department:</label>
                                    <div style={checkboxContainerStyle}>
                                        {departmentList.map((dept, index) => (
                                            <label key={index}>
                                                <input
                                                    type="checkbox"
                                                    value={dept}
                                                    checked={department.includes(dept)}
                                                    onChange={handleDepartmentChange}
                                                />{" "}
                                                {dept}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="teacherid">Teacher ID</label>
                                    <input type="text" id="teacherid" value={teacherid} onChange={(e) => setTeacherId(e.target.value)} placeholder="Enter Teacher ID" style={inputStyle} />
                                </div> */}

                                <button type="submit" style={buttonStyle}>Add Department</button>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}
export default AdminAddDepartment;