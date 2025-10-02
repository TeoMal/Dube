import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";
import ProfPhoto from "../public/Prof.png"; 
import StudentPhoto from "../public/Student.png"; 

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container text-center my-4">
      {user.isLoggedIn ? (
        <>
          <h2>
            Welcome back, <span className="text-primary fw-bold">{user.username}</span>!
          </h2>
          {/* <p className="text-muted">
            Ready to continue learning or create something new?
          </p> */}

          {/* <div className="row justify-content-center mt-4">
            <div className="col-md-5 mb-3">
              <Link to="/courses" className="text-decoration-none">
                <div className="card shadow border-0 h-100">
                  <div className="card-body bg-success text-white rounded">
                    <h5 className="card-title">📚 Participate in a Course</h5>
                    <p className="card-text">
                      Browse available courses and join lessons that match your interests.
                    </p>
                    <div className="fw-bold text-end">→</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-5 mb-3">
              <Link to="/create-course" className="text-decoration-none">
                <div className="card shadow border-0 h-100">
                  <div className="card-body bg-warning text-white rounded">
                    <h5 className="card-title">📝 Create a Course</h5>
                    <p className="card-text">
                      Design new lessons, upload content, and manage your students.
                    </p>
                    <div className="fw-bold text-end">→</div>
                  </div>
                </div>
              </Link>
            </div>
          </div> */}
        </>
      ) : (
        <>
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
                    <div className="fw-bold text-end fs-3">→</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-5 mb-3">
              <Link to="/educators" className="text-decoration-none">
                <div className="card shadow border-0 h-100">
                  <div className="card-body bg-primary text-white rounded">
                    <h5 className="card-title">🧑‍🏫 For Educators</h5>
                    <img src={ProfPhoto} width="300" height="100" alt="Educators illustration" className="img-fluid my-2" />
                    <p className="card-text">
                      Smarter teaching. Upload once, and DUBE creates lessons in multiple formats while tracking student progress.
                    </p>
                    <div className="fw-bold text-end fs-3">→</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

