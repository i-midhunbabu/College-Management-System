import React, {useState, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import './parentdashboard.css'
function ParentSidebar() {

        const [parentName, setParentName] = useState("");
        const location = useLocation();
        const [openSubMenu, setOpenSubMenu] = useState(null);
        const sidebarRef = useRef(null);
    
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
        
    
        const handleLogout = () => {
            localStorage.clear();
            window.location.href = '/';
        };
    
        //only one submenu open at a time 
        const toggleSubMenu = (menu) => {
            setOpenSubMenu(openSubMenu === menu ? null : menu);
        };
    
        // Handle clicks outside the sidebar
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setOpenSubMenu(null);
            }
        };
    
        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

    return (
        <>
            {/* Sidebar */}
            <section id="sidebar" ref={sidebarRef}>
                <a href="/" className="brand">
                    <span className="text"><img src='/logo2.png' width={200} /></span>
                </a>
                <ul className="side-menu top">
                    <li className="teacher-name">
                        <span style={{ fontSize: '20px' }}>Welcome</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bolder' }}> {parentName || "Parent"} </span>
                    </li>

                    <li className={location.pathname === "/" ? "active" : ""}>
                        <a href="/">
                            <i className='bx bxs-dashboard' />
                            <span className="text">Dashboard</span>
                        </a>
                    </li>

                    <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('student')}>
                            <i className='bx bxs-graduation'></i>
                            <span className="text">Student</span>
                            <i className={`bx bx-caret-${openSubMenu === 'student' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'student' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="/studentprogresscard">
                                        <i className='bx bxs-user-detail' />
                                        <span className="text">Progress Card</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* <li className={location.pathname.startsWith("#") ? "active" : ""}>
                        <a href="#" onClick={() => toggleSubMenu('teacher')}>
                            <i className='bx bxs-chalkboard'></i>
                            <span className="text">Teacher</span>
                            <i className={`bx bx-caret-${openSubMenu === 'teacher' ? 'up' : 'down'}`}></i>
                        </a>
                        {openSubMenu === 'teacher' && (
                            <ul className="sub-menu">
                                <li className={location.pathname === "#" ? "active" : ""}>
                                    <a href="#">
                                        <i class='bx bxs-chat'></i>
                                        <span className="text">Chat with us</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li> */}
                </ul>
                <ul className="side-menu">
                    <li>
                        <a href="#" className="logout" onClick={handleLogout}>
                            <i className='bx bxs-log-out-circle' />
                            <span className="text">Logout</span>
                        </a>
                    </li>
                </ul>
            </section>
            {/* Sidebar */}
        </>
    )
}
export default ParentSidebar;