import React, { useState, FormEvent } from "react";

type FilterProps = {
  onFilter: (search: string, statuses: string[]) => void;
  onCancel: () => void;
};

function Filter({ onFilter, onCancel }: FilterProps) {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);

  const toggleStatus = (status: string) => {
    setStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter(search.trim(), statuses);
  };

  const handleCancel = () => {
    setSearch("");
    setStatuses([]);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="filter-search">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-status">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={statuses.includes("todo")}
            onChange={() => toggleStatus("todo")}
          />
          <span>To do</span>
        </label>
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={statuses.includes("in progress")}
            onChange={() => toggleStatus("in progress")}
          />
          <span>In Progress</span>
        </label>
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={statuses.includes("done")}
            onChange={() => toggleStatus("done")}
          />
          <span>Done</span>
        </label>
      </div>

      <div className="filter-buttons">
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
          Filter</button>
        <button type="button" onClick={handleCancel}>
          Clean
        </button>
      </div>

    </form>
  );
}

export default Filter;
