import React, {useState, useEffect} from "react";
import AdminSidebar from "./adminsidebar";
import AdminNav from "./adminnavbar";
function AdminDepartmentView() {
        const [viewdata, setViewdata] = useState([]);
        const [refresh, setRefresh] = useState('');
            useEffect(() => {
                fetch('http://localhost:8000/adminrouter/admindepartmentview').then((res)=>res.json()).then((result)=>{
                    setViewdata(result)
                })
                .catch((err) => console.error(err));
            },[refresh])

    return(
        <>
        <AdminSidebar/>
        <section id="content">
            <AdminNav/>
            <main>
            <div>
                <h2 style={{textAlign:'center'}}>Department</h2>
                <br/>
                </div>
                <table 
                className="table table-bordered table-secondary"
                style={{ width: '90%', fontSize: '0.9rem', margin: '0 auto' }}
                >
                    <thead>
                        <tr>
                        <th>Degree</th>
                        <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewdata.map((data, index)=> (
                                <tr key={index}> 
                                    <td>{data.degree}</td>
                                    <td>{data.department.join(', ')}</td>
                                </tr>
                        ))}
                    </tbody>
                    </table>
            </main>
        </section>
        
        
        
        </>
    )
}
export default AdminDepartmentView;