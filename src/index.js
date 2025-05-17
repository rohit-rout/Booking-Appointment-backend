import express from "express";
import slotRoutes from "./routes/slots.js";
import config from 'config';

const port = config.get('port')
const app = express()


app.use('/slots', slotRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})