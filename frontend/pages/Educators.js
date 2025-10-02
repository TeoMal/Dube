import React from "react";

export default function Educators() {
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#4a274f" }}>
        🧑‍🏫 Educator Experience with DUBE
      </h2>

      <p className="text-muted text-center mb-5">
        DUBE empowers teachers with smart tools to create, manage, and monitor 
        personalized learning experiences — without extra effort. Here’s how you’ll use it:
      </p>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow h-100 border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">1. Create Courses</h5>
              <p className="card-text">
                Upload text, images, or simple lesson outlines. 
                DUBE’s AI automatically generates additional media — videos, 
                audio explanations, relationship maps — making your content richer and more engaging.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">2. Track Student Progress</h5>
              <p className="card-text">
                Access detailed analytics on each learner’s style (visual, auditory, or textual) 
                and monitor how students interact with materials and tests in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">3. Refine & Improve</h5>
              <p className="card-text">
                Edit courses anytime and let the AI re-adapt. 
                Use insights from learning statistics to improve teaching strategies 
                and provide a more personalized experience for every student.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-muted">
        With DUBE, educators spend less time preparing repetitive materials and 
        more time guiding, inspiring, and mentoring students. 🚀
      </p>
    </div>
  );
}
