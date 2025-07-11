// components/TaskForm.tsx
import React, { useState, useEffect } from "react";

interface TaskFormProps {
    initialData: { title: string; description: string; status: string };
    onSubmit: (form: { title: string; description: string; status: string }) => void;
    onCancel: () => void;
    title?: string; 
}

function TaskForm({ initialData, onSubmit, onCancel, title = "Task Form" }: TaskFormProps) {
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{title}</h2>
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
                <option value="todo">To do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <div className="task-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
            </div>
        </form>
    );
}

export default TaskForm;
