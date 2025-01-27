// require your server and launch it here
const express = require('express')
//const cors = require('cors')
const postsRouter = require('./api/server.js')

const port = 9000

const server = express()
server.use(express.json())
//server.use(cors())

server.use('/', postsRouter)

server.listen(port,()=>{
    console.log(`Server is listening on ${port}`)
})