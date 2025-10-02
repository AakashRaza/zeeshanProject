const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve specific API routes
app.use("/api/add-user", require("./api/add-user"));
app.use("/api/get-users", require("./api/get-users"));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});