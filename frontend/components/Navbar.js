import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DubeLogo from "../public/Dube_logo.png"; 

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={DubeLogo} alt="DUBE Logo" width="120" height="40"className="me-2" />
        
      </Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav me-3">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/network">Network</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/help">Help</Link></li>
        </ul>
        <Link className="btn btn-outline-dark me-2" to="/signup">Sign Up</Link>
        <Link className="btn btn-dark" to="/login">Log In</Link>
      </div>
    </nav>
  );
}
