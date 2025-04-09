import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";
import './teacher.css';

function Teacherdashboard() {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [parents, setParents] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [teacherName, setTeacherName] = useState("");
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const lastMessageRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('get');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.teacherDetails?.teacherid) {
                setTeacherId(userData.teacherDetails.teacherid);
            }
        }
    }, []);

    useEffect(() => {
        // Fetch teacher details from local storage
        const teacherDetails = JSON.parse(localStorage.getItem("get"));
        const teacherId = teacherDetails?.teacherDetails?.teacherid;
        const name = teacherDetails?.teacherDetails?.teachername || "Teacher";
        setTeacherName(name);

        fetch(`http://localhost:8000/teacherrouter/assignedclasses/${teacherId}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.message) {
                    setAssignedClasses([]); // No assigned classes
                } else {
                    setAssignedClasses(result);
                }
            })
            .catch((err) => console.error("Error fetching assigned classes:", err));
    }, []);

    const toggleChatbox = () => {
        setIsChatboxOpen(!isChatboxOpen);
        setSelectedParent(null);
    };

    const handleParentClick = (parent) => {
        setSelectedParent(parent);
        resetUnreadCount(parent.parentid);
    };

    const handleBackClick = () => {
        setSelectedParent(null);
    };

    useEffect(() => {
        if (isChatboxOpen) {
            fetch("http://localhost:8000/adminrouter/admingetparent")
                .then((response) => response.json())
                .then((data) => setParents(data))
                .catch((error) => console.error("Error fetching parents:", error));
        }
    }, [isChatboxOpen]);

    const fetchMessages = async () => {
        try {
            const requestId = `${selectedParent.parentid}_${teacherId}`;
            console.log("Fetching messages for requestId:", requestId); // Debug log
            const response = await fetch(`http://localhost:8000/parentrouter/getMessages/${requestId}`);
            const data = await response.json();
            
            setMessages(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
            scrollToLastMessage();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const requestId = `${selectedParent.parentid}_${teacherId}`;
            await fetch('http://localhost:8000/parentrouter/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    senderId: teacherId,
                    receiverId: selectedParent.parentid,
                    message: newMessage,
                }),
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (selectedParent) {
            fetchMessages();
        }
    }, [selectedParent]);

    const scrollToLastMessage = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToLastMessage();
    }, [messages]);

    const resetUnreadCount = (parentId) => {
        setUnreadCounts((prev) => ({ ...prev, [parentId]: 0 }));
    };

    const fetchUnreadCounts = async () => {
        try {
            const response = await fetch(`http://localhost:8000/parentrouter/unreadCounts/${teacherId}`);
            const data = await response.json();
            setUnreadCounts(data);
        } catch (error) {
            console.error('Error fetching unread counts:', error);
        }
    };

    useEffect(() => {
        if (isChatboxOpen) {
            fetchUnreadCounts();
        }
    }, [isChatboxOpen]);

    const markMessagesAsRead = async () => {
        try {
            const requestId = `${selectedParent.parentid}_${teacherId}`;
            await fetch('http://localhost:8000/parentrouter/markMessagesAsRead', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, receiverId: teacherId }),
            });
            fetchUnreadCounts();
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    useEffect(() => {
        if (selectedParent) {
            markMessagesAsRead();
        }
    }, [selectedParent]);

    const fetchParents = async () => {
        try {
            console.log("Fetching parents for teacherId:", teacherId); // Debug log
            const response = await fetch(`http://localhost:8000/teacherrouter/filteredparents/${teacherId}`);
            const data = await response.json();
    
            if (data.message) {
                console.log("No parents found:", data.message); // Debug log
                setParents([]); // No parents found
            } else {
                console.log("Fetched Parents:", data); // Debug log
                setParents(data);
            }
        } catch (error) {
            console.error("Error fetching filtered parents:", error);
        }
    };
    
    useEffect(() => {
        if (isChatboxOpen) {
            fetchParents();
        }
    }, [isChatboxOpen]);

        return (
        <>
            <TeacherSidebar />
            <section id="content">
                <TeacherNav />
                <main style={{ paddingBottom: "100px" }}>
                    <div className="add-parent2-container">
                        <div className="add-parent2-box">
                            <Link to="/markattendance" className="add-parent2-link">
                                <i className='bx bxs-check-square'></i>
                                <span>Mark Attendance</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/monthlyattendance" className="add-parent2-link">
                                <i className='bx bxs-download'></i>
                                <span>Monthly Attendance</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/teacherexam" className="add-parent2-link">
                                <i className='bx bx-timer'></i>
                                <span>Schedule Exam</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/examinationlist" className="add-parent2-link">
                                <i className='bx bx-list-ul'></i>
                                <span>Exam List</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/studentmark" className="add-parent2-link">
                                <i className='bx bx-search'></i>
                                <span>View Mark</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box" onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} style={{ cursor: 'pointer' }}>
                            <div className="add-parent2-link">
                                <i className='bx bx-power-off'></i>
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-container">
                        <h2>Hello, <strong>{teacherName}</strong></h2>
                        <div className="assigned-classes-note">
                            <h3>Assigned Classes</h3>
                            {assignedClasses.length > 0 ? (
                                <ul>
                                    {assignedClasses.map((assignedClass, index) => (
                                        <li key={index}>
                                            <strong>Class:</strong> {assignedClass.assignedclass.join(", ")} <br />
                                            <strong>Subject:</strong> {assignedClass.subject.join(", ")} <br />
                                            <strong>Department:</strong> {assignedClass.department.join(", ")}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No classes assigned yet.</p>
                            )}
                        </div>
                    </div>

                    {isChatboxOpen && (
                        <div className="chatbox">
                            <div className="chatbox-header">
                                {selectedParent ? (
                                    <>
                                        <button
                                            className="chatbox-back"
                                            onClick={handleBackClick}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "white",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                marginRight: "10px",
                                            }}
                                        >
                                            &lt;
                                        </button>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#FFFFFF",
                                                    color: "#003399",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {selectedParent.parentname.charAt(0).toUpperCase()}
                                            </div>
                                            <h4 style={{ margin: 0 }}>{selectedParent.parentname}</h4>
                                        </div>
                                    </>
                                ) : (
                                    <h4>Chat</h4>
                                )}
                                <button
                                    className="chatbox-close"
                                    onClick={toggleChatbox}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "white",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✖
                                </button>
                            </div>
                            <div className="chatbox-body">
                                {selectedParent ? (
                                    <div>
                                        <p style={{ textAlign: "center", fontSize: "12px", color: "GrayText" }}>
                                            Conversation with {selectedParent.parentname}
                                        </p>
                                        <div>
                                            {messages.length > 0 ? (
                                                messages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            textAlign: msg.senderId === teacherId ? 'right' : 'left',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                backgroundColor: msg.senderId === teacherId ? '#d1e7dd' : '#f8d7da',
                                                                padding: '10px',
                                                                borderRadius: '10px',
                                                                display: 'inline-block',
                                                                maxWidth: '80%',
                                                            }}
                                                        >
                                                            {msg.message}
                                                        </p>
                                                        <small style={{ color: 'gray', fontSize: '10px' }}>
                                                            {new Date(msg.createdAt).toLocaleString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </small>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ textAlign: "center", color: "GrayText", fontSize: "12px" }}>No messages yet.</p>
                                            )}
                                            <div ref={lastMessageRef}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p>Available Parents:</p>
                                        <ul style={{ listStyleType: "none", padding: 0 }}>
                                            {parents.map((parent) => (
                                                <li
                                                    key={parent.parentid}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleParentClick(parent)}
                                                >
                                                    <div
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#003399",
                                                            color: "white",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            marginRight: "10px",
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {parent.parentname.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{parent.parentname}</strong>{" "}
                                                        <span style={{ color: "#888", fontSize: "10px" }}>
                                                            ({parent.department}, Semester: {parent.semester})
                                                        </span>
                                                        {unreadCounts[parent.parentid] > 0 && (
                                                            <span
                                                                style={{
                                                                    backgroundColor: "red",
                                                                    color: "white",
                                                                    borderRadius: "50%",
                                                                    padding: "2px 6px",
                                                                    marginLeft: "10px",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                {unreadCounts[parent.parentid]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>                                    </>
                                )}
                            </div>
                            {selectedParent && (
                                <div className="chatbox-footer">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedParent.parentname || ''}...`}
                                    />
                                    <button onClick={sendMessage}>
                                        <i className='bx bxs-send'></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </section>
            <a href="#" className="message-icon" onClick={toggleChatbox}>
                <img src="chat1.png" alt="chat" style={{ width: '40px', height: '40px' }} />
            </a>
        </>
    );
}

export default Teacherdashboard;