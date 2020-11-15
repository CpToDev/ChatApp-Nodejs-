const generateMessage = (text) => {
	return {
		text,
		createdAt: new Date().getTime()
	};
};

const generateLocationMessage = (data) => {
	return {
		link: data.link,
		location: data.location,
		createdAt: new Date().getTime()
	};
};

module.exports = {
	generateMessage,
	generateLocationMessage
};
