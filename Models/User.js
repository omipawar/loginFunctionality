const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        mobileno: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    { timestamps: true }
);
const Admin = mongoose.model("users", schema);
module.exports = Admin;