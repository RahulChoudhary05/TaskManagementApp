'use client';

export default function TaskFilters({ 
  filters, 
  onFilterChange, 
  taskCount 
}) {
  const { status, sortBy, sortOrder } = filters;

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  const toggleSortOrder = () => {
    onFilterChange({ 
      ...filters, 
      sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-purple-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Task Count */}
        <div className="text-sm font-semibold">
          <span className="text-gray-600">Showing</span> <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">{taskCount}</span> <span className="text-gray-600">task{taskCount !== 1 ? 's' : ''}</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Status:
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={handleStatusChange}
              className="text-sm font-semibold border-2 border-purple-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 shadow-sm"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="text-sm font-semibold border-2 border-purple-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 shadow-sm"
            >
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-purple-600 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-sm transform hover:scale-105"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Asc
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Desc
              </>
            )}
          </button>

          {/* Clear Filters */}
          {(status !== 'all' || sortBy !== 'dueDate' || sortOrder !== 'asc') && (
            <button
              onClick={() => onFilterChange({ status: 'all', sortBy: 'dueDate', sortOrder: 'asc' })}
              className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
