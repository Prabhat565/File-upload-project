const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());

const db = require("./config/database");
db();

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const upload = require("./routes/FileUpload");
app.use("/api/v1/upload", upload);

app.listen(PORT, () => {
  console.log(`app is running at ${PORT}`);
});
