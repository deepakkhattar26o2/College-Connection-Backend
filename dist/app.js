"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = __importDefault(require("./dbConnect"));
const Api_1 = __importDefault(require("./api/routes/Api"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors = require('cors');
const port = 5000;
const app = (0, express_1.default)();
app.use(cors());
const multer = require('multer');
const socketio = require('socket.io');
const server = http_1.default.createServer(app);
const io = socketio(server);
app.use(express_1.default.json());
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
        cb(null, req.params.name + file.originalname.slice(file.originalname.lastIndexOf(".")));
    }
});
const upload = multer({ storage: storage, limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});
(0, dbConnect_1.default)();
io.on('connection', (socket) => {
    console.log("New WS Connnection!");
});
app.use('/api', Api_1.default);
app.post('/pfp/:name', upload.single('pfp'), (req, res, next) => {
    res.status(200).json({ message: 'worked' });
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.get('/uploads/:name', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'uploads', req.params.name));
});
server.listen(port, () => { console.log(`Listening at  http://localhost:${port}`); });
