const fetch = require('node-fetch');

const getLocation = (location) => {
	const latitude = location.latitude;
	const longitude = location.longitude;
	return new Promise((resolve, reject) => {
		fetch(
			`http://api.positionstack.com/v1/reverse?access_key=f63bd22e618bbf7f783f1c61b11468e4&query=${latitude},${longitude}&limit=1`
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(typeof data);
				if (!data) {
					reject('Network Issue');
				} else {
					const messageObject = {
						location: data.data[0].locality,
						link: `http://google.com/maps?q=${latitude},${longitude}`
					};
					resolve(messageObject);
				}
			});
	});
};

module.exports = getLocation;
