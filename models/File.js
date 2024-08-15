const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

fileSchema.post("save", async function (doc) {
  try {
    console.log("document : ", doc);
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "coderboy - by Prabhat",
      to: doc.email,
      subject: "New File Uploaded successfully",
      html: `<h1>Hello brother</h1>
      <p>New file has been uploaded to cloudinary platform, please view it from here: <a href = "${doc.imageUrl}">${doc.imageUrl}</a></p>`,
    });

    console.log("information sent : ", info);
  } catch (error) {
    console.error("error: ", error);
  }
});

module.exports = mongoose.model("File", fileSchema);
