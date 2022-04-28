import express, {Application} from 'express';
import connect from './dbConnect'
import apiRouter from './api/routes/Api'
const cors = require('cors')
const port : number = 5000
const app : Application = express();
const multer = require('multer')
app.use(cors());
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
        console.log(req.params)
        cb(null, 'adios')
    }
})

const upload = multer({storage: storage, limits: 
    {
        fileSize: 1024*1024*10
    },
    fileFilter : fileFilter
});
connect();
app.use(express.json())
app.use('/api', apiRouter)
app.post('/pfp/:name', upload.single('pfp'), (req, res, next)=>{
    res.status(200).json({message : 'worked'})
});
app.listen(port, ()=>{console.log(`Listening at  http://localhost:${port}`)});