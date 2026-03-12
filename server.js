const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Database connection failed:", err));

app.use("/books", bookRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});