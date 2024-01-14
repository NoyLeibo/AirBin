import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { authRoutes } from "./api/auth/auth.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { stayRoutes } from "./api/stay/stay.routes.js";
import { setupSocketAPI } from "./services/socket.services.js";
import { logger } from "./services/logger.service.js";

const app = express();
// const port = 3030;
const server = http.createServer(app);

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
setupSocketAPI(server);

// app.listen(port, () => {
//   console.log(`Server is listening at http://localhost:${port}`);
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}
const port = process.env.PORT || 3030;
server.listen(port, () => {
  logger.info("Server is running on port: " + port);
});
