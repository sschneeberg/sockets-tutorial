const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('msg:', msg);
        io.emit('chat message', msg);
    });
});

httpServer.listen(3000, () => {
    console.log('listening on port 3000');
});
