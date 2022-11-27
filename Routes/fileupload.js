const express = require("express")
const multer = require("multer")
require('pretty-error').start();
const File = require("../Models/File")

const app = express();
const router = express.Router()

//File upload
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, `image_${file.originalname}`)
    }
})
const upload = multer({ storage: storage })

//For single image upload
router.post("/image", upload.single('image'), async (req, res) => {
    try {
        let file = req.file;
        let uploadfile = new File();
        // console.log(req.body);
        if (!file) {
            res.status(403).send({ status: "Select a fie first" })
        }
        if (file) {
            uploadfile.name = req.body.name;
            uploadfile.path = req.file.filename;
            uploadfile.save().then((result) => {
                console.log("File uploaded successfully");
            })
            res.status(200).json({ status: "File upload successful" });
        }
    }
    catch (err) {
        res.status(404).json({ "error": err.message })
    }
})
//Date.now() + "-" + file.originalname)


//For multiple images upload
router.post("/multipleimages", upload.array('images'), async (req, res) => {
    let files = req.files;
    var filenames = req.files.map(function (file) {
        return file.filename; // or file.originalname
    });
    console.log("files names", filenames);
    let uploadfile = new File();

    if (!files) {
        res.status(403).json({ status: "Select a fie first" })
    }
    if (files) {
        uploadfile.name = req.body.name;
        uploadfile.path = filenames;
        uploadfile.save().then((result) => {
            console.log("File uploaded successfully");
        })
        res.status(200).json({ status: "File upload successful" });
    }
})


module.exports = router;