require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const getLocation = require('./Location');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

const message = 'Welcome to the Chat !';
io.on('connection', (socket) => {
	socket.emit('message', generateMessage('Welcome!'));
	socket.broadcast.emit('message', generateMessage('A new user joined'));
	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter();
		if (filter.isProfane(message)) {
			return callback('Porfane text not delivered');
		}

		io.emit('message', generateMessage(message));
		callback('Message delivered');
	});
	socket.on('disconnect', () => {
		io.emit('message', generateMessage('A user has been disconnected'));
	});
	socket.on('sendLocation', (location, callback) => {
		getLocation(location)
			.then((data) => {
				io.emit('location-message', generateLocationMessage(data));
				callback('Location shared');
			})
			.catch((err) => {
				console.log(err);
				callback('Not Shared due to network error');
			});
	});
});

server.listen(PORT, () => console.log('server running on server 3000'));
