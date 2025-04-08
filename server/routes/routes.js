import express from "express";
import {
  fetchParsedSummary,
  handleDocumentParser,
  handleSummaryQuery,
} from "../controller/docsparser.controller.js";
import { upload } from "../middleware/multer-uploadfile.js";
const routes = express.Router();

routes.post("/v1/upload", upload.single("file"), handleDocumentParser);

routes.post("/v1/user/:query", handleSummaryQuery);

routes.get("/v1/user/text/:id", fetchParsedSummary);

export { routes };
