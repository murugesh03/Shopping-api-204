const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2, files: 5 }
});
module.exports = upload;
