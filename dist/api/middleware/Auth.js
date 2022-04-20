"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.default = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.myKey);
        req.userData = decoded;
        next();
    }
    catch (err) {
        return res.status(409).json({ Message: 'Auth Failed!' });
    }
};
