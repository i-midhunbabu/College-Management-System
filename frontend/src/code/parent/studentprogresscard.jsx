import React from "react";
import ParentNav from "./parentnavbar";
import ProgressCard from "../student/progresscard";
import ParentSidebar from "./parentsidebar";

function ProgressReport() {
    
    return (
        <>
        <ParentSidebar/>
        <section id="content" >
            <ParentNav />
            <main>
                <h2>Student Progress Report</h2>
            </main>
        </section>
        </>
    );
}

export default ProgressReport;