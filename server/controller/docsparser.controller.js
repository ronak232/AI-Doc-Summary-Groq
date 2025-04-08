import { deleteFile, time_remaining } from "../middleware/multer-uploadfile.js";
import {
  fileParser,
  userQueryQuestion,
} from "../service/langchain/langchain.js";
import { v4 as uuidv4 } from "uuid";
import { convert } from "html-to-text";
import { connectDB } from "../database/db.js";
import { Summary } from "../model/Summary.js";

export const handleDocumentParser = async (req, res) => {
  const file = req.file?.path;

  const timeOut = [];
  try {
    await connectDB();
    const fileId = uuidv4();
    if (!file) {
      return res.status(404).json({
        message: "Unknown path error...",
      });
    }
    const data = await fileParser(file);
    
    if (data && data.length > 0) {
      const options = {
        wordWrap: 100,
      };
      const parseToText = convert(data, options);

      const newSummary = new Summary({
        fileId: fileId,
        summary: data,
      });
      await newSummary.save();

      return res.status(200).json({
        success: true,
        data,
        fileId,
        parseToText,
      });
    }
    const timer = setTimeout(
      () => deleteFile(file),
      time_remaining(req.body.date)
    );
    timeOut.push(timer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error..." });
  }
};

// summary query
export const handleSummaryQuery = async (req, res) => {
  const { query } = req.params;
  const { id } = req.body;

  if (!query) {
    return res.status(400).json({
      message: "Query required for this...",
    });
  }

  try {
    const userQuery = await Summary.findOne({ fileId: id });

    const summary = userQuery.parseToText;

    let userQueries = await userQueryQuestion(summary, query);

    return res.status(200).json({
      data: userQueries,
      message: "Query response...",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error...",
    });
  }
};

// fetch parsed summary text

export const fetchParsedSummary = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Summary id is required...",
    });
  }

  try {
    const getParsedSummary = await Summary.findOne({ fileId: id });

    if (!getParsedSummary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found...",
      });
    }

    return res.status(200).json({
      success: true,
      data: getParsedSummary,
    });
  } catch {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
