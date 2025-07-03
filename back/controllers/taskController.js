import { Task } from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { user_id: req.userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Task.destroy({
      where: { id, user_id: req.userId },
    });
    if (deletedCount === 0) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const [updatedCount] = await Task.update(
      { title, description, status },
      { where: { id, user_id: req.userId } }
    );
    if (updatedCount === 0) return res.status(404).json({ message: "Task not found" });
    const updatedTask = await Task.findOne({ where: { id } });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
    try {
      const { title, description, status } = req.body;
  
      const newTask = await Task.create({
        title,
        description,
        status,
        user_id: req.userId,
      });
  
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
