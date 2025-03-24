import React, { useState } from "react";
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

function AdminExam() {
    const [examType, setExamType] = useState("");
    const [mode, setMode] = useState("");

    const handleExamTypeChange = (e) => {
        setExamType(e.target.value);
        if (e.target.value === "semester") {
            setMode("semester");
        } else {
            setMode("");
        }
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const examData = {
            examType,
            mode: examType === "semester" ? "semester" : mode,        
        };
        try{
            const response = await fetch("http://localhost:8000/adminrouter/createexam", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(examData),
            });
            const result = await response.json();
            console.log("Exam created successfully:", result);
            alert("Exam created successfully");
            setExamType("");
            setMode("");
        }catch (error) {
            console.log("Error creating exam:", error);

        }
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
                            Examination
                        </h3>
                        <form onSubmit={handleSubmit}>

                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="examType">Exam Type:</label>
                                <select id="examType" value={examType} onChange={handleExamTypeChange} style={inputStyle}>
                                    <option value="">Select Exam Type</option>
                                    <option value="internal">Internal Exam</option>
                                    <option value="semester">Semester Exam</option>
                                </select>
                            </div>

                            {examType === "internal" && (
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="mode">Mode:</label>
                                    <select id="mode" value={mode} onChange={handleModeChange} style={inputStyle}>
                                        <option value="">Select Mode</option>
                                        <option value="assignment">Assignment</option>
                                        <option value="mcq">MCQ</option>
                                    </select>
                                </div>
                            )}
                            <button type="submit" style={buttonStyle}>Create Exam</button>
                        </form>
                    </div>
                </div>
            </main>
        </section>
    </>
)
}
export default AdminExam;