import React, {useEffect, useState} from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

function Adminteacherview() {
    const [viewdata, setViewdata] = useState([]);
    const [refresh, setRefresh] = useState('');
    // const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/adminteacherview').then((res)=>res.json()).then((result)=>{
            setViewdata(result)
        })
        .catch((err) => console.error(err));
    },[refresh])

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/adminrouter/adminteacherdelete/${id}`, {
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
      
    return(
        <>
        <AdminSidebar/>
        <section id="content">
            <AdminNav/>
            <main>
                <div>
                <h2 style={{textAlign:'center'}}>Teacher List</h2>
                <br/>
                </div>
                <table className="table table-bordered table-secondary table-hover">
                    <thead>
                        <tr>
                        <th>Teacher ID</th>
                        <th>Teacher Name</th>
                        <th>Designation</th>
                        <th>Date of Birth</th>
                        <th>Qualification</th>
                        <th>Salary</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewdata.map((data, index)=> (
                                <tr key={index}> 
                                    <td>{data.teacherid}</td>
                                    <td>{data.teachername}</td>
                                    <td>{data.designation}</td>
                                    <td>{new Date(data.dateofbirth).toLocaleDateString()}</td>
                                    <td>{data.qualification.join(', ')}</td>
                                    <td>{data.salary}</td>
                                    <td>
                                        <Link to="/adminteacheredit" state={{id: data._id}}>
                                        <button type="button" className="btn btn-primary" style={{border:'none'}}> 
                                        <i class='bx bxs-edit' undefined ></i> 
                                        </button> 
                                        </Link>
                                        &nbsp;
                                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(data._id)} > 
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
export default Adminteacherview;