require('dotenv').config()
const express = require('express')
const app = express()
const ConnectedToMongo =  require('./db')
ConnectedToMongo();

const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/',(req,res)=>{
    res.send(' i am from express')
})


app.listen(process.env.PORT,()=>{
    console.log(`server is runing on port ${process.env.PORT}`)
})