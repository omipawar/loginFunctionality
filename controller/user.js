// const nodemailer = require("nodemailer"); //monsbpdwgflvvycq
const userService = require("../services/userService");

class UserController {
    async verifyMail(req, res) {
        let userServiceObj = new userService();
        try {
            let result = await userServiceObj.verifyEmail(req);
            return res.status(200).send({ status: "success", data: result })
        } catch (error) {
            return res.status(400).send({ status: "failed", error: error })
        }
    }
}

module.exports = UserController;