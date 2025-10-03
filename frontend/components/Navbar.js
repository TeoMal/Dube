import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DubeLogo from "../public/Dube_logo.png"; 
import { Navbar as BSNavbar, Nav, Dropdown, Container } from "react-bootstrap";

import { AuthContext } from "../pages/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // hook to navigate programmatically

  const handleLogout = () => {
    logout();          // update auth state
    navigate("/"); // navigate to /home
  };
  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm px-4">
      
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={DubeLogo} alt="DUBE Logo" width="120" height="40" className="me-2" />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-3">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            <Nav.Link as={Link} to="/network">Network</Nav.Link>
            <Nav.Link as={Link} to="/help">Help</Nav.Link>
          </Nav>

          {!user.isLoggedIn ? (
            <>
              <Link className="btn btn-outline-dark me-2" to="/signup">Sign Up</Link>
              <Link className="btn btn-dark" to="/login">Log In</Link>
            </>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" className="d-flex align-items-center">
                <i className="bi bi-person-circle fs-4 me-2 text-white"></i>
                {user.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/my-courses">My Courses</Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </BSNavbar.Collapse>
      
    </BSNavbar>
  );
}
