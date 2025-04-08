import React, { useState, useEffect, useRef } from "react";
import './teacher.css';

function TeacherNav() {
    const [teacherName, setTeacherName] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const [initial, setInitial] = useState('');

    useEffect(() => {
        // Fetch the teacher's name from local storage or backend
        const teacherDetails = JSON.parse(localStorage.getItem('get'));
        const name = teacherDetails?.teacherDetails?.teachername || 'Teacher';
        setTeacherName(name);
        setInitial(name.charAt(0).toUpperCase());
    
        // Fetch unread notifications for the teacher
        fetch(`http://localhost:8000/teacherrouter/teachernotifications/${teacherDetails.teacherDetails.teacherid}`)
            .then((res) => res.json())
            .then((result) => {
                setNotifications(result);
                setUnreadCount(result.length); // Set unread count to the number of unread notifications
            })
            .catch((err) => console.error(err));
    }, []);
     
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile dropdown if open
    
        if (!isNotificationOpen) {
            // Mark notifications as read in the backend
            const teacherDetails = JSON.parse(localStorage.getItem('get'));
            fetch(`http://localhost:8000/teacherrouter/marknotificationsasread/${teacherDetails.teacherDetails.teacherid}`, {
                method: 'PUT',
            })
                .then((res) => res.json())
                .then(() => {
                    setUnreadCount(0);
                })
                .catch((err) => console.error("Error marking notifications as read:", err));
        }
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false); // Close notification dropdown if open
    };

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
                <div className="navbar-items">
                    <div className="notification" ref={notificationRef} onClick={toggleNotificationDropdown}>
                        <i className='bx bxs-bell' />
                        {unreadCount > 0 && <span className="num">{unreadCount}</span>}
                        {isNotificationOpen && (
                            <div className="dropdown-menu">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="notification-item">
                                            {notification.message}
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification-item" style={{textAlign: "center", fontWeight: "lighter"}}>Nothing to read</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="profile-container" ref={profileRef}>
                        <a href="#" className="profile" onClick={toggleProfileDropdown}>
                            <div className="profile-initial">{initial}</div>
                        </a>
                        {isProfileOpen && (
                            <div className="dropdown-menu">
                                <a href="/teacherprofile" className="profile"><i className='bx bxs-user-circle' style={{ color: '#0000ff' }}></i> {teacherName} </a>
                                <a href="#" onClick={handleLogout}><i className='bx bx-log-out-circle' style={{ color: ' #b23b3b' }}></i> Logout </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* Navbar */}
        </>
    );
}

export default TeacherNav;