import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const port = 3031;

const corsOptions = {
  origin: [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:5175",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
