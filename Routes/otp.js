const express = require("express");
const otpGenerator = require("otp-generator");
const bodyparser = require("body-parser");
const router = express.Router();
require('dotenv').config();
const Otp = require("../Models/Otp");
const User = require("../Models/User");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "",
    auth: {
        user: "",
        pass: ""
    }
})

let mailOptions = {
    from: "",
    to: "",
    subject: "",
    text: ""
}

transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
        console.log(err);
    }
    else {
        alert("Email is send to your mail successfuly")
    }
})

router.post("/generateOtp", async (req, res) => {
    try {
        let body = req.body;
        let user = await User.findOne({ mobileno: body.mobileno })
        // console.log(user);
        if (!user) {
            res.status(400).json({ message: "Mobile number not found...please check number" })
        }
        if (user) {
            // res.status(200).json({ status: "success", data: user });
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: true, specialChars: true });
            console.log(OTP);

            let otp = new Otp();
            otpexist = await Otp.findOne({ mobileno: body.mobileno });
            // console.log(otpexist);
            if (!otpexist) {
                otp.mobileno = body.mobileno;
                otp.otp = OTP;

                otp.save().then((result) => {
                    res.status(200).json({ otp: result.otp });
                }, (err) => {
                    res.end(JSON.stringify(err))
                })
            }
            if (otpexist) {
                otpexist.otp = OTP;
                otpexist.save().then((result) => {
                    res.status(200).json({ otp: result.otp });
                }, (err) => {
                    res.end(JSON.stringify(err));
                })
            }
        }

    }
    catch (err) {
        res.status(400).json({ msg: "Something went wrong" })
    }
});

router.post("/verifyOtp", async (req, res) => {
    try {
        let body = req.body;
        console.log(body.otp)
        let otp = await Otp.findOne({ otp: body.otp });
        console.log(otp);
        if (!otp) {
            res.status(400).json({ message: "Wrong otp" })
        }

        if (otp) {
            res.status(200).json({ message: "Otp verified" });
            let user = await User.findOne({ mobileno: otp.mobileno });
            console.log(user);
            user.verified = true;

            user.save().then((result) => {
                console.log(result);
            })
        }
    }
    catch (error) {
        console.log(error)
    }
})



module.exports = router;