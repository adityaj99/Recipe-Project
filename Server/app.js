import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
dotenv.config();

// cron jobs
import badgeCron from "./cronJobs/badgeCron.js";

import connectDb from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
const port = process.env.PORT || 3000;

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import recipeRoutes from "./routes/recipeRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import collectionRoutes from "./routes/collectionRoute.js";

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://recipe-project-black.vercel.app",
    credentials: true,
  })
);

badgeCron();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/collections", collectionRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
