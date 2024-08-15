const File = require("../models/File");
const { options } = require("../routes/FileUpload");
const cloudinary = require("cloudinary").v2;
// localFileUpload - route handler:

exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files.file;
    console.log("file : ", file);

    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("path : ", path);

    file.mv(path, (err) => {
      console.log("if error found,showing error : ", err);
    });

    res.status(200).json({
      success: true,
      message: " local file uploaded successfully...",
      data: file,
    });
  } catch (error) {
    console.log("error in local file upload: ", error);
    res.status(500).json({
      success: false,
      message: "Error in local file upload",
    });
  }
};

function isFileSupported(fileType, supportedFileType) {
  return supportedFileType.includes(fileType);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  console.log("options", options);

  console.log("file temp path : ", file.tempFilePath);
  const result = await cloudinary.uploader.upload(file.tempFilePath, options);
  console.log("result: ", result);
  return result;
}

// imageUpload route handler:
exports.imageUpload = async (req, res) => {
  try {
    // fetching data:
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.imageFile;
    console.log("file: ", file);

    // validation:

    const supportedFileType = ["jpg", "png", "jpeg"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("fileType: ", fileType);

    if (!isFileSupported(fileType, supportedFileType)) {
      return res.json({
        success: false,
        message: "file type not supported",
      });
    }

    // if file type is supported , then upload the imageFile to the cloudinary:

    console.log("uploading the image to cloudinary: ");

    const response = await uploadFileToCloudinary(file, "file-upload-class");

    console.log(response);

    // save the entry to database:
    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      mssg: "Image File uploaded successfully",
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      success: false,
      mssg: "Internal server error",
    });
  }
};

exports.videoUpload = async (req, res) => {
  try {
    // data fetch:
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    // video file fetching from req.files:

    const videoFile = req.files.videoFile;
    console.log("video file: ", videoFile);

    //validation:
    const supportedFileType = ["mp4", "mov"];
    const fileType = videoFile.name.split(".")[1].toLowerCase();

    if (!isFileSupported(fileType, supportedFileType)) {
      return res.json({
        success: false,
        mssg: "File type not supported",
      });
    }

    // if file type is supported:

    console.log("uplpading file to cloudinary :");

    const result = await uploadFileToCloudinary(videoFile, "file-upload-class");
    console.log(result);

    const fileData = await File.create({
      name,
      email,
      tags,
      videoUrl: result.secure_url,
    });

    res.status(200).json({
      success: true,
      mssg: "Video File uploaded successfully",
    });
  } catch (error) {
    console.error("error :", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while uplaoding video",
    });
  }
};

// imageReducerUpload handler:

exports.imageReducerUpload = async (req, res) => {
  try {
    // fetching data:
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.imageFile;
    console.log("file: ", file);

    // validation:

    const supportedFileType = ["jpg", "png", "jpeg"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("fileType: ", fileType);

    if (!isFileSupported(fileType, supportedFileType)) {
      return res.json({
        success: false,
        message: "file type not supported",
      });
    }

    // if file type is supported , then upload the imageFile to the cloudinary:

    console.log("uploading the image to cloudinary: ");

    const response = await uploadFileToCloudinary(
      file,
      "file-upload-class",
      30
    );

    console.log(response);

    // save the entry to database:
    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      mssg: "Image File uploaded successfully",
      imageUrl: response.secure_url,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      success: false,
      mssg: "Internal server error",
    });
  }
};
