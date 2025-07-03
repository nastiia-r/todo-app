import React, { useState } from "react";
import { getTasks, deleteTask, updateTask } from "../service/toDoService.ts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

function TasksPage() {
    const token = localStorage.getItem("token") || "";
    const queryClient = useQueryClient();
    const [editingTask, setEditingTask] = useState<number | null>(null);
    const [form, setForm] = useState({ title: "", description: "", status: "todo" });


    const { data: tasks = [], isLoading, isError, error } = useQuery({
        queryKey: ["tasks", token],
        queryFn: () => getTasks(token),
        enabled: Boolean(token),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteTask(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", token] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; task: { title: string; description: string; status: string } }) =>
            updateTask(data.id, data.task, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", token] });
        },
    });

    const startEdit = (task: Task) => {
        setEditingTask(task.id);
        setForm({ title: task.title, description: task.description, status: task.status });
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setForm({ title: "", description: "", status: "todo" });
    };



    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTask === null) return;
        updateMutation.mutate({ id: editingTask, task: form });
        cancelEdit();
    };



    if (isLoading) return <p>Loading tasks...</p>;
    if (isError) return <p>Error: {(error as Error)?.message}</p>;    
    return (
        <div>
            <h1>Tasks Page</h1>
            {tasks.length === 0 && <p>No tasks found</p>}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editingTask === task.id ? (
                            <form onSubmit={handleUpdate}>
                                <input type="text" name="title" value={form.title} onChange={handleChange} required />
                                <textarea name="description" value={form.description} onChange={handleChange} />
                                <select name="status" value={form.status} onChange={handleChange}>
                                    <option value="todo">To Do</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                                <button type="submit">Save</button>
                                <button type="button" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <button onClick={() => startEdit(task)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TasksPage;
