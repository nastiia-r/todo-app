import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../service/toDoService.ts";

function AddTask() {
  const token = localStorage.getItem("token") || "";
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  const createMutation = useMutation({
    mutationFn: (task: { title: string; description: string; status: string }) =>
      createTask(task, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", token] });
      setIsOpen(false);
      setForm({ title: "", description: "", status: "todo" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Add Task</button>

      {isOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>Add New Task</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button type="submit">Add</button>
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddTask;
