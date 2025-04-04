import React, { useEffect, useState } from 'react';
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
                setPendingExams(pendingExams.filter((exam) => exam._id !== examId));
                alert(`Exam ${approvalStatus.toLowerCase()} successfully`);
            } else {
                alert('Failed to review exam');
            }
        } catch (err) {
            console.error('Error reviewing exam:', err);
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
                                            <button
                                                onClick={() => handleReview(exam._id, 'Approved')}
                                                className='btn btn-success'
                                            >
                                                Approve
                                            </button>
                                            &nbsp;
                                            <button
                                                onClick={() => {
                                                    const remarks = prompt('Enter remarks for rejection:');
                                                    if (remarks) handleReview(exam._id, 'Rejected', remarks);
                                                }}
                                                className='btn btn-danger'
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
        </>
    );
}

export default AdminExamReview;