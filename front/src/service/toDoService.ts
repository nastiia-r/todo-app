
const API_URL = "http://localhost:5000/api";

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  }
  
  export async function register(
    username: string,
    email: string,
    password: string
  ) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }), 
          });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Register failed");
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  }

  
export async function getTasks(token: string) {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }
  return data;
}

export async function deleteTask(id: number, token: string) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete task");
  }
}

export async function updateTask(id: number, taskData: {title: string, description: string, status: string}, token: string) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }
  return data;
}

export async function createTask(
  task: { title: string; description: string; status: string },
  token: string
) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}
