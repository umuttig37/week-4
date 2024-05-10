import express from "express";
import multer from "multer";
import { createThumbnail, authenticateToken } from "../../middlewares.js";
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatByOwner,
} from "../controllers/cat-controller.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const originalFilename = file.originalname.split(".")[0].toLowerCase();
    const prefix = `${originalFilename}-${file.fieldname}`;
    console.log(originalFilename);
    console.log(file.fieldname);

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
    console.log("PREEEEFIIIIX:", prefix);
    console.log("SUFFFFIIIIIX:", suffix);
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

catRouter
  .route("/")
  .get(getCat)
  .post(authenticateToken, upload.single("file"), createThumbnail, postCat);

catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, putCat)
  .delete(authenticateToken, deleteCat);

catRouter.route("/owner/:id").get(getCatByOwner);
export default catRouter;
