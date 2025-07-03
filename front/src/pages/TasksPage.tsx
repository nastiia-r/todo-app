import React, { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask, createTask } from "../service/toDoService.ts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Filter from "../components/Filter.tsx";
import Modal from "../components/Modal.tsx";
import TaskForm from "../components/FormTask.tsx";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

function TasksPage() {
    const token = localStorage.getItem("token") || "";
    const queryClient = useQueryClient();
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);

    const filterTasks = (search: string, statuses: string[]) => {
        setSearchText(search);
        setSelectedStatuses(statuses);
        const filtered = tasks.filter((task) => {
            const matchesTitle = task.title.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statuses.length === 0 || statuses.includes(task.status);
            return matchesTitle && matchesStatus;
        });
        setFilteredTasks(filtered);
    };

    const { data: tasks = [], isLoading, isError, error } = useQuery({
        queryKey: ["tasks", token],
        queryFn: () => getTasks(token),
        enabled: Boolean(token),
    });

    useEffect(() => {
        const filtered = tasks.filter((task) => {
            const matchesTitle = task.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(task.status);
            return matchesTitle && matchesStatus;
        });
        setFilteredTasks(filtered);
    }, [tasks, searchText, selectedStatuses]);


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

    const createMutation = useMutation({
        mutationFn: (task: { title: string; description: string; status: string }) =>
            createTask(task, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", token] });
        },
    });





    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };




    if (isLoading) return <p>Loading tasks...</p>;
    if (isError) return <p>Error: {(error as Error)?.message}</p>;
    return (
        <div>
            <h1>Tasks Page</h1>
            <Filter onFilter={filterTasks} onCancel={() => setFilteredTasks(tasks)} />

            {filteredTasks.length === 0 && <p>No tasks found</p>}
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>

                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => {
                            setEditingTask(task);
                            setIsAddOpen(false);
                        }}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>

                    </li>
                ))}
            </ul>
            {/* <AddTask />

            {editingTask && (
                <EditTask
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSubmit={(form) =>
                        updateMutation.mutate({ id: editingTask.id, task: form })
                    }
                />
            )} */}
            <button onClick={() => {
                setIsAddOpen(true);
                setEditingTask(null);
            }}>Add Task</button>
            {isAddOpen && (
                <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
                    <TaskForm
                        initialData={{ title: "", description: "", status: "todo" }}
                        onSubmit={(form) => {
                            createMutation.mutate(form);
                            setIsAddOpen(false);
                        }}
                        onCancel={() => setIsAddOpen(false)}
                        title="Add Task"
                    />

                </Modal>
            )}

            {editingTask && (
                <Modal isOpen={true} onClose={() => setEditingTask(null)}>
                    <TaskForm
                        initialData={editingTask}
                        onSubmit={(form) => {
                            updateMutation.mutate({ id: editingTask.id, task: form });
                            setEditingTask(null);
                        }}
                        onCancel={() => setEditingTask(null)}
                        title="Edit Task"
                    />

                </Modal>
            )}


        </div>
    );
}

export default TasksPage;
