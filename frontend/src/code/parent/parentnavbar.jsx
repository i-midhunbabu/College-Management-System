import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './parentdashboard.css';

function ParentNav() {
    const [parentName, setParentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const [initial, setInitial] = useState('');

    useEffect(() => {
        // Fetch the parent's name from local storage or backend
        const parentDetails = JSON.parse(localStorage.getItem('get'));
        const name = parentDetails?.parentDetails?.parentname || 'Parent';
        setParentName(name);
        setInitial(name.charAt(0).toUpperCase());
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const storedData = localStorage.getItem("get");
                if (storedData) {
                    const parentData = JSON.parse(storedData);
                    const parentId = parentData.parentDetails?.parentid;

                    if (parentId) {
                        const response = await fetch(`http://localhost:8000/parentrouter/getNotifications/${parentId}`);
                        const data = await response.json();
                        setNotifications(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
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
                <div className="navbar-in">
                    {/* Notification Bell */}
                    <div className="notification-bell" ref={notificationRef}>
                        <a href="#" onClick={toggleNotifications}>
                            <i className="bx bxs-bell"></i>
                            {notifications.length > 0 && (
                                <span className="notification-badge">{notifications.length}</span>
                            )}
                        </a>
                        {showNotifications && (
                            <div className="notification-dropdown">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="notification-item">
                                            {notification.message}
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification-item">No notifications</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="profile-container" ref={dropdownRef}>
                        <a href="#" className="profile" onClick={toggleDropdown}>
                            <div className="profile-initial">{initial}</div>
                        </a>
                        {isOpen && (
                            <div className="dropdown-menu">
                                <Link to="/parentprofile" className="profile">
                                    <i className='bx bxs-user-circle' style={{ color: '#0000ff' }}></i> {parentName}
                                </Link>
                                <a href="#" onClick={handleLogout}>
                                    Logout <i className='bx bx-log-out-circle' style={{ color: ' #b23b3b' }}></i>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default ParentNav;