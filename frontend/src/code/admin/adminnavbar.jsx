import React, {useState, useRef, useEffect} from "react";
import './admindashboard.css'
function AdminNav() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [initial, setInitial] = useState('');

    useEffect(() => {
        // Fetch the admin's name from local storage or backend
        const name = localStorage.getItem('adminName') || 'Admin';
        setAdminName(name);
        setInitial(name.charAt(0).toUpperCase());
    }, []);

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
                        {/* <img src="/assets2/img/people.png" alt="" /> */}
                        <div className="profile-initial">{initial}</div>
                    </a>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <a href="#" onClick={handleLogout}>Logout <i className='bx bx-log-out-circle' style={{color:' #b23b3b'}}></i></a>
                        </div>
                    )}
                </div>
            </nav>
            {/* Navbar */}
        </>
    )
}
export default AdminNav;