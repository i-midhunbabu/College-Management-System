import React, { useState, useEffect } from "react";
import ParentSidebar from "./parentsidebar";
import ParentNav from "./parentnavbar";

function Parentdashboard() {
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const toggleChatbox = () => {
        setIsChatboxOpen(!isChatboxOpen);
        setSelectedTeacher(null);
    };

    const handleTeacherClick = (teacher) => {
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

    return (
        <>
            <ParentSidebar />
            {/* Content */}
            <section id="content">
                <ParentNav />
                {/* Main */}
                <main style={{ paddingBottom: "100px" }}>

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
                                        <p>Chat with {selectedTeacher.teachername}</p>
                                        {/* Add chat functionality here */}
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
                                                        <strong>{teacher.teachername}</strong>
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
                                        placeholder={`Message ${selectedTeacher.teachername}...`}
                                    />
                                    <button>
                                    <i class='bx bxs-send'></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main >
                {/* Main */}
            </section >
            {/* Content */}
            <a a href="#" className="message-icon" onClick={toggleChatbox} >
                < img src="chat1.png" alt="chat" style={{ width: '40px', height: '40px' }} />
            </a>
        </>
    )
}
export default Parentdashboard;