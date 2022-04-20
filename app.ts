import express, {Application} from 'express';
import connect from './dbConnect'
import apiRouter from './api/routes/Api'
const cors = require('cors')
const port : number = 5000
const app : Application = express();

app.use(cors());
connect();
app.use(express.json())
app.use('/api', apiRouter)

app.listen(port, ()=>{console.log(`Listening at  http://localhost:${port}`)});