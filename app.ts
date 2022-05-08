import express, {Application} from 'express';
import connect from './dbConnect'
import apiRouter from './api/routes/Api'
import http from 'http'
import path from 'path';
const cors = require('cors')
const port : number = 5000
const app : Application = express();
app.use(cors());

const multer = require('multer')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server);

app.use(express.json())

const fileFilter = (req : any ,file : any, cb : any)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}
const storage = multer.diskStorage({
    destination: function(req : any, file : any, cb : any){
        cb(null, './uploads/')
    },
    filename: function(req : any, file : any, cb : any){
        cb(null,  req.params.name+ file.originalname.slice(file.originalname.lastIndexOf(".")))
    }
})

const upload = multer({storage: storage, limits: 
    {
        fileSize: 1024*1024*10
    },
    fileFilter : fileFilter
});
connect();

io.on('connection', (socket : any)=>{
    console.log("New WS Connnection!")
});

app.use('/api', apiRouter)

app.post('/pfp/:name', upload.single('pfp'), (req, res, next)=>{
    res.status(200).json({message : 'worked'})
});

app.use('/uploads', express.static(path.join(__dirname,'uploads')))

app.get('/uploads/:name', function(req, res) {
    res.sendFile(path.join(__dirname, 'uploads', req.params.name));
});

server.listen(port, ()=>{console.log(`Listening at  http://localhost:${port}`)});