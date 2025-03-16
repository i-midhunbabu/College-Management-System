import React from "react";
// import "./logintype.css"
import styles from "./logintype.module.css"
import { Link } from "react-router-dom";
function Logintype() {
    return (
        <>
        <div className={styles.loginPage}>
        <div id={styles.id1} className={styles.container}>
                <div className={styles.left}>
                </div>
                <div className={styles.right}>
                    <div className={styles.logo}>
                        <img src="logo2.png" alt="College Logo" />
                    </div>
                    <div className={styles.loginBox}>
                        <Link className={styles.active} to="adminlogin">
                        <button> 
                            <h3>
                            <span className={styles.semiBold}>Admin </span>
                            <span className={styles.lightText}>Login</span>
                            </h3>
                        </button>
                        </Link>
                        <Link to="teacherlogin">
                        <button>
                            <h3>
                            <span className={styles.semiBold}>Teacher </span>
                            <span className={styles.lightText}>Login</span>   
                            </h3>
                        </button>
                        </Link>
                        <Link to="studentlogin">
                        <button>
                            <h3>
                            <span className={styles.semiBold}>Student </span> 
                            <span className={styles.lightText}>Login</span>
                            </h3>
                        </button>
                        </Link>
                        <Link to= "parentlogin">
                        <button>
                            <h3>
                            <span className={styles.semiBold}>Parent </span>
                            <span className={styles.lightText}>Login</span>
                            </h3>
                        </button>
                        </Link>
                    </div>
                    {/* <div className="footer">

                    </div> */}
                </div>
            </div>
        </div>
        </>
    )
}
export default Logintype;