
const API_URL = "http://localhost:5000/api/auth";

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/login`, {
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
        const response = await fetch(`${API_URL}/register`, {
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