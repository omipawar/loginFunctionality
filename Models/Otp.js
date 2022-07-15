const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        mobileno: {
            type: Number,
            required: true
        },
        // email: {
        //     type: String,
        //     required: true
        // },
        otp: {
            type: String,
            required: true
        }
        ,
        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: 30 }
        }
    },
    { timestamps: true }
);
const Otp = mongoose.model("otps", schema);
module.exports = Otp;