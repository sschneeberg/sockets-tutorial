const express = require('express');
const cors = require('cors');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*'
    }
});
const STATIC_CHANNELS = [
    { id: 1, name: 'channel 1', participants: 10 },
    { id: 2, name: 'channel 2', participants: 3 }
];

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
    socket.on('channel-join', (id) => {
        console.log('channel join: ', id);
        STATIC_CHANNELS.forEach((c) => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == -1) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != -1) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', (message) => {
        io.emit('message', message);
    });
});

httpServer.listen(8000, () => {
    console.log('listening on port 8000');
});
