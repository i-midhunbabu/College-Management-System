import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./student.css";
function StudentNavBar() {
    const location = useLocation();
    const [studentName, setStudentName] = useState("");
    const [parentSubMenuOpen, setParentSubMenuOpen] = useState(false);
    const [classSubMenuOpen, setClassSubMenuOpen] = useState(false);
    const [examSubMenuOpen, setExamSubMenuOpen] = useState(false);
    const [recordSubMenuOpen, setRecordSubMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentSubMenuRef = useRef(null);
    const classSubMenuRef = useRef(null);
    const examSubMenuRef = useRef(null);
    const recordSubMenuRef = useRef(null);
    // const [showDropdown, setShowDropdown] = useState(false);
    const [initial, setInitial] = useState('');

    useEffect(() => {
        // Fetch the student's name from local storage or backend
        const studentDetails = JSON.parse(localStorage.getItem('get'));
        const name = studentDetails?.studentDetails?.studentname || 'Student';
        setStudentName(name);
        setInitial(name.charAt(0).toUpperCase());
    }, [])

    // useEffect(() => {
    //     // Fetch student details from localStorage
    //     const storedData = localStorage.getItem("get");
    //     if (storedData) {
    //         const studentData = JSON.parse(storedData);
    //         if (studentData.studentDetails && studentData.studentDetails.studentname) {
    //             setStudentName(studentData.studentDetails.studentname);
    //         }
    //     }
    // }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const toggleParentSubMenu = () => {
        setParentSubMenuOpen(!parentSubMenuOpen);
    };

    const toggleClassSubMenu = () => {
        setClassSubMenuOpen(!classSubMenuOpen);
    };

    const toggleExamSubMenu = () => {
        setExamSubMenuOpen(!examSubMenuOpen);
    };

    const toggleRecordSubMenu = () => {
        setRecordSubMenuOpen(!recordSubMenuOpen);
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
            if (classSubMenuOpen && classSubMenuRef.current && !classSubMenuRef.current.contains(event.target)) {
                setClassSubMenuOpen(false);
            }
            if (examSubMenuOpen && examSubMenuRef.current && !examSubMenuRef.current.contains(event.target)) {
                setExamSubMenuOpen(false);
            }
            if (recordSubMenuOpen && recordSubMenuRef.current && !recordSubMenuRef.current.contains(event.target)) {
                setRecordSubMenuOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, parentSubMenuOpen, classSubMenuOpen, examSubMenuOpen, recordSubMenuOpen]);

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
                        <a href="/" className="nav-link"> <i class='bx bxs-home'></i> Home</a>

                        <li className={location.pathname.startsWith("#") ? "active" : ""} ref={parentSubMenuRef}>
                            <Link to="#" className="nav-link" onClick={toggleParentSubMenu}>
                                <i class='bx bxs-user'></i> Parent
                                {/* <i className={`bx bx-caret-${parentSubMenuOpen === 'parent' ? 'up' : 'down'}`}></i> */}
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

                        <li className={location.pathname.startsWith("#") ? "active" : ""} ref={classSubMenuRef}>
                            <Link to="#" className="nav-link" onClick={toggleClassSubMenu}>
                                <i className='bx bxs-chalkboard'></i> Class
                                {/* <i className={`bx bx-caret-${classSubMenuOpen === 'class' ? 'up' : 'down'}`}></i> */}
                            </Link>
                            {classSubMenuOpen && (
                                <ul className="sub-menu">
                                    <li className={location.pathname === "/viewattendance" ? "active" : ""}>
                                        <Link to="/viewattendance">
                                            <i class='bx bxs-file-find'></i>
                                            <span className="text"> View Attendance</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className={location.pathname.startsWith("#") ? "active" : ""} ref={examSubMenuRef}>
                            <Link to="#" className="nav-link" onClick={toggleExamSubMenu}>
                                <i class='bx bxs-bar-chart-square' undefined ></i> Exam
                                {/* <i className={`bx bx-caret-${examSubMenuOpen === 'exam' ? 'up' : 'down'}`}></i> */}
                            </Link>
                            {examSubMenuOpen && (
                                <ul className="sub-menu">
                                    <li className={location.pathname === "/studentexamlist" ? "active" : ""}>
                                        <Link to="/studentexamlist">
                                            <i class='bx bxs-file-find'></i>
                                            <span className="text"> Exam List</span>
                                        </Link>
                                    </li>
                                    <li className={location.pathname === "/examresult" ? "active" : ""}>
                                        <Link to="/examresult">
                                            <i class='bx bxs-certification'></i>
                                            <span className="text"> Result</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className={location.pathname.startsWith("#") ? "active" : ""} ref={recordSubMenuRef}>
                            <Link to="#" className="nav-link" onClick={toggleRecordSubMenu}>
                                <i class='bx bxs-file'></i> My Records
                                {/* <i className={`bx bx-caret-${recordSubMenuOpen === 'record' ? 'up' : 'down'}`}></i> */}
                            </Link>
                            {recordSubMenuOpen && (
                                <ul className="sub-menu">
                                    <li className={location.pathname === "/studentprogress" ? "active" : ""}>
                                        <Link to="/studentprogress">
                                            <i class='bx bxs-file'></i>
                                            <span className="text"> Progress Report </span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <a href="#" className="notification">
                            <i className='bx bxs-bell' />
                            <span className="num">1</span>
                        </a>

                        <div className="profile-container" ref={dropdownRef}>
                            <a href="#" className="profile" onClick={toggleDropdown}>
                                {/* <img src="/assets2/img/people.png" alt="" /> */}
                                <div className="profile-initial">{initial}</div>
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