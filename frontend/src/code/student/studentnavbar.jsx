import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./student.css";
function StudentNavBar() {
    const location = useLocation();
    const [studentName, setStudentName] = useState("");
    const [parentSubMenuOpen, setParentSubMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentSubMenuRef = useRef(null);
    // const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch student details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const studentData = JSON.parse(storedData);
            if (studentData.studentDetails && studentData.studentDetails.studentname) {
                setStudentName(studentData.studentDetails.studentname);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const toggleParentSubMenu = () => {
        setParentSubMenuOpen(!parentSubMenuOpen);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        // setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (parentSubMenuOpen && parentSubMenuRef.current && !parentSubMenuRef.current.contains(event.target)) {
                setParentSubMenuOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, parentSubMenuOpen]);

    return (
        <>
            <div className="student-module">
                {/* Navbar */}
                <nav>
                    {/* <div className="left"> */}
                    <a href="/">
                        <span className="text"><img src='/logo2.png' width={200} /></span>
                    </a>
                    {/* </div> */}

                    <div className="right">
                        <a href="#" className="nav-link"> <i class='bx bxs-home'></i> Home</a>

                        <li className={location.pathname.startsWith("#") ? "active" : ""} ref={parentSubMenuRef}>
                            <Link to="#" className="nav-link" onClick={toggleParentSubMenu}>
                                <i class='bx bxs-user'></i> Parent
                            </Link>
                            {/* <Link to="#" className="nav-link" onClick={toggleParentSubMenu}>
                            <i class='bx bxs-user'></i>Parent
                        </Link> */}
                            {parentSubMenuOpen && (
                                <ul className="sub-menu">
                                    <li className={location.pathname === "/studentaddparent" ? "active" : ""}>
                                        <Link to="/studentaddparent">
                                            <i className='bx bxs-user' />
                                            <span className="text"> Add Parent</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <a href="#" className="nav-link"><i class='bx bxs-chalkboard'></i> Class</a>

                        <a href="#" className="notification">
                            <i className='bx bxs-bell' />
                            <span className="num">8</span>
                        </a>

                        <div className="profile-container" ref={dropdownRef}>
                            <a href="#" className="profile" onClick={toggleDropdown}>
                                <img src="/assets2/img/people.png" alt="" />
                            </a>
                            {isOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/studentprofile" className="profile"><i class='bx bxs-user-circle' style={{ color: '#0000ff' }}></i> {studentName}</Link>
                                    <a href="#" onClick={handleLogout}><i className='bx bx-log-out-circle' style={{ color: ' #b23b3b' }}></i> Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                {/* Navbar */}
            </div>
        </>
    )
}
export default StudentNavBar;