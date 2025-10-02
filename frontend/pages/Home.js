import React from "react";
import { Link } from "react-router-dom";
import ProfPhoto from "../public/Prof.png"; 
import StudentPhoto from "../public/Student.png"; 

export default function Home() {
  return (
    <div className="container text-center my-4">
      <h2>
        Welcome to <span className="text-primary fw-bold">DUBE</span>, Dynamic User Based Education
      </h2>
      <p className="text-muted">
        AI-powered learning that adapts to your style and empowers teachers to create effortlessly
      </p>

      <div className="row justify-content-center mt-4">
        <div className="col-md-5 mb-3">
          <Link to="/students" className="text-decoration-none">
            <div className="card shadow border-0 h-100">
              <div className="card-body bg-primary text-white rounded">
                <h5 className="card-title">🎓 For Students</h5>
                <img src={StudentPhoto} width="300" height="100" alt="Students illustration" className="img-fluid my-2" />
                <p className="card-text">
                  Smarter learning. DUBE adapts lessons to your style – visual, auditory, or textual – so learning feels natural.
                </p>
                <div className="fw-bold text-end">→</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-5 mb-3">
          <Link to="/educators" className="text-decoration-none">
            <div className="card shadow border-0 h-100">
              <div className="card-body bg-primary text-white rounded">
                <h5 className="card-title">🧑‍🏫 For Educators</h5>
                <img src={ProfPhoto} alt="Educators illustration" className="img-fluid my-2" />
                <p className="card-text">
                  Smarter teaching. Upload once, and DUBE creates lessons in multiple formats while tracking student progress.
                </p>
                <div className="fw-bold text-end">→</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
