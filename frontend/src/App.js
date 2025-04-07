import {BrowserRouter, Routes, Route} from "react-router-dom"
import { useState } from "react";

import Logintype from "./code/common/logintype";

//Admin Login
import Adminlogin from "../src/code/admin/adminlogin"
import AdminForgotPass from "./code/admin/adminforgotpassword";
import ResetPassword from "./code/admin/ResetPassword";

//Admin Module
import AdminNav from "./code/admin/adminnavbar";
import AdminSidebar from "./code/admin/adminsidebar";
import Adminreg from "./code/admin/adminreg";
import Admindashboard from "./code/admin/admindashboard";
import AdminAddTeacher from "./code/admin/adminaddteacher"
import Adminteacherview from "./code/admin/adminteacherview";
import AdminTeacherEdit from "./code/admin/adminteacheredit";
import AdminAddStudent from "./code/admin/adminAddStudent";
import AdminStudentView from "./code/admin/adminStudentView";
import AdminStudentEdit from "./code/admin/adminStudentEdit";
import AdminParentView from "./code/admin/adminParentView";
import AdminAddDepartment from "./code/admin/adminAddDepartment";
import AdminDepartmentView from "./code/admin/adminDepartmentView";
import ListTeachers from "./code/admin/adminListTeachers";
import AdminSem from "./code/admin/adminSem";
import AdminSub from "./code/admin/adminSub";
import AdminViewSub from "./code/admin/viewSub";
import AdminExam from "./code/admin/adminExam";
import AdminClass from "./code/admin/adminClass";
import ExaminationList from "./code/admin/examinationlist";
import AdminExamReview from "./code/admin/examApprove";

//Teacher Module
import Teacherlogin from "./code/teacher/teacherlogin";
import TeacherForgotPass from "./code/teacher/teacherforgotpassword";
import TeacherResetPassword from "./code/teacher/teacherresetpass";
import Teacherdashboard from "./code/teacher/teacherdashboard";
import TeacherSidebar from "./code/teacher/teachersidebar";
import TeacherNav from "./code/teacher/teachernavbar";
import TeacherProfile from "./code/teacher/teacherprofile";
import TeacherExam from "./code/teacher/teacherexam";
import MarkAttendance from "./code/teacher/attendancemark";
import ExaminationView from "./code/teacher/examinationview";
import EditExam from "./code/teacher/editexam";
import ExamMark from "./code/teacher/exammark";
import StudentMark from "./code/teacher/studentmark";

//Student Module
import StudentLogin from "./code/student/studentlogin";
import StudentForgotPass from "./code/student/studentforgotpassword";
import StudentResetPass from "./code/student/StudentResetPass";
import Studentdashboard from "./code/student/studentdashboard";
import StudentNavBar from "./code/student/studentnavbar";
import StudentHome from "./code/student/studenthome";
import StudentProfile from "./code/student/studentprofile";
import StudentAddParent from "./code/student/studentAddParent";
import ViewAttendance from "./code/student/studentattendance";
import StudentExam from "./code/student/studentexams";
import StudentExamAttend from "./code/student/studentexamattend";
import PreviousExam from "./code/student/previousexams";
import StudentExamResult from "./code/student/studentexamresult";
import ProgressCard from "./code/student/progresscard";


//Parent Module
import ParentLogin from "./code/parent/parentlogin";
import ParentForgotPass from "./code/parent/parentforgotpassword";
import ParentResetPass from "./code/parent/ParentResetPass";
import Parentdashboard from "./code/parent/parentdashboard";
import ParentSidebar from "./code/parent/parentsidebar";
import ParentNav from "./code/parent/parentnavbar";
import ParentProfile from "./code/parent/parentprofile";
import ProgressReport from "./code/parent/studentprogresscard";

function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("get")))
  return(
    <BrowserRouter>
    {auth == null ? (
        <Routes>
          <Route path="/" element={<Logintype/>}></Route> //choose b/w admin/student/teacher/parent

          <Route path="/adminlogin" element={<Adminlogin/>}></Route> //admin login page
          <Route path="/adminforgotpassword" element={<AdminForgotPass/>}></Route>
          <Route path="/resetpassword" element={<ResetPassword/>}></Route>

          <Route path="/teacherlogin" element={<Teacherlogin/>} ></Route> //teacher login
          <Route path="/teacherforgotpassword" element={<TeacherForgotPass/>}></Route>
          <Route path="/teacherresetpassword" element={<TeacherResetPassword/>}></Route>

          <Route path="/studentlogin" element={<StudentLogin/>} ></Route> //student login
          <Route path="/studentforgotpassword" element={<StudentForgotPass/>}  ></Route>
          <Route path="/studentresetpassword" element={<StudentResetPass/>}></Route>

          <Route path="/parentlogin" element={<ParentLogin/>} ></Route>
          <Route path="/parentforgotpassword" element={<ParentForgotPass/>} ></Route>
          <Route path="/parentresetpassword" element={<ParentResetPass/>} ></Route>
        </Routes>
    ) : auth.usertype == 1 ? (//in local storage it's structured as { usertype: 1}
          <Routes>
            <Route path="/" element={<Admindashboard/>}></Route> //admin dashboard
            <Route path="/adminnav" element={<AdminNav/>} ></Route> //admin navbar
            <Route path="/adminsidebar" element={<AdminSidebar/>} ></Route> //admin sidebar
            <Route path="/adminreg" element={<Adminreg />}></Route> //register admin
            <Route path="/adminaddteacher" element={<AdminAddTeacher />}></Route> //teacher registration
            <Route path="/adminteacherview" element={<Adminteacherview/>}></Route> //manage teachers
            <Route path="/adminteacheredit" element={<AdminTeacherEdit/>}></Route> //edit the data of teachers excluding password
            <Route path="/adminaddstudent" element={<AdminAddStudent/>} ></Route> //student registration
            <Route path="/adminstudentview" element={<AdminStudentView/>} ></Route> //manage students
            <Route path="/adminstudentedit" element={<AdminStudentEdit/>} ></Route> //edit the data of students excluding password
            <Route path="/adminparentview" element={<AdminParentView/>} ></Route>
            <Route path="/adminadddepartment" element={<AdminAddDepartment/>} ></Route>
            <Route path="/admindepartmentview" element={<AdminDepartmentView/>} ></Route>
            <Route path="/adminlistteachers" element={<ListTeachers/>} ></Route>
            <Route path="/adminsemester" element={<AdminSem/>} ></Route>
            <Route path="/adminsubjects" element={<AdminSub/>} ></Route>
            <Route path="/adminviewsubjects" element={<AdminViewSub/>} ></Route>
            <Route path="/adminexamination" element={<AdminExam/>}></Route>
            <Route path="/adminclass" element={<AdminClass/>}></Route>
            <Route path="/adminExaminationlist" element={<ExaminationList/>} ></Route>
            <Route path="/examapprove" element={<AdminExamReview/>} ></Route>
          </Routes>
    ) : auth.teacherDetails?.usertype == 2 ? ( //in local storage it is structured as {message: "text", teacherDetails:{usertype:2}}
          <Routes>
          <Route path="/" element={<Teacherdashboard/>}></Route> //teacher dashboard
          <Route path="/teachersidebar" element={<TeacherSidebar/>}></Route> //teacher sidebar
          <Route path="/teachernav" element={<TeacherNav/>}></Route>
          <Route path="/teacherprofile" element={<TeacherProfile/>} ></Route>
          <Route path="/teacherexam" element={<TeacherExam/>} ></Route>
          <Route path="/markattendance" element={<MarkAttendance/>} ></Route>
          <Route path="/examinationlist" element={<ExaminationView/>} ></Route>
          <Route path="/editexam/:examId" element={<EditExam/>} ></Route>
          <Route path="/exammark/:id" element={<ExamMark/>} ></Route>
          <Route path="/studentmark" element={<StudentMark/>} ></Route>
          </Routes>
    ) : auth.studentDetails?.usertype == 3 ? ( //in local storage it is structured as {message: "text", studentDetails:{usertype:3}}
          <Routes>
          <Route path="/" element={<Studentdashboard/>}></Route> // student dashboard
          <Route path="/studentnav" element={<StudentNavBar/>} ></Route> //student navbar
          <Route path="/studenthome" element={<StudentHome/>}></Route>
          <Route path="/studentprofile" element={<StudentProfile/>}></Route>
          <Route path="/studentaddparent" element={<StudentAddParent/>} ></Route>
          <Route path="/viewattendance" element={<ViewAttendance/> }></Route>
          <Route path="/studentexamlist" element={<StudentExam/>} ></Route>
          <Route path="/studentexamattend/:examId" element={<StudentExamAttend/>} ></Route>
          <Route path="/previousexams" element={<PreviousExam/>} ></Route>
          <Route path="/examresult" element={<StudentExamResult/>} ></Route>
          <Route path="/studentprogress" element={<ProgressCard />} ></Route>
          </Routes>
    ) : auth.parentDetails?.usertype == 4 ? ( //in local storage it is structured as {message: "text", parentDetails:{usertype:4}}
        <Routes>
         <Route path="/" element={<Parentdashboard/>}></Route> //parent dashboard
         <Route path="/parentsidebar" element={<ParentSidebar/>}></Route>
         <Route path="/parentnav" element={<ParentNav/>} ></Route>
         <Route path="/parentprofile" element={<ParentProfile/>} ></Route>
         <Route path="/studentprogresscard" element={<ProgressReport />} ></Route>
         </Routes>
    ):

    null

    }
    </BrowserRouter>
  )
}

export default App;
