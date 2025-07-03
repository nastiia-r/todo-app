import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sequelize } from "./config/sequelize.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.authenticate()
  .then(() => {
    console.log("Connected to DB");
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log("Models synchronized"))
  .catch(err => console.error("DB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
