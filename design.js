
const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
    designName: String,
    wallColor: String,
    floorColor: String,
    furniture: [String],
    camera: {
        position: [Number],
        target: [Number]
    }
}, { timestamps: true });

module.exports = mongoose.model("Design", DesignSchema);
