// components/TaskForm.tsx
import React, { useState, useEffect } from "react";

interface TaskFormProps {
    initialData: { title: string; description: string; status: string };
    onSubmit: (form: { title: string; description: string; status: string }) => void;
    onCancel: () => void;
    title?: string; // заголовок форми, наприклад: "Add Task" або "Edit Task"
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
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
}

export default TaskForm;
