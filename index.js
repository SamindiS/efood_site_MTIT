require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const loyaltyRoutes = require("./routes/loyaltyRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


// 📡 Routes
app.use("/api", loyaltyRoutes);


// 🧪 Test Route
app.get("/", (req, res) => {
    res.send("Loyalty Service Running 🚀");
});


// 🚀 Start Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});