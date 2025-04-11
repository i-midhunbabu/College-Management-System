import React, {useState, useEffect} from "react";
import ParentSidebar from "./parentsidebar";
import ParentNav from "./parentnavbar";
import './parentdashboard.css'
function ParentProfile() {
        const [parentData, setParentData] = useState(null);
    
        const parent = JSON.parse(localStorage.getItem("get"))
        const parentId = parent ? parent._id : null
        // console.log("User Id:",userId);
    
        useEffect(() => {
            if (parentId) {
                fetch(`http://localhost:8000/parentrouter/parentprofile/${parentId}`).then((res) => res.json()).then((data) => setParentData(data))
    
            }
        }, [parentId]);
    
    return(
        <>
        <ParentSidebar />
        <section id="content">
            <ParentNav />
            <main className="profile-container3 ">
                    <div className="profile-box">
                        <h2 className="profile-title">Parent Profile <i class='bx bxs-user'></i> </h2>
                        <hr />
                        {parentData ? (
                            <>
                                <h5><strong>Parent ID:</strong> {parentData.parentid}</h5>
                                <h5><strong>Parent Name:</strong> {parentData.parentname}</h5>
                                <h5><strong>Student ID:</strong> {parentData.studentid}</h5>
                                <h5><strong>Student Name:</strong> {parentData.studentname}</h5>
                                <h5><strong>Degree:</strong> {parentData.degree}</h5>
                                <h5><strong>Department:</strong> {parentData.department}</h5>
                                <h5><strong>Semester:</strong> {parentData.semester}</h5>
                                <h5><strong>Relation:</strong> {parentData.relation}</h5>
                                <h5><strong>Date of Birth:</strong> {parentData.dateofbirth}</h5>
                                <h5><strong>Job:</strong> {parentData.job}</h5>
                                <h5><strong>Aadhaar No:</strong> {parentData.aadhaar}</h5>
                                <h5><strong>Mobile No:</strong> {parentData.mobile}</h5>
                                <h5><strong>Email:</strong> {parentData.email}</h5>
                            </>
                        ) : (
                            <h5>Loading your profile</h5>
                        )}
                    </div>
                </main>
        </section>
        </>
    )
}
export default ParentProfile;