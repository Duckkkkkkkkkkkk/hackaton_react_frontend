import React from "react";
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  paginate,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePaginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination_content">
        <button
          onClick={() => handlePaginate(1)}
          disabled={isFirstPage}
        >
          «
        </button>
        <button
          onClick={() => handlePaginate(currentPage - 1)}
          disabled={isFirstPage}
        >
          {"<"}
        </button>
        <span>{currentPage}</span>/<span>{totalPages}</span>
        <button
          onClick={() => handlePaginate(currentPage + 1)}
          disabled={isLastPage}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePaginate(totalPages)}
          disabled={isLastPage}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
