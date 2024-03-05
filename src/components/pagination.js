import React from 'react';
import './pagination.css';

const Pagination = ({ currentPage, itemsPerPage, totalItems, nextPage, prevPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
      <div className="pagination-container">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            </li>
            <li className="page-item">
              <span className="page-link">{currentPage}</span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
  );
}

export default Pagination;
