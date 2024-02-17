const express = require('express')
const connectToMongo = require('./db');
const path = require ('path')

connectToMongo();
const app = express()
var cors = require('cors')

//CODE FOR .env include
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

app.use(cors())

const PORT = process.env.PORT || 10000

app.use(express.json())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

//for add frountend bulid folder
app.use(express.static(path.join(__dirname, './client/build')))
app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`iNotebook listening at http://localhost:${PORT}`)
})