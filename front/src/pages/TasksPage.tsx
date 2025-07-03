import React, { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask, createTask } from "../service/toDoService.ts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Filter from "../components/Filter.tsx";
import Modal from "../components/Modal.tsx";
import TaskForm from "../components/FormTask.tsx";
import { useNavigate } from "react-router-dom";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

function TasksPage() {
    const navigate = useNavigate();

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

    const formatStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "todo":
                return "To do";
            case "in progress":
                return "In Progress";
            case "done":
                return "Done";
            default:
                return status;
        }
    };


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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };



    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };




    if (isLoading) return <p>Loading tasks...</p>;
    if (isError) return <p>Error: {(error as Error)?.message}</p>;

    const activeTasks = filteredTasks.filter(task => task.status.toLowerCase() !== "done");
    const doneTasks = filteredTasks.filter(task => task.status.toLowerCase() === "done");

    return (
        <div className="tasks-page">
            <div className="tasks-page-header">
                <h1>Tasks</h1>
                <span

                    onClick={handleLogout}
                    title="Logout"
                    role="button"
                    tabIndex={0}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-box-arrow-left"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                        />
                    </svg>
                </span>
            </div>
            <Filter onFilter={filterTasks} onCancel={() => setFilteredTasks(tasks)} />

            {filteredTasks.length === 0 && <p>No tasks found</p>}
            <ul>
                {activeTasks.map((task) => (
                    <li key={task.id}>

                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {formatStatus(task.status)}</p>
                        <div className="task-actions">
                            <button onClick={() => {
                                setEditingTask(task);
                                setIsAddOpen(false);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                            </button>
                            <button onClick={() => handleDelete(task.id)}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg></button>
                        </div>


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
            <button className="add-task-button" onClick={() => {
                setIsAddOpen(true);
                setEditingTask(null);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                </svg>
                Add Task
            </button>

            <ul>
                {doneTasks.map((task) => (
                    <li key={task.id} className="done-task">

                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {formatStatus(task.status)}</p>
                        <div className="task-actions">
                            <button onClick={() => {
                                setEditingTask(task);
                                setIsAddOpen(false);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                            </button>
                            <button onClick={() => handleDelete(task.id)}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg></button>
                        </div>


                    </li>
                ))}
            </ul>

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
