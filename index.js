const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();
const port = process.env.PORT || 7000;

// storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.replace(/\s+/g, "-");
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const currentTime = `${date.getHours().toString().padStart(2, "0")}-${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}`;
    const fileName = `${currentDate}_${currentTime}_${originalName}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage:storage });
app.use("/image", express.static(path.join(__dirname, "public/images")));

// routes
app.get("/", (req, res) => {
  res.send("it is our server like cloudinary");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const imageName = req.file;
    console.log(imageName);
    res
      .status(200)
      .json({ url: `${process.env.URL}/image/${imageName.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "public/images", filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "file not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Image Server is running on port ${port}`);
});
