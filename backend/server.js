const express = require("express")
const https = require("https")
const app = express()
const cors = require("cors")
const server = https.createServer(app)
app.use(cors({
    origin: "*"
}))

app.get("/", (req, res) => {
    res.send("Server is running")
})
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})

server.listen(8080, () => console.log("server is running on port 5000"))