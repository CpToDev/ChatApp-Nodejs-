const users = [];

//addUser removeUser getUser getUserInRoom

//addUser
const addUser = ({ id, username, room }) => {
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	if (!username || !room) {
		return {
			error: 'Username and password invalid'
		};
	}
	const isExisting = users.find((user) => {
		return user.username === username && user.room === room;
	});

	if (isExisting) {
		return {
			error: 'Username already in use'
		};
	}
	const user = { id, username, room };
	users.push(user);
	return { user };
};

//remove user
const removeUser = (id) => {
	const index = users.findIndex((user) => {
		return user.id === id;
	});

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

//getUserby Id
const getUser = (id) => {
	const user = users.find((user) => {
		return user.id === id;
	});
	return user;
};

//get users by room
const getUsersInRoom = (room) => {
	room = room.trim().toLowerCase();
	return users.filter((user) => {
		return user.room === room;
	});
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
};
