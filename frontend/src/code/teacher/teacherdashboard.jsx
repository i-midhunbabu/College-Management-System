import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./teachersidebar";
import TeacherNav from "./teachernavbar";
import './teacher.css';

function Teacherdashboard() {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [parents, setParents] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [teacherid, setTeacherId] = useState('');
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const lastMessageRef = useRef(null); // Ref for the last message

    useEffect(() => {
        const storedUser = localStorage.getItem('get');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.teacherDetails?._id) {
                setTeacherId(userData.teacherDetails._id);
            }
        }
    }, []);

    useEffect(() => {
        // Fetch teacher details from local storage
        const teacherDetails = JSON.parse(localStorage.getItem("get"));
        const teacherId = teacherDetails?.teacherDetails?.teacherid;
        const name = teacherDetails?.teacherDetails?.teachername || "Teacher";
        setTeacherName(name);

        // Fetch assigned classes for the teacher
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
        setSelectedUser(null);
    };

    useEffect(() => {
        if (isChatboxOpen) {
            // Fetch parents
            fetch("http://localhost:8000/adminrouter/admingetparent")
                .then((response) => response.json())
                .then((data) => setParents(data))
                .catch((error) => console.error("Error fetching parents:", error));
        }
    }, [isChatboxOpen]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessages();
    };

    const handleBackClick = () => {
        setSelectedUser(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    const fetchMessages = async () => {
        try {
            const requestId = `${selectedUser.parentid}_${teacherid}`;
            // console.log("Fetching messages for Request ID:", requestId);

            const response = await fetch(`http://localhost:8000/parentrouter/getMessages/${requestId}`);
            const data = await response.json();
            // console.log("Fetched messages:", data);

            setMessages(data);
            scrollToLastMessage(); // Scroll to the last message after fetching
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const requestId = `${selectedUser.parentid}_${teacherid}`;
            // console.log("Request ID:", requestId);
            // console.log("Sender ID:", teacherid);
            // console.log("Receiver ID:", selectedUser?._id);
            // console.log("Message:", newMessage);

            const response = await fetch('http://localhost:8000/parentrouter/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    senderId: teacherid,
                    receiverId: selectedUser?.id,
                    message: newMessage,
                }),
            });
            // console.log("Selected User:", selectedUser);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                alert("Failed to send message: " + errorData.error);
                return;
            }
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (isChatboxOpen && selectedUser) {
            fetchMessages();
        }
    }, [isChatboxOpen, selectedUser]);

    const scrollToLastMessage = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToLastMessage(); // Scroll when messages are updated
    }, [messages]);

    return (
        <>
            <TeacherSidebar />
            {/* Content */}
            <section id="content">
                <TeacherNav />
                {/* Main */}
                <main style={{ paddingBottom: "100px" }}>

                    <div className="add-parent2-container">
                        <div className="add-parent2-box">
                            <Link to="/markattendance" className="add-parent2-link">
                                <i class='bx bxs-check-square'></i>
                                <span>Mark Attendance</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/monthlyattendance" className="add-parent2-link">
                                <i class='bx bxs-download'></i>
                                <span>Monthly Attendance</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/teacherexam" className="add-parent2-link">
                                <i class='bx bx-timer'></i>
                                <span>Schedule Exam</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/examinationlist" className="add-parent2-link">
                                <i class='bx bx-list-ul'></i>
                                <span>Exam List</span>
                            </Link>
                        </div>
                        <div className="add-parent2-box">
                            <Link to="/studentmark" className="add-parent2-link">
                                <i class='bx bx-search'></i>
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

                    {/* Chatbox */}
                    {isChatboxOpen && (
                        <div className="chatbox1">
                            <div className="chatbox-header">
                                {selectedUser ? (
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
                                            {/* Profile Picture */}
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
                                                {selectedUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            <h4 style={{ margin: 0 }}>{selectedUser.name}</h4>
                                        </div>
                                    </>
                                ) : (
                                    <h4>Chat</h4>
                                )}
                                <button
                                    className="chatbox-close"
                                    onClick={toggleChatbox}
                                >
                                    ✖
                                </button>
                            </div>
                            <div className="chatbox-body">
                                {selectedUser ? (
                                    <>
                                        <p style={{ textAlign: "center", fontSize: "12px", color: "GrayText" }}>
                                            Conversation with {selectedUser.name}
                                        </p>
                                        <div>
                                            {messages.map((msg, index) => (
                                                <div key={index} style={{ textAlign: msg.senderId === teacherid ? 'right' : 'left', marginBottom: '10px' }}>
                                                    <p
                                                        style={{
                                                            backgroundColor: msg.senderId === teacherid ? '#d1e7dd' : '#f8d7da',
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
                                            ))}
                                            {/* Add a div with the ref at the end of the messages */}
                                            <div ref={lastMessageRef}></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>Available Users:</p>
                                        <ul style={{ listStyleType: "none", padding: 0 }}>
                                            {parents.map((user) => (
                                                <li
                                                    key={user._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleUserClick({
                                                            parentid: user.parentid,
                                                            name: user.parentname,
                                                            id: user._id,
                                                            role: "Parent",
                                                        })
                                                    }
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
                                                        {user.parentname.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{user.parentname}</strong>{" "}
                                                        <span style={{ color: "#888", fontSize: "12px" }}>
                                                            (Parent)
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                            {selectedUser && (
                                <div className="chatbox-footer">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedUser?.name || ''}...`}
                                    />
                                    <button onClick={sendMessage}>
                                        <i class='bx bxs-send' />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                {/* Main */}
            </section>
            {/* Content */}

            <a a href="#" className="message-icon" onClick={toggleChatbox} >
                < img src="chat1.png" alt="chat" style={{ width: '40px', height: '40px' }} />
            </a>
        </>
    )
}
export default Teacherdashboard;