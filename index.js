const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socekt) => {
    console.log('connected');
});

httpServer.listen(3000, () => {
    console.log('listening on port 3000');
});
