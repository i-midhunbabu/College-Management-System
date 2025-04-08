import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './parentdashboard.css';

function ParentNav() {
    const [parentName, setParentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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

    return (
        <>
            {/* Navbar */}
            <nav>
                <div className="navbar-in">

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