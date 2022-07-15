var express = require("express");
var bodyparser = require("body-parser");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require('dotenv').config();

var app = express();
var jsonparser = bodyparser.json();

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(`${process.env.DATABASE}`);
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.on("open", () => console.log("Connection Established...."));

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
});



app.get("/", (req, res) => {
    res.send("Hello welcome to JWT Authentication......");
    res.end();
});

app.use("/user", require("./Routes/user"));
app.use("/userVerification", require("./Routes/otp"));

app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    else {
        console.log(`Website started on ${process.env.PORT}`);
    }
});