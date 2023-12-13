const mongoose = require('mongoose')
const express = require('express');
const cors=require('cors');
const { MONGOOSE_URL, PORT } = require('./utiles/config');
const UserRouter = require('./routes/UserRouter');

const app = express();
app.use(cors())
app.use(express.json())
app.use('/user',UserRouter)

mongoose.connect(MONGOOSE_URL)
    .then(
        console.log('connecting to mongoose database')
)
    .catch(e => {
        console.log('mongoose connecting error',e)
    })

app.listen(PORT, (req, res) => {
        console.log(`server is running at http://localhost:${PORT}`)
    })