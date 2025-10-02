import React from "react";
import { Link } from "react-router-dom";

export default function Courses() {
  return (
        <div className="container text-center my-4">
          <p className="text-muted">
            Ready to continue learning or create something new?
          </p>

          <div className="row justify-content-center mt-4">
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
          </div>
      
        </div>
        );}
