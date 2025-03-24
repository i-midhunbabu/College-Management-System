import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import './teacher.css'
function TeacherSidebar() {
    const location = useLocation();
    const [teacherName, setTeacherName] = useState("");
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // Fetch teacher details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.teacherDetails && userData.teacherDetails.teachername) {
                setTeacherName(userData.teacherDetails.teachername);
            }
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const toggleSubMenu = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setOpenSubMenu(null);
            }
        }

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
                    {/* <i className='bx bxs-smile' /> */}
                    <span className="text"><img src='/logo2.png' width={200} /></span>
                </a>
                <ul className="side-menu top">
                    {/* Display Teacher's Name */}
                    <li className="teacher-name">
                        <span style={{fontSize:'20px'}}>Welcome</span> 
                        <span style={{fontSize:'20px', fontWeight:'bolder'}}> {teacherName || "Teacher"} </span>
                    </li>
                
                    <li className={location.pathname === "/" ? "active" : ""}>
                        <a href="/">
                            <i className='bx bxs-dashboard' />
                            <span className="text">Dashboard</span>
                        </a>
                    </li>
                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('student')} >
                            <i class='bx bxs-chalkboard'></i>
                            <span className="text">Student</span>
                            <i className={`bx bx-caret-${openSubMenu === 'student' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'student' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="#">
                                        <i className='bx bxs-user' />
                                        <span className="text">Add Teacher</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="#">
                                        <i className='bx bxs-user-detail' />
                                        <span className="text">View Teacher</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('class')}>
                            <i className='bx bxs-graduation'></i>
                            <span className="text">Class</span>
                            <i className={`bx bx-caret-${openSubMenu === 'class' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'class' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="#">
                                        <i class='bx bxs-user-check'></i>
                                        <span className="text">Mark Attendance</span>
                                    </a>
                                </li>
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="#">
                                        <i class='bx bxs-user-check'></i>
                                        <span className="text">Add / Update Mark</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('exam')}>
                            <i className='bx bxs-graduation'></i>
                            <span className="text">Exam</span>
                            <i className={`bx bx-caret-${openSubMenu === 'exam' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'exam' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "/teacherexam" ? "active" : ""}>
                                    <a href="/teacherexam">
                                        <i className='bx bxs-user' />
                                        <span className="text">Schedule Exam</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
                <ul className="side-menu">
                    <li className={location.pathname === "#" ? "active" : ""}>
                        <a href="#">
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
    )
}
export default TeacherSidebar;