import React, {useState, useEffect} from "react";
import StudentNavBar from "./studentnavbar";
import './student.css'
function Studentdashboard() {
const [studentName, setStudentName] = useState("");
    useEffect(() => {
        // Fetch student details from localStorage
        const storedData = localStorage.getItem("get");
        if (storedData) {
            const studentData = JSON.parse(storedData);
            if (studentData.studentDetails && studentData.studentDetails.studentname) {
                setStudentName(studentData.studentDetails.studentname);
            }
        }
    }, []);

    
    return (
        <>
            {/* Content */}
            <section id="content" className="student-module">
                <StudentNavBar/>
                {/* Main */}
                <main>
                    {/* <div className="head-title">
                        <div className="left">
                            <h1>Dashboard</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="#">Dashboard</a>
                                </li>
                                <li><i className='bx bx-chevron-right' ></i></li>
                                <li>
                                    <a className="active" href="#">Home</a>
                                </li>
                            </ul>
                        </div>
                        <a href="#" className="btn-download">
                            <i className='bx bxs-cloud-download' />
                            <span className="text">Download PDF</span>
                        </a>
                    </div> */}
                    <div className="head-title">
                        <div className="student-name">
                        <span style={{fontSize:'30px'}}>Welcome </span>
                        <span style={{fontSize:'30px', fontWeight:'bolder'}}> {studentName || "Student"} </span>                        
                        </div>
                    </div>

                    <ul className="box-info">
                        <li>
                            <i className='bx bxs-calendar-check' ></i>
                            <span className="text">
                                <h3>1020</h3>
                                <p>New Order</p>
                            </span>
                        </li>
                        <li>
                            <i className='bx bxs-group' ></i>
                            <span className="text">
                                <h3>2834</h3>
                                <p>Visitors</p>
                            </span>
                        </li>
                        <li>
                            <i className='bx bxs-dollar-circle' ></i>
                            <span className="text">
                                <h3>$2543</h3>
                                <p>Total Sales</p>
                            </span>
                        </li>
                    </ul>


                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Recent Orders</h3>
                                <i className='bx bx-search' ></i>
                                <i className='bx bx-filter' ></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Date Order</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src="assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status completed">Completed</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status process">Process</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets2/img/people.png" alt=""/>
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status completed">Completed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="todo">
                            <div className="head">
                                <h3>Todos</h3>
                                <i className='bx bx-plus' ></i>
                                <i className='bx bx-filter' ></i>
                            </div>
                            <ul className="todo-list">
                                <li className="completed">
                                    <p>Todo List</p>
                                    <i className='bx bx-dots-vertical-rounded' ></i>
                                </li>
                                <li className="completed">
                                    <p>Todo List</p>
                                    <i className='bx bx-dots-vertical-rounded' ></i>
                                </li>
                                <li className="not-completed">
                                    <p>Todo List</p>
                                    <i className='bx bx-dots-vertical-rounded' ></i>
                                </li>
                                <li className="completed">
                                    <p>Todo List</p>
                                    <i className='bx bx-dots-vertical-rounded' ></i>
                                </li>
                                <li className="not-completed">
                                    <p>Todo List</p>
                                    <i className='bx bx-dots-vertical-rounded' ></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>
                {/* Main */}
            </section>
            {/* Content */}
            <a href="#" className="message-icon">
            {/* <i className='bx bxs-message-square-dots' style={{color:'#1760e2'}}  >Feedback</i> */}
            <img src="chat1.png" alt="chat" />
            <span className="feedback-text">Feedback</span>
            </a>

        </>
    )
}
export default Studentdashboard;