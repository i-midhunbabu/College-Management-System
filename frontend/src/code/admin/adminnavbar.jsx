import React, { useState, useRef, useEffect } from "react";
import './admindashboard.css'
function AdminNav() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [initial, setInitial] = useState('');
    const profileRef = useRef(null);

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

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current && !profileRef.current.contains(event.target)
            ) {
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