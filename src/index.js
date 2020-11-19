require('dotenv').config({ path: '/' });
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const getLocation = require('./utils/location');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

const message = 'Welcome to the Chat !';
io.on('connection', (socket) => {
	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username: username, room: room });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);
		socket.emit('message', generateMessage('Admin', `Welcome to ${user.room}`));
		socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} joined the room !`));
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);
		io.to(user.room).emit('message', generateMessage(user.username, message));
		callback('Message delivered');
	});

	socket.on('sendLocation', (location, callback) => {
		getLocation(location)
			.then((data) => {
				const user = getUser(socket.id);
				io.to(user.room).emit('location-message', generateLocationMessage(user.username, data));
				callback('Location shared');
			})
			.catch((err) => {
				console.log(err);
				callback('Not Shared due to network error');
			});
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('message', generateMessage('Admin', `${user.username} left the room`));
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
		}
	});
});

server.listen(PORT, () => console.log('server running on server 3000'));
