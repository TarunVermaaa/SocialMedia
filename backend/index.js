import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (_,res) => {
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

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
