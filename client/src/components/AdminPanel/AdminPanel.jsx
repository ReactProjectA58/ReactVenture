import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const AdminPanelDropdown = () => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Admin Panel
      </button>
      <ul className="dropdown-menu" style={{}}>
        <li>
          <Link className="dropdown-item" to="/deleted">
            Deleted posts
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/deleted">
            blabla
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/deleted">
            blablabla
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminPanelDropdown;
