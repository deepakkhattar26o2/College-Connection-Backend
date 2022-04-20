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
app.use(cors());
(0, dbConnect_1.default)();
app.use(express_1.default.json());
app.use('/api', Api_1.default);
app.listen(port, () => { console.log(`Listening at  http://localhost:${port}`); });
