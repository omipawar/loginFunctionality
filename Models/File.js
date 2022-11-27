const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    path:{
        type:Array,
        required:true
    }
})

const File = mongoose.model("files", schema);
module.exports = File;