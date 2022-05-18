import fs from "fs";
const multer = require("multer");

const fileFilter = (req: any, file: any, cb: any) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, "./uploads/");
    },
    filename: function (req: any, file: any, cb: any) {
      cb(
        null,
        req.params.name +'.jpg'
          // file.originalname.slice(file.originalname.lastIndexOf("."))
      );
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter,
  });

  export default upload