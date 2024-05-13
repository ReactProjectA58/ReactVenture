import React from "react";
import { Link } from "react-router-dom";

export default function SortPostsPanelDropdown() {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Sort by:
      </button>
      <ul className="dropdown-menu" style={{}}>
        <li>
          <Link className="dropdown-item" to="/sorted-by-author">
            Author
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/sorted-by-date">
            Date
          </Link>
        </li>
      </ul>
    </div>
  );
}
