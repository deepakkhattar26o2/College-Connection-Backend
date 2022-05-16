"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = __importDefault(require("./dbConnect"));
const Api_1 = __importDefault(require("./api/routes/Api"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors = require("cors");
const port = 5000;
const app = (0, express_1.default)();
app.use(cors());
const upload_1 = __importDefault(require("./upload"));
const socketio = require("socket.io");
const server = http_1.default.createServer(app);
const io = socketio(server);
app.use(express_1.default.json());
(0, dbConnect_1.default)();
io.on("connection", (socket) => {
    console.log("New WS Connnection!");
});
app.use("/api", Api_1.default);
app.post("/pfp/:name", upload_1.default.single("pfp"), (req, res, next) => {
    res.status(200).json({ message: "worked" });
});
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.get("/pfp/:name", function (req, res) {
    const file_path = path_1.default.join(__dirname, "uploads", req.params.name);
    try {
        if (fs_1.default.existsSync(file_path + ".png")) {
            res.sendFile(file_path + ".png");
        }
        if (fs_1.default.existsSync(file_path + ".jpg")) {
            res.sendFile(file_path + ".jpg");
        }
        if (fs_1.default.existsSync(file_path + ".jpeg")) {
            res.sendFile(file_path + ".jpeg");
        }
    }
    catch (err) {
        console.error(err);
    }
});
server.listen(port, () => {
    console.log(`Listening at  http://localhost:${port}`);
});
exports.upload = upload_1.default;
