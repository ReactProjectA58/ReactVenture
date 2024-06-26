import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { BASE } from "../../common/constants";

export default function AdminPanelDropdown() {
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
          <Link className="dropdown-item" to={`${BASE}user-search`}>
            Users searcher
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to={`${BASE}posts`}>
            View All Posts
          </Link>
        </li>
      </ul>
    </div>
  );
}
