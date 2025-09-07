import serverless from "serverless-http";
import app from "../server.js"; // import express app

export default serverless(app);
