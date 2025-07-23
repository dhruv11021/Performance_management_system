const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboard");
const reviewsRoutes = require('./routes/reviews');
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", require("./routes/employees"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/reviews", reviewsRoutes);

app.use("/api/reports", require("./routes/reports"));

// Add other routes as you build them

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
