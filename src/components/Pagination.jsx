import React from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange
}) {
  if (totalPages <= 0) return null;

  const handleFirstPage = () => {
    if (currentPage > 1) onPageChange(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) onPageChange(totalPages);
  };

  const handlePageSelect = (e) => {
    const pageNum = parseInt(e.target.value, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handlePageSizeSelect = (e) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size)) {
      onPageSizeChange(size);
    }
  };

  // Generate options for page selection dropdown
  const pageOptions = [];
  for (let i = 1; i <= totalPages; i++) {
    pageOptions.push(i);
  }

  return (
    <div className="table-pagination-container">
      <div className="pagination-left">
        <select
          value={pageSize}
          onChange={handlePageSizeSelect}
          className="pagination-select page-size-select"
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination-right">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Trang đầu"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Trang trước"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="pagination-label">Page</span>
        
        <select
          value={currentPage}
          onChange={handlePageSelect}
          className="pagination-select page-num-select"
        >
          {pageOptions.map(pageNum => (
            <option key={pageNum} value={pageNum}>
              {pageNum}
            </option>
          ))}
        </select>

        <span className="pagination-total">/ {totalPages}</span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Trang sau"
        >
          <ArrowRight size={16} />
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Trang cuối"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
