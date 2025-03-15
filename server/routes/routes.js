import express from "express";
import { handleDocumentParser } from "../controller/docsparser.controller.js";
import { upload } from "../middleware/multer-uploadfile.js";
const routes = express.Router();

routes.post("/v1/upload", upload.single("file"), handleDocumentParser);

routes.post("/upload/v1/:query", )

export { routes };

