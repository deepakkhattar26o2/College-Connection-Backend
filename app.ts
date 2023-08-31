import express, { Application } from "express";
import connect from "./dbConnect";
import apiRouter from "./api/routes/Api";
import fs from "fs";
import http from "http";
import path from "path";
const cors = require("cors");
const port: number = 5000;
const app: Application = express();
app.use(cors());
import upload from "./upload";
import {Server} from 'socket.io'
const server = http.createServer(app);

app.use(express.json());
connect();

const io :any= new Server(server, 
  {
  cors : {
    origin : "*",
    methods : "*"
  }
}
)

io.on("connection", (socket: any) => {
  console.log(socket.id);

  socket.on("join_room", (data: any)=>{
    socket.join(data);
  })


  socket.on('disconnect', ()=>{
    console.log("USER DISCONNECTED", socket.id)
  })
});

app.use("/api", apiRouter);

app.post("/pfp/:name", upload.single("pfp"), (req, res, next) => {
  res.status(200).json({ message: "worked" });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/pfp/:name", function (req, res) {
  const file_path = path.join(__dirname, "uploads", req.params.name);
  const default_img = path.join(__dirname, "uploads", 'default.jpg');
  try {
    if (fs.existsSync(file_path + ".png")) {
      return res.sendFile(file_path + ".png");
    }
    if (fs.existsSync(file_path + ".jpg")) {
      return res.sendFile(file_path + ".jpg");
    }
    if (fs.existsSync(file_path + ".jpeg")) {
      return res.sendFile(file_path + ".jpeg");
    }
    res.sendFile(default_img)
  } catch (err) {
    console.error(err);
  }
});

server.listen(port, () => {
  console.log(`Listening at  http://localhost:${port}`);
});

exports.upload = upload;