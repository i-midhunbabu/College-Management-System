import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
// import './admindashboard.css'
function Admindashboard() {
    const [teacherCount, setTeacherCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        // Fetch the number of teachers
        fetch("http://localhost:8000/adminrouter/adminteacherview")
            .then((res) => res.json())
            .then((data) => {
                setTeacherCount(data.length); // Assuming the API returns an array of teachers
            })
            .catch((err) => {
                console.error("Error fetching teacher count:", err);
            });

        // Fetch the number of students
        fetch("http://localhost:8000/adminrouter/adminstudentview")
            .then((res) => res.json())
            .then((data) => {
                setStudentCount(data.length); // Assuming the API returns an array of students
            })
            .catch((err) => {
                console.error("Error fetching student count:", err);
            });
    }, []);

    return (
        <>
            <AdminSidebar />
            {/* Content */}
            <section id="content">
                <AdminNav />
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

                    <ul className="box-info">
                        <li>
                            <Link to="/adminteacherview" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="icon">
                                <i className='bx bxs-chalkboard'></i>
                                </div>
                                <br />
                                <div className="text">
                                    <h3>{teacherCount}</h3>
                                    <p>Teacher</p>
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/adminstudentview" style={{ textDecoration: 'none', color: 'none' }}>
                                <div className="icon">
                                <i class='bx bxs-graduation'></i>
                                </div>
                                <br />
                                <div className="text">
                                    <h3>{studentCount}</h3>
                                    <p>Student</p>
                                </div>
                            </Link>
                        </li>

                        {/* <li>
                            <i className='bx bxs-dollar-circle' ></i>
                            <span className="text">
                                <h3>$2543</h3>
                                <p>Total Sales</p>
                            </span>
                        </li> */}
                    
                    </ul>


                    {/* <div className="table-data">
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
                                            <img src="/assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status completed">Completed</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="/assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="/assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status process">Process</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="/assets2/img/people.png" alt="" />
                                            <p>John Doe</p>
                                        </td>
                                        <td>01-10-2021</td>
                                        <td><span className="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="/assets2/img/people.png" alt="" />
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
                    </div> */}
                </main>
                {/* Main */}
            </section>
            {/* Content */}
        </>
    )
}
export default Admindashboard;