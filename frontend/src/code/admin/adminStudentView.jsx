import React, {useState, useEffect} from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
import { Link } from "react-router-dom";
// import './adminStudentView.css'

function AdminStudentView() {
        const [viewdata, setViewdata] = useState([]);
        const [refresh, setRefresh] = useState('');
        useEffect(() => {
            fetch('http://localhost:8000/adminrouter/adminstudentview').then((res)=>res.json()).then((result)=>{
                setViewdata(result)
            })
            .catch((err) => console.error(err));
        },[refresh])
    
        const handleDelete = (id) => {
            fetch(`http://localhost:8000/adminrouter/adminstudentdelete/${id}`, {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              // body: JSON.stringify({ id }),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log('Deleted:', result);
                setRefresh((prev) => prev + 1);
              })
              .catch((err) => console.error(err));
          };
    
    return (
        <>
            <AdminSidebar />
            <section id="content">
                <AdminNav />
                <main>
                    <div>
                        <h2 style={{ textAlign: 'center' }}>Student List</h2>
                        <br />
                    </div>
                    <table 
                    className="table table-bordered table-secondary table-hover"
                    style={{ width: '90%', fontSize: '0.9rem', margin: '0 auto' }}
                    >
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Date of Birth</th>
                                <th>Guardian</th>
                                <th>Relation</th>
                                <th>Blood Group</th>
                                <th>Degree</th>
                                <th>Department</th>
                                <th>10th Mark</th>
                                <th>12th Mark</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewdata.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.studentid}</td>
                                    <td>{data.studentname}</td>
                                    <td>{new Date(data.dateofbirth).toLocaleDateString()}</td>
                                    <td>{data.guardianname}</td>
                                    <td>{data.guardianrelation}</td>
                                    <td>{data.bloodgroup}</td>
                                    <td>{data.degree}</td>
                                    <td>{data.department}</td>
                                    <td>{data.tenth}</td>
                                    <td>{data.twelve}</td>
                                    <td>
                                        <Link to="/adminstudentedit" state={{ id: data._id }}>
                                            <button type="button" className="btn btn-primary" style={{border:'none'}}>
                                                <i class='bx bx-edit' undefined ></i>
                                            </button>
                                        </Link>
                                        &nbsp;
                                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(data._id)}>
                                            <i class='bx bx-trash' undefined ></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </section>
        </>
    )
}
export default AdminStudentView;