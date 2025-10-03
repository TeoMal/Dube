import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";
import ProfPhoto from "../public/Prof.png";
import StudentPhoto from "../public/Student.png";


export default function Home() {
  const { user } = useContext(AuthContext);
  const fullName = "John Papadopoulos";
  const email = "example@example.com";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // colors for graph slices
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    if (user.isLoggedIn) {
      fetch(`http://127.0.0.1:5000/get_user_stats?user=user1`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (user.isLoggedIn && loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-center my-4">
      {user.isLoggedIn ? (
        <>
          <h2>
            Welcome back,{" "}
            <span className="text-primary fw-bold">{user.username}</span>!
          </h2>
          <div className="container my-5">
            <div className="row">
              {/* Left column: Experience */}
              <div className="col-md-6">
                <h2 className="fw-bold mb-4">✨ Experience with DUBE</h2>
                <p className="text-muted mb-4">
                  Smart tools that help students learn and educators teach more effectively.
                </p>

                <div className="list-group border-0">
                  <div className="list-group-item border-0 mb-3 shadow-sm rounded d-flex align-items-start">
                    <div className="me-3 fs-3 text-primary">📚</div>
                    <div>
                      <h5 className="fw-bold mb-1">Create & Learn</h5>
                      <p className="text-muted mb-0">Upload lessons or explore courses in text, audio, and video.</p>
                    </div>
                  </div>

                  <div className="list-group-item border-0 mb-3 shadow-sm rounded d-flex align-items-start">
                    <div className="me-3 fs-3 text-success">⚡</div>
                    <div>
                      <h5 className="fw-bold mb-1">Personalized</h5>
                      <p className="text-muted mb-0">Lessons adapt to each learner’s style automatically.</p>
                    </div>
                  </div>

                  <div className="list-group-item border-0 mb-3 shadow-sm rounded d-flex align-items-start">
                    <div className="me-3 fs-3 text-warning">📊</div>
                    <div>
                      <h5 className="fw-bold mb-1">Track Progress</h5>
                      <p className="text-muted mb-0">View stats and improve learning outcomes easily.</p>
                    </div>
                  </div>

                  <div className="list-group-item border-0 shadow-sm rounded d-flex align-items-start">
                    <div className="me-3 fs-3 text-danger">🌱</div>
                    <div>
                      <h5 className="fw-bold mb-1">Grow & Motivate</h5>
                      <p className="text-muted mb-0">Focus on guidance while students stay motivated.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Stats */}
              <div className="col-md-6">
                <h2 className="fw-bold mb-4">📊 Your Stats</h2>
                {stats ? (
                  <>
                    {/* Personal info */}
                    <div className="card shadow border-0 mb-4">
                      <div className="card-body">
                        <h4 className="fw-bold">{fullName}</h4>
                        <p className="text-muted mb-1">{email}</p>
                      </div>
                    </div>

                    {/* Learning Preferences with progress bars */}
                    <h5 className="fw-bold mb-3">🎯 Learning Preferences</h5>
                    <div className="card shadow border-0">
                      <div className="card-body text-start">
                        {Object.entries(stats.learning_preferences).map(([type, prob], idx) => {
                          const percent = (prob * 100).toFixed(1);
                          let barClass = "bg-primary";
                          if (idx === 1) barClass = "bg-success";
                          if (idx === 2) barClass = "bg-warning";
                          if (idx === 3) barClass = "bg-danger";

                          return (
                            <div key={type} className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span className="fw-bold text-capitalize">{type}</span>
                                <span>{percent}%</span>
                              </div>
                              <div className="progress" style={{ height: "8px" }}>
                                <div
                                  className={`progress-bar ${barClass}`}
                                  role="progressbar"
                                  style={{ width: `${percent}%` }}
                                  aria-valuenow={percent}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted">No stats available.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2>
            Welcome to{" "}
            <span className="text-primary fw-bold">DUBE</span>, Dynamic User Based Education
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
                    <img
                      src={StudentPhoto}
                      width="300"
                      height="100"
                      alt="Students illustration"
                      className="img-fluid my-2"
                    />
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
                    <img
                      src={ProfPhoto}
                      width="300"
                      height="100"
                      alt="Educators illustration"
                      className="img-fluid my-2"
                    />
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
