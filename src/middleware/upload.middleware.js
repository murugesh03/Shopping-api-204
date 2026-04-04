const multer = require("multer");
const path = require("path");
const fs = reqire("fs");
const uploadPath = path.join(__dirname,'../uploads')
if(!fs.existsSync(uploadPath)){
 fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 10 } //10GB
});
module.exports = upload;
