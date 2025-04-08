import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from './adminsidebar';
import AdminNav from './adminnavbar';

function AdminExamReview() {
    const [pendingExams, setPendingExams] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/pendingExamApplications')
            .then((res) => res.json())
            .then((data) => setPendingExams(data))
            .catch((err) => console.error('Error fetching pending exams:', err));
    }, []);

    const handleReview = async (examId, approvalStatus, remarks = null) => {
        try {
            const response = await fetch(`http://localhost:8000/adminrouter/reviewExamApplication/${examId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvalStatus, remarks })
            });

            if (response.ok) {
                setPendingExams((prevExams) =>
                    prevExams.map((exam) =>
                        exam._id === examId
                            ? { ...exam, approvalStatus } // Update the status for approved exams
                            : exam
                    ).filter((exam) => exam.approvalStatus !== 'Rejected') // Remove rejected exams
                );

                if (approvalStatus === 'Approved') {
                    toast.success("Exam approved successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else if (approvalStatus === 'Rejected') {
                    toast.error("Exam rejected successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } else {
                toast.error("Failed to review exam. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error('Error reviewing exam:', err);
            toast.error("An error occurred while reviewing the exam.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div>
                        <h2 style={{ textAlign: "center" }}>Pending Exam Applications</h2>
                        <br />
                        <table
                            className="table table-bordered table-secondary table-hover"
                            style={{ width: "90%", margin: "0 auto" }}
                        >
                            <thead style={{ textAlign: "center" }}>
                                <tr>
                                    <th>Exam Type</th>
                                    <th>Mode</th>
                                    <th>Subject</th>
                                    <th>Teacher</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                                {pendingExams.map((exam) => (
                                    <tr key={exam._id}>
                                        <td>{exam.examType}</td>
                                        <td>{exam.mode}</td>
                                        <td>{exam.subject}</td>
                                        <td>{exam.teachername}</td>
                                        <td>
                                            {exam.approvalStatus === 'Approved' ? (
                                                <button className="btn btn-secondary" disabled>
                                                    Approved
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleReview(exam._id, 'Approved')}
                                                        className="btn btn-success"
                                                    >
                                                        Approve
                                                    </button>
                                                    &nbsp;
                                                    <button
                                                        onClick={() => {
                                                            const remarks = prompt('Enter remarks for rejection:');
                                                            if (remarks) handleReview(exam._id, 'Rejected', remarks);
                                                        }}
                                                        className="btn btn-danger"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
            <ToastContainer />
        </>
    );
}

export default AdminExamReview;