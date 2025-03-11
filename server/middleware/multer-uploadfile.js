import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("G:", "uploads", "temp");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, _f, cb) => {
    cb(null, uploadPath);
  },
  filename: function (_, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // const { userid } = req.users;
  // if(!userid) return;
  const allowedTypes = /.pdf|.docx|.txt/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only .pdf, .txt .docs files are allowed!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
  dest: "./uploads/temp",
});

export { upload };
