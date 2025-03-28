import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentNavBar from "./studentnavbar";

function StudentExamAttend() {
    const { examId } = useParams();
    const [examDetails, setExamDetails] = useState(null);
    const [answers, setAnswers] = useState({});
    const [answerSheet, setAnswerSheet] = useState(null);
    

    // Fetch exam details
    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/studentrouter/getexamdetails/${examId}`);
                const data = await response.json();
                setExamDetails(data);
            } catch (err) {
                console.error("Error fetching exam details:", err);
            }
        };
        fetchExamDetails();
    }, [examId]);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: selectedOption,
        }));
    };

    const handleAnswerSheetUpload = (e) => {
        setAnswerSheet(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const studentData = JSON.parse(localStorage.getItem("student"));
            formData.append("examId", examId);
            formData.append("studentID", studentData.studentDetails.studentid);
            if (examDetails.mode === "assignment") {
                formData.append("answerSheet", answerSheet);
            } else if (examDetails.mode === "mcq") {
                formData.append("answers", JSON.stringify(answers));
            }

            const response = await fetch("http://localhost:8000/studentrouter/submitanswers", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Answers submitted successfully!");
            } else {
                console.error("Error submitting answers:", result);
            }
        } catch (err) {
            console.error("Error submitting answers:", err);
        }
    };

    if (!examDetails) {
        return <p>Loading exam details...</p>;
    }

    

    return (
        <>
            <section id="content" className="student-module">
                <StudentNavBar />
                <main>
                    <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        {/* <h2 style={{ textAlign: "center" }}>Attend Exam</h2> */}
                        {/* <h4>Exam Type: {examDetails.examType}</h4>
                        <h4>Mode: {examDetails.mode}</h4> */}

                        <div style={{ flexGrow: 1, textAlign: "center" }}>
                        <h3 style={{ textAlign: "center", margin:0 }}>{examDetails.subject}</h3>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0 }}>
                                Start: {new Date(`1970-01-01T${examDetails.startTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                            </p>
                            <p style={{ margin: 0, color:"red" }}>
                                End: {new Date(`1970-01-01T${examDetails.endTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                            </p>
                        </div>
                    </div>

                        {examDetails.mode === "assignment" && (
                            <>
                            <div>
                                <h4>Question Paper:</h4>

                                <div style={{marginTop: "20px", marginBottom: "20px" }}>
                                    <a href={`http://localhost:8000/uploads/${examDetails.questionFile}`} target="_blank" rel="noopener noreferrer">
                                        Preview Question Paper
                                    </a>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <a href={`http://localhost:8000/uploads/${examDetails.questionFile}`} target="_blank" rel="noopener noreferrer" download>
                                        Download Question Paper
                                    </a>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label>
                                        Upload Answer Sheet:
                                        <input type="file" onChange={handleAnswerSheetUpload} />
                                    </label>
                                </div>

                                <div style={{textAlign: "center"}}>
                                    <button onClick={handleSubmit} className="btn btn-primary" >
                                        Submit Answer Sheet
                                    </button>
                                </div>
                            </div>
                        </>
                        )}

                        {examDetails.mode === "mcq" && (
                            <>
                                <h4>Questions:</h4>
                                {examDetails.questions.map((question, index) => (
                                    <div key={index}>
                                        <p>
                                            <strong>Q{index + 1}:</strong> {question.question}
                                        </p>
                                        {question.options.map((option, optionIndex) => (
                                            <label key={optionIndex} style={{ marginBottom: "10px", display: "block", paddingLeft: "10px" }}>
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={option}
                                                    onChange={() => handleAnswerChange(index, option)}
                                                    style={{marginRight: "10px"}}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    Submit Answers
                                </button>
                            </>
                        )}
                    </div>
                </main>
            </section>
        </>
    );
}

export default StudentExamAttend;