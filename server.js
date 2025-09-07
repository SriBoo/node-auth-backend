import express from "express";
import session from "express-session";
import cors from "cors";
import sqlite3 from "sqlite3";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS for frontend (vercel domain)
app.use(
  cors({
    origin: "https://react-auth-frontend-inky.vercel.app",
    credentials: true,
  })
);

// ✅ Session (stored in memory on Vercel, resets after cold start)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using https + proxy + https
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ✅ SQLite DB
const db = new sqlite3.Database("./data/users.db", (err) => {
  if (err) console.error("DB error", err);
  else console.log("SQLite DB connected");
});

// ✅ Routes
app.use("/auth", authRoutes(db));

// ✅ Export app for Vercel
export default app;

// ✅ Local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}
