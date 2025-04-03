import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ConnectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config({});
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({
    message: "Hello, i am backend!",
    success: true,
  });
});

app.use(cookieParser());

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5713",
  credentials: true,
};
app.use(cors(corsOptions));

//  yaha pe hamari api call karenge

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server is running on port ${PORT}`);
});
