import { deleteFile, time_remaining } from "../middleware/multer-uploadfile.js";
import { pdfParser } from "../service/langchain/langchain.js";
import fs from "fs";
export const handleDocumentParser = async (req, res) => {
  const file = req.file.path;
  console.log("files info ", req.file);
  const timeOut = [];
  try {
    if (!file) {
      return res.status(404).json({
        message: "Unknown path error...",
      });
    }
    const data = await pdfParser(file);
    fs.readFile(file, () => {
      if (data && data.length > 0) {
        return res.status(200).json({
          success: true,
          data,
        });
      }
    });
    const timer = setTimeout(
      () => deleteFile(file),
      time_remaining(req.body.date)
    );
    timeOut.push(timer);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error..." });
  }
};
