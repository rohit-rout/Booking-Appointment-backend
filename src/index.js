import express from "express";
import slotRoutes from "./routes/slots.js";
const app = express()
const port = 3000

app.use('/slots', slotRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})