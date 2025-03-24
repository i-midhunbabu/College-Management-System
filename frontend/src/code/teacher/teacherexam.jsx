import React, { useState } from "react";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";

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


function TeacherExam() {
    const [examType, setExamType] = useState("");
    const [mode, setMode] = useState("");
    const [questionFile, setQuestionFile] = useState(null);

    const handleExamTypeChange = (e) => {
        setExamType(e.target.value);
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleFileChange = (e) => {
        setQuestionFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Exam Type:", examType);
        console.log("Mode:", mode);
        console.log("Question File:", questionFile);
        // Add logic to upload the question file to the backend
    };

    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main>
                    <div style={{ paddingTop: "60px" }}>
                        <div style={formStyle}>
                            <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>Conduct Exam</h3>
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
                                    <div>
                                        <label style={labelStyle} htmlFor="mode">Mode:</label>
                                        <select id="mode" value={mode} onChange={handleModeChange} style={inputStyle}>
                                            <option value="">Select Mode</option>
                                            <option value="assignment">Assignment</option>
                                            <option value="mcq">MCQ</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label style={labelStyle} htmlFor="questionFile">Upload Question:</label>
                                    <input type="file" id="questionFile" onChange={handleFileChange} />
                                </div>
                                <button type="submit" style={buttonStyle}>Upload Question</button>
                            </form>

                        </div>
                    </div>

                </main>
            </section>
        </>
    )
}
export default TeacherExam;