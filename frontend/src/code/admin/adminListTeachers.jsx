import React, { useState, useEffect } from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ListTeachers() {
    const [viewdata, setViewdata] = useState([]);
    const [refresh, setRefresh] = useState('');
    // const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [assignedClass, setAssignedClass] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    // Fetch teachers
    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/admingetteacher').then((res) => res.json()).then((result) => {
            setViewdata(result)
        })
            .catch((err) => console.error(err));
    }, [refresh])

    // Fetch departments
    useEffect(() => {
        fetch("http://localhost:8000/adminrouter/admindepartmentview")
            .then((res) => res.json())
            .then((result) => {
                setDepartments(result);
            })
            .catch((err) => console.error(err));
    }, []);

    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
        setAssignedClass("");
        setSelectedDepartment([]);
    };

    const handleAssign = (e) => {
        e.preventDefault();

        const assignData = {
            teacherid: selectedTeacher.teacherid,
            teachername: selectedTeacher.teachername,
            assignedclass: assignedClass,
            department: selectedDepartment,
        };

        fetch("http://localhost:8000/adminrouter/assignteacher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignData),
        })
            .then((res) => res.json())
            .then((result) => {
                alert("Teacher assigned successfully!");
                setRefresh((prev) => !prev);
                closeModal();
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to assign teacher. Please try again.");
            });
    };

    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div>
                        <h2 style={{ textAlign: 'center' }}>Assign Teachers</h2>
                        <br />
                    </div>
                    <table className="table table-bordered table-secondary table-hover">
                        <thead>
                            <tr>
                                <th>Teacher ID</th>
                                <th>Teacher Name</th>
                                <th>Qualification</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewdata.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.teacherid}</td>
                                    <td>{data.teachername}</td>
                                    <td>{data.qualification.join(', ')}</td>
                                    <td>
                                        <button type="button" className="btn btn-success" style={{ border: 'none' }} onClick={() => openModal(data)}>
                                            <i class='bx bxs-user-check'> Assign</i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </section>

            {/* Modal for assigning teacher */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Assign Teacher"
                style={{
                    content: {
                        maxWidth: "500px",
                        margin: "auto",
                        borderRadius: "10px",
                        padding: "20px",
                    },
                }}
            >
                <h3 style={{ textAlign: "center" }}>Assign Teacher</h3>
                <form onSubmit={handleAssign}>
                    <div className="form-group">
                        <label>Teacher Name:</label>
                        <input
                            type="text"
                            value={selectedTeacher?.teachername || ""}
                            readOnly
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Assigned Class:</label>
                        <input
                            type="text"
                            value={assignedClass}
                            onChange={(e) => setAssignedClass(e.target.value)}
                            className="form-control"
                            placeholder="Enter class"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Department:</label>
                        <div>
                            {departments.flatMap((dept, deptIndex) =>
                                dept.department.map((subDept, index) => (
                                    <div key={`${deptIndex}-${index}`} className="form-check">
                                        <input
                                            type="checkbox"
                                            id={`dept-${deptIndex}-${index}`}
                                            value={subDept}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDepartment((prev) => [...prev, subDept]);
                                                } else {
                                                    setSelectedDepartment((prev) =>
                                                        prev.filter((d) => d !== subDept)
                                                    );
                                                }
                                            }}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`dept-${deptIndex}-${index}`} className="form-check-label">
                                            {subDept}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <button type="submit" className="btn btn-primary">
                            Assign
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: "10px" }}
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
export default ListTeachers;