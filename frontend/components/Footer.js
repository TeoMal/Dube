import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer className="bg-light text-center border-top fixed-bottom">
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "40px" }}
      >
        <span className="text-muted">
          © {new Date().getFullYear()} DUBE. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
