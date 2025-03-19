import React, { useState, useEffect, useRef } from "react";
import './teacher.css'
function TeacherNav() {
    const [teacherName, setTeacherName] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    // const dropdownRef = useRef(null);
    // const [showDropdown, setShowDropdown] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const [initial, setInitial] = useState('');

    useEffect(() => {
        // Fetch the teacher's name from local storage or backend
        const teacherDetails = JSON.parse(localStorage.getItem('get'));
        const name = teacherDetails?.teacherDetails?.teachername || 'Teacher';
        setTeacherName(name);
        setInitial(name.charAt(0).toUpperCase());

        // Fetch notifications for the teacher
        fetch(`http://localhost:8000/teacherrouter/teachernotifications/${teacherDetails.teacherDetails.teacherid}`)
            .then((res) => res.json())
            .then((result) => {
                setNotifications(result);
            })
            .catch((err) => console.error(err));
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile dropdown if open
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false); // Close notification dropdown if open
    };

    // const toggleDropdown = () => {
    //     setIsOpen(!isOpen);
    //     // setShowDropdown(!showDropdown);
    // };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
                <div className="notification" ref={notificationRef} onClick={toggleNotificationDropdown}>
                    <i className='bx bxs-bell' />
                    <span className="num">{notifications.length}</span>
                    {isNotificationOpen && (
                        <div className="dropdown-menu">
                            {notifications.map((notification, index) => (
                                <div key={index} className="notification-item">
                                    {notification.message}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="profile-container" ref={profileRef}>
                    <a href="#" className="profile" onClick={toggleProfileDropdown}>
                        {/* <img src="/assets2/img/people.png" alt="" /> */}
                        <div className="profile-initial">{initial}</div>
                    </a>
                    {isProfileOpen && (
                        <div className="dropdown-menu">
                            {/* <a href="/teacherprofile" className="profile"><i class='bx bxs-user-circle' style={{color:'#0000ff'}}></i> Profile</a> */}
                            <a href="/teacherprofile" className="profile"><i class='bx bxs-user-circle' style={{ color: '#0000ff' }}></i> {teacherName} </a>
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