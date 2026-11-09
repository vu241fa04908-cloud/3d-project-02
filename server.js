
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Design = require("./models/design");

const app = express();

app.use(express.json());

// SAVE DESIGN
app.post("/api/designs", async (req, res) => {
    try {
        const design = new Design(req.body);
        await design.save();

        res.status(201).json({
            success: true,
            message: "Design saved successfully!",
            design
        });
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET ALL DESIGNS
app.get("/api/designs", async (req, res) => {
    try {
        const designs = await Design.find();
        res.json(designs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE DESIGN
app.put("/api/designs/:id", async (req, res) => {
    try {
        const design = await Design.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        res.json({ success: true, design });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE DESIGN
app.delete("/api/designs/:id", async (req, res) => {
    try {
        const design = await Design.findByIdAndDelete(req.params.id);

        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        res.json({ success: true, message: "Design deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// CONNECT TO MONGODB AND START SERVER
async function startServer() {
    try {
        console.log("MongoDB URI available:", !!process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully!");

        app.listen(5000, () => {
            console.log("Server running at http://localhost:5000");
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

startServer();
