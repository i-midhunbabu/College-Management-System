import React, { useState, useRef, useEffect } from "react";
import './admindashboard.css'
function AdminNav() {
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [initial, setInitial] = useState('');
    const profileRef = useRef(null);
    const bellRef = useRef(null);

    useEffect(() => {
        // Fetch the admin's name from local storage or backend
        const adminDetails = JSON.parse(localStorage.getItem('get'));
        const name = adminDetails?.adminDetails?.adminname || 'Admin';
        setAdminName(name);
        setInitial(name.charAt(0).toUpperCase());
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const toggleBellDropdown = () => {
        setIsBellOpen(!isBellOpen);
        setIsProfileOpen(false);
        fetchNotifications();
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsBellOpen(false);
    };

    const fetchNotifications = () => {
        fetch('http://localhost:8000/adminrouter/getnotifications')
            .then((res) => res.json())
            .then((data) => setNotifications(data))
            .catch((err) => console.error("Error fetching notifications:", err));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                bellRef.current && !bellRef.current.contains(event.target) &&
                profileRef.current && !profileRef.current.contains(event.target)
            ) {
                setIsBellOpen(false);
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
                <div className="nav-items">
                    <div className="notification" ref={bellRef}>
                        <a
                            href="#"
                            onClick={toggleBellDropdown}
                        >
                            <i className='bx bxs-bell' />
                            <span className="num">{notifications.length}</span>
                        </a>
                        {isBellOpen && (
                            <div className="dropdown-menu">
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
                    <div className="profile-container" ref={profileRef}>
                        <a href="#" className="profile" onClick={toggleProfileDropdown}>
                            <div className="profile-initial">{initial}</div>
                        </a>
                        {isProfileOpen && (
                            <div className="dropdown-menu">
                                <a href="#" onClick={handleLogout}>
                                    Logout <i className='bx bx-log-out-circle' style={{ color: '#b23b3b' }}></i>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* Navbar */}
        </>
    )
}
export default AdminNav;