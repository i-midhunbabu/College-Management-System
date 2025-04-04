import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

function ExamMark() {
    const { id: examId } = useParams();
    const [studentData, setStudentData] = useState([]);
    const [examDetails, setExamDetails] = useState(null);
    const [passMark, setPassMark] = useState(0);
    const [maximumMark, setMaximumMark] = useState(0);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        // console.log("Exam ID:", examId);
        if (!examId) {
            console.error("Exam ID is undefined");
            return;
        }

        // Fetch exam details (examType and mode)
        fetch(`http://localhost:8000/teacherrouter/getexam/${examId}`)
            .then((res) => res.json())
            .then((data) => {
                setExamDetails(data);
                setPassMark(data.passMark || 0);
                setMaximumMark(data.maximumMark || 0);
            })
            .catch((err) => console.error("Error fetching exam details:", err));

        // Fetch student submissions
        fetch(`http://localhost:8000/teacherrouter/getstudentsubmissions/${examId}`)
            .then((res) => res.json())
            .then((data) => {
                setStudentData(data.submissions || []);
            })
            .catch((err) => console.error("Error fetching student data:", err));
    }, [examId]);

    //Download function (answersheet)
    const handleDownload = (fileName) => {
        if (fileName) {
            // Extract the file name if a full URL is provided
            const extractedFileName = fileName.split('/').pop(); // Get the last part of the URL
            const downloadUrl = `http://localhost:8000/teacherrouter/download/${extractedFileName}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No file available for download.");
        }
    };

    const handleSave = (submissionId, mark, isPass, examId, studentId, studentname, studentid) => {
        if (!submissionId || mark === undefined || isPass === undefined || !examId || !studentId || !studentname || !studentid) {
            console.log("Invalid data. Please check the inputs.");
            return;
        }

        // Validate if the mark exceeds the maximum mark
        if (mark > maximumMark) {
            // console.log(`Mark cannot exceed the maximum mark of ${maximumMark}.`);
            toast.error(`Mark cannot exceed the maximum mark of ${maximumMark}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Save the mark and pass/fail status for the student
        fetch(`http://localhost:8000/teacherrouter/savemark/${submissionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mark, isPass, examId, studentId, studentname, studentid }),
        })
            .then((res) => res.json())
            .then(() => {
                // console.log("Mark saved successfully");
                toast.success("Mark saved successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Fetch updated marks from the backend
                fetch(`http://localhost:8000/teacherrouter/getmarks/${examId}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("Updated marks:", data);
                        setStudentData(data.marks);
                    })
                    .catch((err) => console.error("Error fetching updated marks:", err));
            })
            .catch((err) => {
                console.error("Error saving mark:", err);
                toast.error("Failed to save the mark. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
    };

    const handleViewAnswers = async (submission) => {
        try {
            // Fetch questions from the examinations collection
            const response = await fetch(`http://localhost:8000/teacherrouter/getexam/${submission.examId}`);
            const examDetails = await response.json();

            if (response.ok) {
                // Combine submission answers with questions and correct answers
                const combinedAnswers = examDetails.questions.map((question, index) => ({
                    question: question.question,
                    submittedAnswer: submission.answers ? submission.answers[index] : "Not Answered",
                    correctAnswer: question.correctAnswer,
                }));

                setSelectedSubmission({
                    studentName: submission.studentname,
                    combinedAnswers,
                });
                setModalIsOpen(true);
            } else {
                console.error("Failed to fetch exam details:", examDetails.message);
            }
        } catch (err) {
            console.error("Error fetching exam details:", err);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedSubmission(null);
    };

    return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main>
                    <div>
                        <h2 style={{ textAlign: "center" }}>Exam Marklist</h2>
                        <br />
                        <table
                            className="table table-bordered table-secondary table-hover"
                            style={{ width: "90%", margin: "0 auto" }}
                        >
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Uploaded Answer</th>
                                    <th>Mark</th>
                                    <th>Max Mark</th>
                                    <th>Pass / Fail</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData && studentData.length > 0 ? (
                                    studentData.map((submission, index) => {
                                        // Ensure submission is defined and has the required properties
                                        if (!submission || !submission.studentid || !submission.studentname) {
                                            return null;
                                        }
                                        const isPass = Number(submission.mark || 0) >= passMark;
                                        return (
                                            <tr key={index}>
                                                <td>{submission.studentid}</td>

                                                <td>{submission.studentname}</td>

                                                <td>
                                                    {examDetails?.examType === "internal" &&
                                                        examDetails?.mode === "mcq" ? (
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => handleViewAnswers(submission)}
                                                        >
                                                            View
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {submission.answerUrl && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() => handleDownload(submission.answerUrl)}
                                                                        download
                                                                    >
                                                                        Download
                                                                    </button>
                                                                    &nbsp;
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        onClick={() => window.open(submission.answerUrl, "_blank")}
                                                                    >
                                                                        View
                                                                    </button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        value={submission.mark || ""}
                                                        onChange={(e) =>
                                                            setStudentData((prev) =>
                                                                prev.map((s, i) =>
                                                                    i === index
                                                                        ? { ...s, mark: e.target.value }
                                                                        : s
                                                                )
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>{examDetails.maximumMark}</td>

                                                <td>{isPass ? "Pass" : "Fail"}</td>

                                                <td>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleSave(
                                                            submission._id,
                                                            Number(submission.mark),
                                                            isPass,
                                                            examId,
                                                            submission.studentId,
                                                            submission.studentname,
                                                            submission.studentid)}
                                                    >
                                                        Save
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                            No student data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
            <ToastContainer />

            {/* Modal for viewing answers */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="View Submitted Answers"
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        width: "40%",
                        maxHeight: "80%",
                        overflow: "auto",
                        zIndex: 1050,
                        backgroundColor: "white",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        position: "fixed",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1040,
                    },
                }}
            >
                <h2>Submitted Answers</h2>
                {selectedSubmission && selectedSubmission.combinedAnswers ? (
                    <div>
                        <p>
                            <strong>Student Name:</strong> {selectedSubmission.studentName}
                        </p>
                        {selectedSubmission.combinedAnswers.map((item, index) => (
                            <div key={index} style={{ marginBottom: "15px" }}>
                                <p>
                                    <strong>Q{index + 1}:</strong> {item.question}
                                </p>
                                <p>
                                    <strong>Submitted Answer:</strong> {item.submittedAnswer || "Not Answered"}
                                </p>
                                <p>
                                    <strong>Correct Answer:</strong> {item.correctAnswer || "Not Available"}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        style={{
                                            color:
                                                item.submittedAnswer === item.correctAnswer
                                                    ? "green"
                                                    : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item.submittedAnswer === item.correctAnswer
                                            ? "Correct"
                                            : "Incorrect"}
                                    </span>
                                </p>
                            </div>
                        ))}

                        <table
                            className="table table-bordered"
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                borderCollapse: "collapse",
                                textAlign: "left",
                            }}
                            border="2"
                        >
                            <thead>
                                <tr>
                                    <th style={{ padding: "10px" }}>No. of Questions</th>
                                    <th style={{ padding: "10px" }}>No. of Correct Answers</th>
                                    <th style={{ padding: "10px" }}>No. of Incorrect Answers</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        {selectedSubmission.combinedAnswers.length}
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center", color: "green" }}>
                                        {
                                            selectedSubmission.combinedAnswers.filter(
                                                (item) => item.submittedAnswer === item.correctAnswer
                                            ).length
                                        }
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center", color: "red" }}>
                                        {
                                            selectedSubmission.combinedAnswers.filter(
                                                (item) => item.submittedAnswer !== item.correctAnswer
                                            ).length
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <p>No answers submitted.</p>
                )}
                <button className="btn btn-danger" onClick={closeModal}>
                    Close
                </button>
            </Modal>
        </>
    );
}

export default ExamMark;