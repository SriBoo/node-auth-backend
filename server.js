import express from "express";
import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import { isAuthenticated } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const SQLiteStoreSession = SQLiteStore(session);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    store: new SQLiteStoreSession({ db: "sessions.sqlite", dir: "./data" }),
    secret: process.env.SESSION_SECRET || "keyboard_cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

(async () => {
  const db = await initDB();

  app.use("/api/auth", authRoutes(db));

  app.get("/api/dashboard", isAuthenticated, (req, res) => {
    res.json({ message: `Welcome ${req.session.email}! This is dashboard.` });
  });

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
})();
