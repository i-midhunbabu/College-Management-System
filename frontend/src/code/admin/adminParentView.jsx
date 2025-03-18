import React, {useState, useEffect} from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
function AdminParentView() {
    const [viewdata, setViewdata] = useState([]);
    const [refresh, setRefresh] = useState('');
        
    useEffect(() => {
        fetch('http://localhost:8000/adminrouter/admingetparent').then((res)=>res.json()).then((result)=>{
            setViewdata(result)
            })
            .catch((err) => console.error(err));
        },[refresh])

    const handleBlock = (parentid) => {
        fetch('http://localhost:8000/adminrouter/blockparent', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({parentid}),
        }).then((res) => res.json()).then((result)=>{
            alert(result.message);
            setRefresh((prev) => !prev);
        })
        .catch((err) => {
            console.error('Error blocking parent:', err);
            alert('Failed to block parent.');
        })
    };
    
    return(
        <>
        <AdminSidebar/>
        <section id="content">
            <AdminNav/>
            <main>
            <div>
                <h2 style={{textAlign:'center'}}>Parent List</h2>
                <br/>
            </div>
            <table 
            className="table table-bordered table-secondary table-hover"
            style={{ width: '90%', fontSize: '0.9rem', margin: '0 auto' }}
            >
                    <thead>
                        <tr>
                        <th>Parent ID</th>
                        <th>Parent Name</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        {/* <th>Aadhaar No</th> */}
                        <th>Department</th>
                        <th>Mobile No</th>
                        <th>Email ID</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewdata.map((data, index)=> (
                                <tr key={index}> 
                                    <td>{data.parentid}</td>
                                    <td>{data.parentname}</td>
                                    <td>{data.studentid}</td>
                                    <td>{data.studentname}</td>
                                    {/* <td>{data.aadhaar}</td> */}
                                    <td>{data.department}</td>
                                    <td>{data.mobile}</td>
                                    <td>{data.email}</td>
                                    <td>
                                        <button 
                                            type="button" 
                                            className={`btn ${data.isBlocked ? 'btn-secondary' : 'btn-danger'} `}
                                            onClick={() => !data.isBlocked && handleBlock (data.parentid)}
                                        > 
                                            {data.isBlocked ? (
                                                <>
                                                <i className='bx bxs-user-x' style={{color:'#ffffff'}} ></i> Blocked
                                                </>
                                            ) : (
                                                <>
                                                <i className='bx bx-block' style={{color:'#ffffff'}}></i> Block
                                                </>
                                            )}
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
export default AdminParentView;