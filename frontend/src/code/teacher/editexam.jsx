import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";

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

function EditExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [examData, setExamData] = useState({
        examType: "",
        mode: "",
        degree: "",
        department: "",
        semester: "",
        dateOfExamination: "",
        startTime: "",
        endTime: "",
        maximumMark: "",
        passMark: "",
        questions: [{ question: "", options: ["", "", "", ""] }],
        questionFile: null,
    });

    useEffect(() => {
        fetch(`http://localhost:8000/teacherrouter/getexam/${examId}`)
            .then((res) => res.json())
            .then((data) => {

                data.dateOfExamination = new Date(data.dateOfExamination).toISOString().split('T')[0];
                setExamData(data);
            })
            .catch((err) => console.error("Error fetching exam data:", err));
    }, [examId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...examData.questions];
        newQuestions[index].question = value;
        setExamData((prevData) => ({
            ...prevData,
            questions: newQuestions,
        }));
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...examData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setExamData((prevData) => ({
            ...prevData,
            questions: newQuestions,
        }));
    };

    const addQuestion = () => {
        setExamData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, { question: "", options: ["", "", "", ""] }],
        }));
    };

    const handleFileChange = (e) => {
        setExamData((prevData) => ({
            ...prevData,
            questionFile: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/teacherrouter/updateexam/${examId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(examData),
            });

            if (response.ok) {
                console.log("Exam updated successfully");
                navigate("/examinationlist");
            } else {
                console.error("Error updating exam");
            }
        } catch (error) {
            console.error("Error updating exam:", error);
        }
    };

    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main>
                    <div style={{ paddingTop: "60px" }}>
                        <div style={formStyle}>
                            <h3 style={{ textAlign: "center", color: "white", marginBottom: "20px", fontWeight: "bolder" }}>Edit Exam</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="examType">Exam Type</label>
                                    <input
                                        type="text"
                                        id="examType"
                                        name="examType"
                                        value={examData.examType}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="mode">Exam Mode</label>
                                    <input
                                        type="text"
                                        id="mode"
                                        name="mode"
                                        value={examData.mode}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="degree">Degree</label>
                                    <input
                                        type="text"
                                        id="degree"
                                        name="degree"
                                        value={examData.degree}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="department">Department</label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={examData.department}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="semester">Semester</label>
                                    <input
                                        type="text"
                                        id="semester"
                                        name="semester"
                                        value={examData.semester}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateOfExamination">Date of Examination</label>
                                    <input
                                        type="date"
                                        id="dateOfExamination"
                                        name="dateOfExamination"
                                        value={examData.dateOfExamination}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="startTime">Start Time</label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={examData.startTime}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="endTime">End Time</label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={examData.endTime}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="maximumMark">Maximum Mark</label>
                                    <input
                                        type="number"
                                        id="maximumMark"
                                        name="maximumMark"
                                        value={examData.maximumMark}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="passMark">Pass Mark</label>
                                    <input
                                        type="number"
                                        id="passMark"
                                        name="passMark"
                                        value={examData.passMark}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>
                                {examData.mode === "mcq" && (
                                    <div>
                                        {examData.questions.map((q, qIndex) => (
                                            <div key={qIndex} style={{ marginBottom: "20px" }}>
                                                <div style={formGroupStyle}>
                                                    <label style={labelStyle} htmlFor={`question-${qIndex}`}>Question {qIndex + 1}:</label>
                                                    <input
                                                        type="text"
                                                        id={`question-${qIndex}`}
                                                        value={q.question}
                                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                {q.options.map((option, oIndex) => (
                                                    <div key={oIndex} style={formGroupStyle}>
                                                        <label style={labelStyle} htmlFor={`option-${qIndex}-${oIndex}`}>Option {String.fromCharCode(65 + oIndex)}:</label>
                                                        <input
                                                            type="text"
                                                            id={`option-${qIndex}-${oIndex}`}
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                            style={inputStyle}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addQuestion} style={buttonStyle}>Add Question</button>
                                    </div>
                                )}
                                {examData.mode !== "mcq" && (
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle} htmlFor="questionFile">Upload Question:</label>
                                        <input type="file" id="questionFile" onChange={handleFileChange} />
                                    </div>
                                )}
                                <button type="submit" style={buttonStyle}>Update Exam</button>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}

export default EditExam;