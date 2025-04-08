import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ParentSidebar from "./parentsidebar";
import ParentNav from "./parentnavbar";

function Parentdashboard() {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [parentid, setParentId] = useState('');
    const lastMessageRef = useRef(null); // Ref for the last message

    useEffect(() => {
        const storedUser = localStorage.getItem('get');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.parentDetails?.parentid) {
                setParentId(userData.parentDetails.parentid);
            }
        }
    }, []);

    const toggleChatbox = () => {
        setIsChatboxOpen(!isChatboxOpen);
        setSelectedTeacher(null);
    };

    const handleTeacherClick = (teacher) => {
        // console.log("Selected Teacher:", teacher); 
        setSelectedTeacher(teacher);
    };

    const handleBackClick = () => {
        setSelectedTeacher(null);
    };

    useEffect(() => {
        if (isChatboxOpen) {
            fetch("http://localhost:8000/adminrouter/adminteacherview")
                .then((response) => response.json())
                .then((data) => {
                    setTeachers(data);
                })
                .catch((error) => {
                    console.error("Error fetching teachers:", error);
                });
        }
    }, [isChatboxOpen]);

    const fetchMessages = async () => {
        try {
            const requestId = `${parentid}_${selectedTeacher?._id}`;
            // console.log("Fetching messages for Request ID:", requestId);
            const response = await fetch(`http://localhost:8000/parentrouter/getMessages/${requestId}`);
            const data = await response.json();
            // console.log("Fetched Messages:", data);
            setMessages(data);
            scrollToLastMessage(); // Scroll to the last message after fetching
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const requestId = `${parentid}_${selectedTeacher?._id}`;
            // console.log("Request ID:", requestId);
            // console.log("Sender ID:", parentid);
            // console.log("Receiver ID:", selectedTeacher?._id);
            // console.log("Message:", newMessage);
            await fetch('http://localhost:8000/parentrouter/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    senderId: parentid,
                    receiverId: selectedTeacher?._id,
                    message: newMessage,
                }),
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // useEffect(() => {
    //     if (isChatboxOpen) {
    //         fetchMessages();
    //     }
    // }, [isChatboxOpen]);

    useEffect(() => {
        if (selectedTeacher) {
            fetchMessages();
        }
    }, [selectedTeacher]);

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
            <ParentSidebar />
            {/* Content */}
            <section id="content">
                <ParentNav />
                {/* Main */}
                <main style={{ paddingBottom: "100px" }}>
                    <div className="add-parent1-container">
                        <div className="add-parent1-box">
                            <Link to="/studentprogresscard" className="add-parent1-link">
                                <i class='bx bx-file'></i>
                                <span>Student Progress Report</span>
                            </Link>
                        </div>

                        <div className="add-parent1-box">
                            <Link to="/parentprofile" className="add-parent1-link">
                                <i class='bx bx-user' ></i>
                                <span>Profile</span>
                            </Link>
                        </div>

                        <div className="add-parent1-box" onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} style={{ cursor: 'pointer' }}>
                            <div className="add-parent1-link">
                                <i className='bx bx-power-off'></i>
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>

                    {/* Chatbox */}
                    {isChatboxOpen && (
                        <div className="chatbox">
                            <div className="chatbox-header">
                                {selectedTeacher ? (
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
                                                {selectedTeacher.teachername.charAt(0).toUpperCase()}
                                            </div>
                                            <h4 style={{ margin: 0 }}>{selectedTeacher.teachername}</h4>
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
                                {selectedTeacher ? (
                                    <div>
                                        <p style={{ textAlign: "center", fontSize: "12px", color: "GrayText" }}>
                                            Conversation with {selectedTeacher.teachername}
                                        </p>
                                        <div>
                                            {messages.length > 0 ? (
                                                messages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            textAlign: msg.senderId === parentid ? 'right' : 'left',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                backgroundColor: msg.senderId === parentid ? '#d1e7dd' : '#f8d7da',
                                                                padding: '10px',
                                                                borderRadius: '10px',
                                                                display: 'inline-block',
                                                                maxWidth: '80%',
                                                            }}
                                                        >
                                                            {msg.message}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ textAlign: "center", color: "GrayText", fontSize: "12px" }}>No messages yet.</p>
                                            )}
                                            {/* Add a div with the ref at the end of the messages */}
                                            <div ref={lastMessageRef}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p>Available Teachers:</p>
                                        <ul style={{ listStyleType: "none", padding: 0 }}>
                                            {teachers.map((teacher) => (
                                                <li
                                                    key={teacher._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleTeacherClick(teacher)}
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
                                                        {teacher.teachername.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{teacher.teachername}</strong>{" "}
                                                        <span style={{ color: "#888", fontSize: "10px" }}>
                                                            ({(teacher.designation)})
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                            {selectedTeacher && (
                                <div className="chatbox-footer">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedTeacher.teachername || ''}...`}
                                    />
                                    <button onClick={sendMessage}>
                                        <i className='bx bxs-send'></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main >
                {/* Main */}
            </section >
            {/* Content */}
            {/* Chat Icon */}
            <a a href="#" className="message-icon" onClick={toggleChatbox} >
                < img src="chat1.png" alt="chat" style={{ width: '40px', height: '40px' }} />
            </a>
        </>
    )
}
export default Parentdashboard;