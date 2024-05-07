const express = require("express");
const multer = require("multer");
const { createThumbnail } = require("../../middlewares.js");
const {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatByOwner,
} = require("../controllers/cat-controller.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const originalFilename = file.originalname.split(".")[0].toLowerCase();
    const prefix = `${originalFilename}-${file.fieldname}`;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    let extension = "jpeg";
    for (const mimeType of allowedMimeTypes) {
      if (file.mimetype === mimeType) {
        extension = mimeType.split("/")[1];
        break;
      }
    }

    const filename = `${prefix}-${suffix}.${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  dest: "uploads/",
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      const error = new Error("Only images and videos are supported.");
      error.status = 400;
      cb(error);
    }
  },
});

const catRouter = express.Router();

catRouter.get("/", getCat);
catRouter.post("/", upload.single("file"), createThumbnail, postCat);

catRouter.get("/:id", getCatById);
catRouter.put("/:id", putCat);
catRouter.delete("/:id", deleteCat);

catRouter.get("/owner/:id", getCatByOwner);

module.exports = catRouter;
