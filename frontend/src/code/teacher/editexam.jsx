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
    // justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "flex-start",
};

const labelStyle = {
    fontWeight: "bold",
    // flex: "1",
    marginRight: "10px",
    // textAlign: "right",
    color: "white",
};

const inputStyle = {
    // flex: "2",
    padding: "8px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    width: "100%",
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

const fileLabelStyle = {
    fontWeight: "bold",
    color: "white",
    marginBottom: "5px", // Add some space below the label
};


function EditExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [examType, setExamType] = useState("");
    const [mode, setMode] = useState("");
    const [questionFile, setQuestionFile] = useState(null);
    const [questionFileName, setQuestionFileName] = useState(""); 
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""] }]);
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [dateOfExamination, setDateOfExamination] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [maximumMark, setMaximumMark] = useState("");
    const [passMark, setPassMark] = useState("");
    const [degreeList, setDegreeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/teacherrouter/getexam/${examId}`)
            .then((res) => res.json())
            .then((data) => {
                data.dateOfExamination = new Date(data.dateOfExamination).toISOString().split('T')[0];
                setExamType(data.examType);
                setMode(data.mode);
                setQuestions(data.questions);
                setDegree(data.degree);
                setDepartment(data.department);
                setSemester(data.semester);
                setDateOfExamination(data.dateOfExamination);
                setStartTime(data.startTime);
                setEndTime(data.endTime);
                setMaximumMark(data.maximumMark);
                setPassMark(data.passMark);
                setQuestionFileName(data.questionFile ? data.questionFile.split('\\').pop() : ""); // Set the file name
            })
            .catch((err) => console.error("Error fetching exam data:", err));
    }, [examId]);

    useEffect(() => {
        // Fetch degrees and departments from adminAddDepartment
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

        // Fetch semesters from adminSem
        fetch("http://localhost:8000/adminrouter/viewsemesters")
            .then((res) => res.json())
            .then((data) => setSemesterList(data))
            .catch((error) => {
                console.error("Error fetching semesters:", error);
            });
    }, []);

    const handleExamTypeChange = (e) => {
        setExamType(e.target.value);
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleFileChange = (e) => {
        setQuestionFile(e.target.files[0]);
        setQuestionFileName(e.target.files[0].name); // Update the file name
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = new Date(dateOfExamination).toISOString().split('T')[0];

        try {
            const examData = {
                examType,
                mode,
                degree,
                department,
                semester,
                dateOfExamination: formattedDate,
                startTime,
                endTime,
                maximumMark,
                passMark,
                questions,
            };

            const response = await fetch(`http://localhost:8000/teacherrouter/updateexam/${examId}`, {
                method: "PUT",
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
                                    <select id="examType" value={examType} onChange={handleExamTypeChange} style={inputStyle}>
                                        <option value="">Select Exam Type</option>
                                        <option value="internal">Internal Exam</option>
                                        <option value="semester">Semester Exam</option>
                                    </select>
                                </div>

                                {examType === "internal" && (
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle} htmlFor="mode">Mode</label>
                                        <select id="mode" value={mode} onChange={handleModeChange} style={inputStyle}>
                                            <option value="">Select Mode</option>
                                            <option value="assignment">Assignment</option>
                                            <option value="mcq">MCQ</option>
                                        </select>
                                    </div>
                                )}

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="degree">Degree</label>
                                    <select id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} style={inputStyle} required>
                                        <option value="">Select Degree</option>
                                        {degreeList.map((deg, index) => (
                                            <option key={index} value={deg}>
                                                {deg}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="department">Department</label>
                                    <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle} required>
                                        <option value="">Select Department</option>
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
                                    <label style={labelStyle} htmlFor="semester">Semester</label>
                                    <select id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} style={inputStyle} required>
                                        <option value="">Select Semester</option>
                                        {semesterList
                                            .filter((sem) => sem.degree === degree && sem.department === department)
                                            .flatMap((sem) => sem.semesters)
                                            .map((sem, index) => (
                                                <option key={index} value={sem}>
                                                    {sem}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateOfExamination">Date of Examination</label>
                                    <input
                                        type="date"
                                        id="dateOfExamination"
                                        value={dateOfExamination}
                                        onChange={(e) => setDateOfExamination(e.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="startTime">Start Time</label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="endTime">End Time</label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="maximumMark">Maximum Mark</label>
                                    <input
                                        type="number"
                                        id="maximumMark"
                                        value={maximumMark}
                                        onChange={(e) => setMaximumMark(e.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="passMark">Pass Mark</label>
                                    <input
                                        type="number"
                                        id="passMark"
                                        value={passMark}
                                        onChange={(e) => setPassMark(e.target.value)}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                {mode === "mcq" && (
                                    <div>
                                        {questions.map((q, qIndex) => (
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

                                {mode !== "mcq" && (
                                    <div style={formGroupStyle}>
                                        {questionFileName && <p style={fileLabelStyle}>Uploaded File: {questionFileName}</p>} {/* Display the file name */}
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