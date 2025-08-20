import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("NodeJS + ReactJS API Server");
});

routes(app);

// Error handling middleware (phải để cuối cùng)
app.use(errorHandlingMiddleware);

const port = process?.env?.PORT ?? 2004;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
