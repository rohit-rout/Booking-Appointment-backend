import express from "express";
import slotRoutes from "./routes/slots.js";
import config from 'config';
import cors from 'cors';
const port = config.get('port')
const app = express()


app.use(cors());
app.use(express.json());

app.use('/api', slotRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})