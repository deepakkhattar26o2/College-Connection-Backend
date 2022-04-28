"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = __importDefault(require("./dbConnect"));
const Api_1 = __importDefault(require("./api/routes/Api"));
const cors = require('cors');
const port = 5000;
const app = (0, express_1.default)();
const multer = require('multer');
app.use(cors());
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        console.log(req.params);
        cb(null, 'adios');
    }
});
const upload = multer({ storage: storage, limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});
(0, dbConnect_1.default)();
app.use(express_1.default.json());
app.use('/api', Api_1.default);
app.post('/pfp/:name', upload.single('pfp'), (req, res, next) => {
    res.status(200).json({ message: 'worked' });
});
app.listen(port, () => { console.log(`Listening at  http://localhost:${port}`); });
