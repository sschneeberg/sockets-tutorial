const express = require('express');
const cors = require('cors');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*'
    }
});
const STATIC_CHANNELS = ['notifcations', 'chat'];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    res.json({ msg: 'hello' });
});

app.get('/get-channels', (req, res) => {
    res.json({ channels: STATIC_CHANNELS });
});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
    // socket.on('chat message', (msg) => {
    //     console.log('msg:', msg);
    //     io.emit('chat message', msg);
    // });

    //only to the client that connected to this socket
    socket.emit('connection', null);
});

httpServer.listen(8000, () => {
    console.log('listening on port 8000');
});
