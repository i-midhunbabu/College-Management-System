import React, { useState, useEffect, useRef } from "react";
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

function TeacherExam() {
    const [examType, setExamType] = useState("");
    const [mode, setMode] = useState("");
    const [questionFile, setQuestionFile] = useState(null);
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""] }]);
    const [degree, setDegree] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [dateOfExamination, setDateOfExamination] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [maximumMark, setMaximumMark] = useState("");
    const [passMark, setPassMark] = useState("");
    const [degreeList, setDegreeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const fileInputRef = useRef(null);

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

    // Fetch subjects when degree, department, and semester are selected
    useEffect(() => {
        if (degree && department && semester) {
            fetchSubjects(degree, department, semester);
        }
    }, [degree, department, semester]);

    const fetchSubjects = async (degree, department, semester) => {
        try {
            const response = await fetch(
                `http://localhost:8000/teacherrouter/getsubjects?degree=${encodeURIComponent(degree)}&department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}`
            );
            const data = await response.json();
            setSubjects(data);
        } catch (err) {
            console.error("Error fetching subjects:", err);
        }
    };

    const handleExamTypeChange = (e) => {
        setExamType(e.target.value);
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleFileChange = (e) => {
        setQuestionFile(e.target.files[0]);
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
                subject,
                dateOfExamination: formattedDate,
                startTime,
                endTime,
                maximumMark,
                passMark,
                // questions,
            };


            // Include questions only if not internal-assignment
            if (!(examType === "internal" && mode === "assignment")) {
                examData.questions = questions;
            }

            const response = await fetch("http://localhost:8000/teacherrouter/createexam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(examData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Exam created successfully:", result);
                if (mode !== "mcq" && questionFile) {
                    await uploadQuestionFile(result.exam._id);
                }

                resetForm();

            } else {
                console.error("Error creating exam:", result);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const uploadQuestionFile = async (examId) => {
        const formData = new FormData();
        formData.append("examId", examId);
        formData.append("file", questionFile);

        try {
            const response = await fetch("http://localhost:8000/teacherrouter/uploadquestionfile", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Question file uploaded successfully:", result);
            } else {
                console.error("Error uploading question file:", result);
            }
        } catch (error) {
            console.error("Error uploading question file:", error);
        }
    };

    const resetForm = () => {
        setExamType("");
        setMode("");
        setQuestionFile(null);
        setQuestions([{ question: "", options: ["", "", "", ""] }]);
        setDegree("");
        setDepartment("");
        setSemester("");
        setSubject("");
        setSubjects([]);
        setDateOfExamination("");
        setStartTime("");
        setEndTime("");
        setMaximumMark("");
        setPassMark("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle} htmlFor="mode">Mode:</label>
                                        <select id="mode" value={mode} onChange={handleModeChange} style={inputStyle}>
                                            <option value="">Select Mode</option>
                                            <option value="assignment">Assignment</option>
                                            <option value="mcq">MCQ</option>
                                        </select>
                                    </div>
                                )}

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="degree">Degree:</label>
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
                                    <label style={labelStyle} htmlFor="department">Department:</label>
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
                                    <label style={labelStyle} htmlFor="semester">Semester:</label>
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
                                    <label style={labelStyle} htmlFor="subject">Subject:</label>
                                    <select 
                                        id="subject" 
                                        value={subject} 
                                        onChange={(e) => setSubject(e.target.value)} 
                                        style={inputStyle} 
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                            {subjects.map((sub, index) => (
                                            <option key={index} value={sub.subject}>
                                                {sub.subject}
                                            </option>
                                        ))
                                    }
                                    </select>
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle} htmlFor="dateOfExamination">Date of Examination:</label>
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
                                    <label style={labelStyle} htmlFor="startTime">Start Time:</label>
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
                                    <label style={labelStyle} htmlFor="endTime">End Time:</label>
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
                                    <label style={labelStyle} htmlFor="maximumMark">Maximum Mark:</label>
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
                                    <label style={labelStyle} htmlFor="passMark">Pass Mark:</label>
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
                                        <button type="submit" style={buttonStyle}>Submit Questions</button>
                                    </div>
                                )}
                                {mode !== "mcq" && (
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle} htmlFor="questionFile">Upload Question:</label>
                                        <input type="file" id="questionFile" onChange={handleFileChange} ref={fileInputRef} />
                                    </div>
                                )}
                                {mode !== "mcq" && (
                                    <button type="submit" style={buttonStyle}>Upload Question</button>
                                )}
                            </form>

                        </div>
                    </div>

                </main>
            </section>
        </>
    )
}
export default TeacherExam;