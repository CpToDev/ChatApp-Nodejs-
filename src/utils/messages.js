const generateMessage = (username, text) => {
	return {
		text,
		createdAt: new Date().getTime(),
		username
	};
};

const generateLocationMessage = (username, data) => {
	return {
		link: data.link,
		location: data.location,
		createdAt: new Date().getTime(),
		username
	};
};

module.exports = {
	generateMessage,
	generateLocationMessage
};
