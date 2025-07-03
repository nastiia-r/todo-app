import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("todo", "in progress", "done"),
    defaultValue: "todo",
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "tasks",
  timestamps: false,
});
