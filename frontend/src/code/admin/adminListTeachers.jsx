import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ListTeachers() {
    const [viewdata, setViewdata] = useState([]);
    const [refresh, setRefresh] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedSemesters, setSelectedSemesters] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [uniqueSubjects, setUniqueSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [degrees, setDegrees] = useState([]);
    const [selectedDegree, setSelectedDegree] = useState("");
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [filteredSemesters, setFilteredSemesters] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/adminrouter/viewsemesters")
            .then((res) => res.json())
            .then((result) => {
                setSemesters(result);
            })
            .catch((err) => console.error("Error fetching semesters:", err));
    }, []);

    useEffect(() => {
        // Fetch degrees
        fetch("http://localhost:8000/adminrouter/getDegreeDepartmentSemester")
            .then((res) => res.json())
            .then((result) => {
                const uniqueDegrees = Array.from(new Set(result.map((item) => item.degree)));
                setDegrees(uniqueDegrees);
            })
            .catch((err) => console.error("Error fetching degrees:", err));
    }, []);

    const handleDegreeChange = (degree) => {
        setSelectedDegree(degree);

        // Filter subjects based on the selected degree
        fetch(`http://localhost:8000/adminrouter/viewsubjects?degree=${degree}`)
            .then((res) => res.json())
            .then((result) => {
                setFilteredSubjects(result.map((subj) => subj.subject));
            })
            .catch((err) => console.error("Error fetching subjects:", err));

        // Filter departments based on the selected degree
        fetch(`http://localhost:8000/adminrouter/admindepartmentview`)
            .then((res) => res.json())
            .then((result) => {
                const degreeDepartments = result.filter((dept) => dept.degree === degree);
                const departments = degreeDepartments.flatMap((dept) => dept.department);
                setFilteredDepartments(departments);
            })
            .catch((err) => console.error("Error fetching departments:", err));

        // Filter semesters based on the selected degree
        const degreeSemesters = semesters.find((sem) => sem.degree === degree);
        setFilteredSemesters(degreeSemesters ? degreeSemesters.semesters : []);
    };

    const handleDepartmentChange = (department, isChecked) => {
        const updatedDepartments = isChecked
            ? [...selectedDepartment, department]
            : selectedDepartment.filter((d) => d !== department);

        setSelectedDepartment(updatedDepartments);

        // Fetch subjects based on the selected degree and updated departments
        if (selectedDegree && updatedDepartments.length > 0) {
            fetch(
                `http://localhost:8000/adminrouter/viewsubjects?degree=${selectedDegree}&department=${updatedDepartments.join(
                    ","
                )}`
            )
                .then((res) => res.json())
                .then((result) => {
                    setFilteredSubjects(result.map((subj) => subj.subject));
                })
                .catch((err) => console.error("Error fetching subjects:", err));
        } else {
            setFilteredSubjects([]);
        }
    };

    // Fetch teachers
    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/admingetteacher').then((res) => res.json()).then((result) => {
            setViewdata(result)
        })
            .catch((err) => console.error(err));
    }, [refresh])

    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
        setSelectedSemesters([]);
        setSelectedDepartment([]);
        setSelectedSubject('');
    };

    const handleSemesterChange = (e) => {
        const value = e.target.value;
        setSelectedSemesters((prev) =>
            prev.includes(value) ? prev.filter((sem) => sem !== value) : [...prev, value]
        );
    };

    const handleAssign = (e) => {
        e.preventDefault();

        const assignData = {
            teacherid: selectedTeacher.teacherid,
            teachername: selectedTeacher.teachername,
            assignedclass: selectedSemesters,
            subject: [selectedSubject],
            department: selectedDepartment,
        };

        fetch("http://localhost:8000/adminrouter/assignteacher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignData),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    toast.success("Teacher assigned successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    setRefresh((prev) => !prev);
                    closeModal();
                } else {
                    toast.error("Failed to assign teacher.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to assign teacher. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
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
                    <table
                        className="table table-bordered table-secondary table-hover"
                        style={{ width: '90%', fontSize: '0.9rem', margin: '0 auto' }}
                    >
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
            <ToastContainer />

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
                        <label>Degree:</label>
                        <select
                            className="form-control"
                            value={selectedDegree}
                            onChange={(e) => handleDegreeChange(e.target.value)}
                            required
                        >
                            <option value="">Select a Degree</option>
                            {degrees.map((degree, index) => (
                                <option key={index} value={degree}>
                                    {degree}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedDegree && (
                        <>
                            <div className="form-group">
                                <label>Assigned Semesters:</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {filteredSemesters.map((sem, index) => (
                                        <label key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input
                                                type="checkbox"
                                                value={sem}
                                                checked={selectedSemesters.includes(sem)}
                                                onChange={handleSemesterChange}
                                            />{" "}
                                            {sem}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Assign Subject:</label>
                                <select
                                    className="form-control"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    required
                                >
                                    <option value="">Select a Subject</option>
                                    {filteredSubjects.map((subject, index) => (
                                        <option key={index} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Department:</label>
                                <div>
                                    {filteredDepartments.map((dept, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                type="checkbox"
                                                id={`dept-${index}`}
                                                value={dept}
                                                onChange={(e) => handleDepartmentChange(e.target.value, e.target.checked)}
                                                className="form-check-input"
                                            />
                                            <label htmlFor={`dept-${index}`} className="form-check-label">
                                                {dept}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

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