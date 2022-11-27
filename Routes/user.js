const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();
const User = require("../Models/User");
require('pretty-error').start();
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const UserController = require("../controller/user")

// // Token verification middleware
// function verifyToken(req, res, next) {
//     if (!req.headers.authorization) {
//         return res.status(401).send("Unauthorized request...");
//     }
//     let token = req.headers.authorization;
//     // let token = req.headers.authorization.split(' ')[1];
//     if (token === 'null') {
//         return res.status(401).send("Unauthorized request...");
//     }
//     let payload = jwt.verify(token, process.env.SECRET_KEY);
//     // console.log("payload", payload)
//     if (!payload) {
//         return res.status(401).send("Unauthorized request...");
//     }
//     req.userId = payload.subject;
//     // console.log("userid", req.userId);
//     next();
// }

router.post("/register", async (req, res) => {
    try {
        let body = req.body;
        let user = new User();

        if (!body.data) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }

        user.username = body.data.username;
        user.email = body.data.email;
        user.mobileno = body.data.mobileno;
        // user.verified = false;

        if (body.data.password != body.data.confirmPassword) {
            return res.status(400).send({ error: "Confirm password is not correct" });
        }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);

        // now we set user password to hashed password
        user.password = await bcrypt.hash(body.data.password, salt);

        user.save().then((result) => {
            // console.log(result);
            let payload = { subject: result._id };
            let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1hr" })
            res.status(200).json({ staus: "Success", Token: token, "expiresIn": "1 Hour" });
        }, (err) => {
            res.end(JSON.stringify(err));
            console.log(err);
        })
    }
    catch (err) {
        console.log(err.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findOne({ email: body.data.email });
        if (!user) {
            res.send({status:"failed", error: "Invalid username" });
            return;
        }
        if (user && !user.verified) {
            res.send({status:"failed", error: "User is not verified" });
            return;
        }
        if (user) {
            const validPassword = await bcrypt.compare(body.data.password, user.password);
            // console.log(validPassword);
            if (validPassword) {
                let payload = { subject: user._id };
                let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1hr" });

                res.status(200).json({ status: "success", Token: token, "ecpiresIn": "1 hour" });
            } else {
                res.status(400).json({status:"failed", error: "Invalid Password" });
            }
        }
        else {
            res.status(401).json({status:"failed", error: "User does not exist" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});

router.get("/getDetails", auth.verifyToken, async (req, res) => {
    let events = [
        {
            "userId": 1,
            "id": 1,
            "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        },
        {
            "userId": 1,
            "id": 2,
            "title": "qui est esse",
            "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
        },
        {
            "userId": 1,
            "id": 3,
            "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
            "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
        },
        {
            "userId": 1,
            "id": 4,
            "title": "eum et est occaecati",
            "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
        },
        {
            "userId": 1,
            "id": 5,
            "title": "nesciunt quas odio",
            "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
        }
    ]
    res.json(events);
});

router.route("/verifyUserEmail").post(new UserController().verifyMail);



module.exports = router;