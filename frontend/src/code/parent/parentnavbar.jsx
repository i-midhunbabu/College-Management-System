import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './parentdashboard.css'
function ParentNav() {
    const [parentName, setParentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [initial, setInitial] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch the parent's name from local storage or backend
        const parentDetails = JSON.parse(localStorage.getItem('get'));
        const name = parentDetails?.parentDetails?.parentname || 'Parent';
        setParentName(name);
        setInitial(name.charAt(0).toUpperCase());
    }, [])



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
        // Fetch parent details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const parentData = JSON.parse(storedData);
            if (parentData.parentDetails && parentData.parentDetails.parentname) {
                setParentName(parentData.parentDetails.parentname);
            }
        }
    }, []);

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

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const markNotificationsAsRead = async () => {
        try {
            const storedData = localStorage.getItem("get");
            if (storedData) {
                const parentData = JSON.parse(storedData);
                const parentId = parentData.parentDetails?.parentid;

                if (parentId) {
                    await fetch(`http://localhost:8000/parentrouter/markNotificationsAsRead/${parentId}`, {
                        method: "POST",
                    });
                    setNotifications([]);
                }
            }
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };


    return (
        <>
            {/* Navbar */}
            <nav>
                <form action="#">
                    <div className="form-input">
                        <input type="search" placeholder="Search..." />
                        <button type="submit" className="search-btn"><i className='bx bx-search' ></i></button>
                    </div>
                </form>

                <div className="notification-bell" onClick={markNotificationsAsRead}>
                    <i className="bx bxs-bell"></i>
                    {notifications.length > 0 && (
                        <span className="notification-badge">{notifications.length}</span>
                    )}
                </div>

                <div className="profile-container" ref={dropdownRef}>
                    <a href="#" className="profile" onClick={toggleDropdown}>
                        {/* <img src="/assets2/img/people.png" alt="" /> */}
                        <div className="profile-initial">{initial}</div>
                    </a>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <Link to="/parentprofile" className="profile"><i class='bx bxs-user-circle' style={{ color: '#0000ff' }}></i> {parentName} </Link>
                            <a href="#" onClick={handleLogout}>Logout <i className='bx bx-log-out-circle' style={{ color: ' #b23b3b' }}></i></a>
                        </div>
                    )}
                </div>
            </nav>
            {/* Navbar */}
        </>
    )
}
export default ParentNav;