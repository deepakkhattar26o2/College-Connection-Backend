import express, {Application, Request, Response} from 'express';
import connect from './dbConnect'

const cors = require('cors')
const port : number = 5000
const app : Application = express();

app.use(cors());
connect();

app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({message: "It worked"})
})

app.listen(port, ()=>{console.log(`Listening at  http://localhost:${port}`)});