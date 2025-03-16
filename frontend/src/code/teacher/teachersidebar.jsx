import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import './teacher.css'
function TeacherSidebar() {
    const location = useLocation();
    const [teacherSubMenuOpen, setTeacherSubMenuOpen] = useState(false);
    const [teacherName, setTeacherName] = useState("");
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
    const toggleTeacherSubMenu = () => {
        // setTeacherSubMenuOpen(!teacherSubMenuOpen);
        setTeacherSubMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setTeacherSubMenuOpen(false);
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
                        <a href="#" onClick={toggleTeacherSubMenu} >
                            <i class='bx bxs-chalkboard'></i>
                            <span className="text">Teacher</span>
                            <i className={`bx bx-caret-${teacherSubMenuOpen ? 'up' : 'down'}`}></i>
                        </a>
                        {teacherSubMenuOpen && (
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
                    <li className={location.pathname === "#" ? "active" : ""}>
                        <a href="#">
                            <i class='bx bxs-graduation' ></i>
                            <span className="text">Student</span>
                        </a>
                    </li>
                    <li className={location.pathname === "#" ? "active" : ""}>
                        <a href="#">
                            <i className='bx bxs-message-dots' />
                            <span className="text">Class</span>
                        </a>
                    </li>
                    <li className={location.pathname === "#" ? "active" : ""}>
                        <a href="#">
                            <i className='bx bxs-group' />
                            <span className="text">Exam</span>
                        </a>
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