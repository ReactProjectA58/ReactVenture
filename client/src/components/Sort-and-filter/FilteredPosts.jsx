import React from "react";
import { Link } from "react-router-dom";

export default function FilterPostsPanelDropdown() {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Filter by:
      </button>
      <ul className="dropdown-menu" style={{}}>
        <li>
          <Link className="dropdown-item" to="/filtered-by-comments">
            Comments
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/by-likes">
            Likes
          </Link>
        </li>
      </ul>
    </div>
  );
}
