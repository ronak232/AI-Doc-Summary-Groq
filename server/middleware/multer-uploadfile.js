import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("G:", "uploads", "temp");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Function to delete a file from the server
// This function will be called after the file is processed
// and the timer expires
export const deleteFile = (file) => {
  fs.unlink(uploadPath + file, (err) => {
    if (err) return err;
  });
};

// Function to calculate time remaining until a given date
export const time_remaining = (date_provided) =>
  new Date(date_provided) - new Date();

const storage = multer.diskStorage({
  destination: (_, _f, cb) => {
    cb(null, uploadPath);
  },
  filename: function (_, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const fileFilter = (_, file, cb) => {
  
  var ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" || ext === ".txt" || ext === ".docx" || ext === ".mp3" || ext === ".wav") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export { upload };