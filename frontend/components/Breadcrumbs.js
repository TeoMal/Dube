import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  // Split the pathname into parts and filter out empty strings
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Helper function to capitalize first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="bg-light px-4 py-2">
      <small>
        <Link to="/" className="text-decoration-none">Home</Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <span key={to}>
              {" / "}
              <Link to={to} className="text-decoration-none">
                {capitalize(value)}
              </Link>
            </span>
          );
        })}
      </small>
    </div>
  );
}
