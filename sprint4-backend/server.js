import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "./api/auth/auth.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { stayRoutes } from "./api/stay/stay.routes.js";

const app = express();
const port = 3030;

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stay", stayRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
