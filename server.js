//imports
var express = require("express");
var bodyparser = require("body-parser");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: './config/.env' });
var cookieParser = require('cookie-parser');

var app = express();
var jsonparser = bodyparser.json();

//Middleware
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("uploads"));

//CORS 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
});

//Database connection
mongoose.connect(`${process.env.DATABASE}`);
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.on("open", () => console.log("Connection Established...."));

app.get("/", (req, res) => {
    res.send("Hello welcome to JWT Authentication......");
    res.end();
});

//Routes
app.use("/user", require("./Routes/user"));
app.use("/userVerification", require("./Routes/otp"));
app.use("/upload", require("./Routes/fileupload"))

//Server
app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    else {
        console.log(`Website started on ${process.env.PORT}`);
    }
});