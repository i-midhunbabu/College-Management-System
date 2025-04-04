import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import './admindashboard.css';

function AdminSidebar() {
    const [adminName, setAdminName] = useState("");
    const location = useLocation();
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // Fetch admin details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const adminData = JSON.parse(storedData);
            if (adminData.adminDetails && adminData.adminDetails.adminname) {
                setAdminName(adminData.adminDetails.adminname);
            }
        }
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    //only one submenu open at a time 
    const toggleSubMenu = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };

    // Handle clicks outside the sidebar
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setOpenSubMenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Sidebar */}
            <section id="sidebar" ref={sidebarRef}>
                <a href="/" className="brand">
                    <span className="text"><img src='/logo2.png' width={200} /></span>
                </a>
                <ul className="side-menu top">

                    <li className="teacher-name">
                        <span style={{ fontSize: '20px' }}>Welcome</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bolder' }}> {adminName || "Admin"} </span>
                    </li>

                    <li className={location.pathname === "/" ? "active" : ""}>
                        <a href="/">
                            <i className='bx bxs-dashboard' />
                            <span className="text">Dashboard</span>
                        </a>
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('teacher')}>
                            <i className='bx bxs-chalkboard'></i>
                            <span className="text">Teacher</span>
                            <i className={`bx bx-caret-${openSubMenu === 'teacher' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'teacher' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminaddteacher" ? "active" : ""}>
                                    <a href="/adminaddteacher">
                                        <i className='bx bxs-user' />
                                        <span className="text">Add Teacher</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminteacherview" ? "active" : ""}>
                                    <a href="/adminteacherview">
                                        <i className='bx bxs-user-detail' />
                                        <span className="text">Manage Teacher</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminlistteachers" ? "active" : ""}>
                                    <a href="/adminlistteachers">
                                        <i class='bx bxs-user-check'></i>
                                        <span className="text">Assign Teacher</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('student')}>
                            <i className='bx bxs-graduation'></i>
                            <span className="text">Student</span>
                            <i className={`bx bx-caret-${openSubMenu === 'student' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'student' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminaddstudent" ? "active" : ""}>
                                    <a href="/adminaddstudent">
                                        <i className='bx bxs-user' />
                                        <span className="text">Add Student</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminstudentview" ? "active" : ""}>
                                    <a href="/adminstudentview">
                                        <i className='bx bxs-user-detail' />
                                        <span className="text">Manage Student</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('parent')}>
                            <i className='bx bxs-user'></i>
                            <span className="text">Parent</span>
                            <i className={`bx bx-caret-${openSubMenu === 'parent' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'parent' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminparentview" ? "active" : ""}>
                                    <a href="/adminparentview">
                                        <i className='bx bxs-user' />
                                        <span className="text">View Parent</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('department')}>
                            <i className='bx bxs-school'></i>
                            <span className="text">Department</span>
                            <i className={`bx bx-caret-${openSubMenu === 'department' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'department' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminadddepartment" ? "active" : ""}>
                                    <a href="/adminadddepartment">
                                        <i className='bx bxs-plus-square'></i>
                                        <span className="text">Add Department</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/admindepartmentview" ? "active" : ""}>
                                    <a href="/admindepartmentview">
                                        <i className='bx bx-list-check'></i>
                                        <span className="text">View Department</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminsubjects" ? "active" : ""}>
                                    <a href="/adminsubjects">
                                        <i className='bx bxs-book-add'></i>                                        <span className="text">Add Subjects</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminviewsubjects" ? "active" : ""}>
                                    <a href="/adminviewsubjects">
                                        <i className='bx bxs-book-open'></i>
                                        <span className="text">View Subjects</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('semester')}>
                            <i class='bx bx-columns'></i>
                            <span className="text">Semester</span>
                            <i className={`bx bx-caret-${openSubMenu === 'semester' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'semester' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminsemester" ? "active" : ""}>
                                    <a href="/adminsemester">
                                        <i className='bx bxs-plus-square'></i>
                                        <span className="text">Add Semester</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminclass" ? "active" : ""}>
                                    <a href="/adminclass">
                                        <i className='bx bxs-user-detail'></i>
                                        <span className="text">Class Management</span>
                                    </a>
                                </li>

                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('exam')}>
                            <i class='bx bxs-notepad'></i>
                            <span className="text">Exam</span>
                            <i className={`bx bx-caret-${openSubMenu === 'exam' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'exam' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/adminexamination" ? "active" : ""}>
                                    <a href="/adminexamination">
                                        <i className='bx bxs-plus-square'></i>
                                        <span className="text">Create Exam</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/adminExaminationlist" ? "active" : ""}>
                                    <a href="/adminExaminationlist">
                                        <i class='bx bx-list-ul'></i>
                                        <span className="text">Examination List</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "/examapprove" ? "active" : ""}>
                                    <a href="/examapprove">
                                        <i className='bx bxs-check-square'/>
                                        <span className="text">Approve or Reject </span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>

                <ul className="side-menu">
                    <li className={location.pathname === "/adminreg" ? "active" : ""}>
                        <a href="/adminreg">
                            <i className='bx bxs-cog' />
                            <span className="text">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="logout" onClick={handleLogout}>
                            <i className='bx bxs-log-out-circle' />
                            <span className="text">Logout</span>
                        </a>
                    </li>
                </ul>
            </section>
            {/* Sidebar */}
        </>
    );
}

export default AdminSidebar;