const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socket = require('./Socket')(io);
const port = 5000;
http.listen(port, () => console.log("Server running on "+port));