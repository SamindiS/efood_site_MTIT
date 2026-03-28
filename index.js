require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected (Review Service)"))
  .catch(err => console.log(err));


// 📡 Routes
app.use("/api", reviewRoutes);


// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("Review Service Running ⭐");
});


// 🚀 Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});