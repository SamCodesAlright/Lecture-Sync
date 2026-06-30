import React from "react";
import EmptyState from "./EmptyState.jsx";
import Pagination from "./Pagination.jsx";
import SearchBar from "./SearchBar.jsx";

const Table = ({
  columns = [],
  data = [],
  rowKey = "id",
  onRowClick,
  search,
  pagination,
  emptyMessage = "No records found.",
  className = "",
  tableClassName = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {search && (
        <SearchBar
          value={search.value}
          onChange={search.onChange} // receives plain string
          placeholder={search.placeholder}
          onClear={search.onClear}
        />
      )}

      <div
        className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${tableClassName}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessor || column.header}
                    className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={row[rowKey] ?? rowIndex}
                    className={`transition duration-150 hover:bg-slate-50/70 ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.accessor || column.header}
                        className="px-6 py-4 align-middle text-slate-700"
                      >
                        {column.render
                          ? column.render(row)
                          : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16">
                    <EmptyState
                      title={emptyMessage}
                      description="Try updating your filters or add new records."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

export default Table;
