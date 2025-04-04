import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
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
        console.log("Uploaded file:", e.target.files[0]);
    };

    const isSubmissionAllowed = () => {
        if (examDetails.attended) {
            return false; // Disable submission if the exam is already attended
        }
        const now = new Date();
        const examDate = new Date(examDetails.dateOfExamination);

        // Set the end time + 5 minutes
        const [endHours, endMinutes] = examDetails.endTime.split(":");
        examDate.setHours(endHours, endMinutes, 0, 0);
        examDate.setMinutes(examDate.getMinutes() + 5); // Add 5 minutes to the end time

        return now <= examDate; // Allow submission only if the current time is before endTime + 5 minutes
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const studentData = JSON.parse(localStorage.getItem("get"));

            formData.append("examId", examId);
            formData.append("studentId", studentData._id); //Object Id of the student
            formData.append("studentid", studentData.studentDetails.studentid); // STU***
            formData.append("studentname", studentData.studentDetails.studentname); // Student name
            formData.append("degree", studentData.studentDetails.degree);
            formData.append("department", studentData.studentDetails.department);
            formData.append("semester", studentData.studentDetails.semester);
            formData.append("examDate", examDetails.dateOfExamination);

            if (examDetails.mode === "assignment" || examDetails.examType === "semester") {
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
                // alert("Answers submitted successfully!");

                // Show success notification based on mode
                if (examDetails.mode === "assignment" || examDetails.examType === "semester") {
                    toast.success("Answer Sheet Submitted Successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                } else if (examDetails.mode === "mcq") {
                    toast.success("Answers Submitted Successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }

            } else {
                console.error("Error submitting answers:", result);

                // Show error notification
                toast.error("Failed to submit answers. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (err) {
            console.error("Error submitting answers:", err);

            // Show error notification
            toast.error("An error occurred while submitting answers.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
                                <h3 style={{ textAlign: "center", margin: 0 }}>{examDetails.subject}</h3>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <p style={{ margin: 0 }}>
                                    Start: {new Date(`1970-01-01T${examDetails.startTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                                </p>
                                <p style={{ margin: 0, color: "red" }}>
                                    End: {new Date(`1970-01-01T${examDetails.endTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                                </p>
                            </div>
                        </div>

                        {(examDetails.mode === "assignment" || examDetails.examType === "semester") && (
                            <>
                                <div>
                                    <h4>Question Paper:</h4>

                                    {/* Preview the question paper */}
                                    {/* <div style={{marginTop: "20px", marginBottom: "20px" }}>
                                    <a href={`http://localhost:8000/uploads/${examDetails.questionFile}`} target="_blank" rel="noopener noreferrer">
                                        Preview Question Paper
                                    </a>
                                    </div>*/}

                                    {/* Display the question paper content */}
                                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                        <iframe
                                            src={`http://localhost:8000/uploads/${examDetails.questionFile}`}
                                            style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
                                            title="Question Paper"
                                        ></iframe>
                                    </div>

                                    {/* Download Question Paper */}
                                    <div style={{ marginBottom: "20px" }}>
                                        <a href={`http://localhost:8000/studentrouter/download/${examDetails.questionFile}`} download>
                                            Download Question Paper
                                        </a>
                                    </div>

                                    {/* Upload Answer Sheet */}
                                    <div style={{ marginBottom: "20px" }}>
                                        <label>
                                            Upload Answer Sheet:
                                            <input
                                                type="file"
                                                onChange={handleAnswerSheetUpload}
                                                disabled={!isSubmissionAllowed()}
                                            />

                                        </label>
                                    </div>

                                    {/* Submit Answer Sheet */}
                                    <div style={{ textAlign: "center" }}>
                                        <button
                                            onClick={handleSubmit}
                                            className="btn btn-primary"
                                            disabled={!isSubmissionAllowed()}
                                        >
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
                                                    style={{ marginRight: "10px" }}
                                                    disabled={!isSubmissionAllowed()}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                ))}

                                <div style={{ textAlign: "center" }}>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-primary"
                                        disabled={!isSubmissionAllowed()}
                                    >
                                        {examDetails.mode === "assignment" ? "Submit Answer Sheet" : "Submit Answers"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    );
}

export default StudentExamAttend;