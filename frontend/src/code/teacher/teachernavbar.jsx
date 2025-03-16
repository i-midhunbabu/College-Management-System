import React, { useState, useEffect, useRef } from "react";
import './teacher.css'
function TeacherNav() {
    const [teacherName, setTeacherName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

        useEffect(() => {
            // Fetch teacher details from localStorage
            const storedData = localStorage.getItem("get");
            if (storedData) {
                const teacherData = JSON.parse(storedData);
                if (teacherData.teacherDetails && teacherData.teacherDetails.teachername) {
                    setTeacherName(teacherData.teacherDetails.teachername);
                }
            }
        }, []);
    


    return (
        <>
            {/* Navbar */}
            <nav>
                {/* <i className='bx bx-menu' /> */}
                {/* <a href="#" className="nav-link">Categories</a> */}
                <form action="#">
                    <div className="form-input">
                        <input type="search" placeholder="Search..." />
                        <button type="submit" className="search-btn"><i className='bx bx-search' ></i></button>
                    </div>
                </form>
                {/* <input type="checkbox" id="switch-mode" hidden />
                <label htmlFor="switch-mode" className="switch-mode"></label> */}
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
                            {/* <a href="/teacherprofile" className="profile"><i class='bx bxs-user-circle' style={{color:'#0000ff'}}></i> Profile</a> */}
                            <a href="/teacherprofile" className="profile"><i class='bx bxs-user-circle' style={{color:'#0000ff'}}></i> { teacherName } </a>
                            <a href="#" onClick={handleLogout}><i className='bx bx-log-out-circle' style={{ color: ' #b23b3b' }}></i> Logout </a>
                        </div>
                    )}
                </div>
            </nav>
            {/* Navbar */}

        </>
    )
}
export default TeacherNav;