const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const githubRoutes = require("./routes/githubRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "DevFlow API is running "
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`DevFlow server running on http://localhost:${PORT}`);
});