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
    <form onSubmit={handleSubmit} >
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={statuses.includes("todo")}
          onChange={() => toggleStatus("todo")}
        />
        To Do
      </label>
      <label>
        <input
          type="checkbox"
          checked={statuses.includes("in progress")}
          onChange={() => toggleStatus("in progress")}
        />
        In Progress
      </label>
      <label>
        <input
          type="checkbox"
          checked={statuses.includes("done")}
          onChange={() => toggleStatus("done")}
        />
        Done
      </label>
      <button type="submit">Filter</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default Filter;
