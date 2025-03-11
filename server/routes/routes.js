import express from "express";
import { handleDocumentParser } from "../controller/docsparser.controller.js";
import { upload } from "../middleware/multer-uploadfile.js";
const routes = express.Router();

routes.post("/api/upload", upload.single("file"), handleDocumentParser);

export { routes };
