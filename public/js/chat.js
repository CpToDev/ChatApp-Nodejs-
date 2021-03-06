const socket = io();

//element
const $messageForm = document.querySelector('#form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById('share-location');
const $message = document.querySelector('.message');
const $locationMessage = document.getElementById('location-message');

//template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options

const { username, room } = Qs.parse(location.search.substring(1));

$messageForm.addEventListener('submit', (event) => {
	//disable
	const message = $messageFormInput.value;
	$messageFormButton.disabled = true;
	socket.emit('sendMessage', message, (prop) => {
		//enable

		$messageFormButton.disabled = false;
		$messageFormInput.value = '';
		$messageFormInput.focus();
		if (prop) console.log('Message Not delivered due to ', prop);
		else console.log('Message was delivered');
	});
	event.preventDefault();
});
$sendLocationButton.addEventListener('click', (event) => {
	$sendLocationButton.disabled = true;
	window.navigator.geolocation.getCurrentPosition((position) => {
		const location = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};

		socket.emit('sendLocation', location, (message) => {
			$sendLocationButton.disabled = false;
			console.log(message);
		});
	});
});

////////////////////////////////////////////////////

socket.on('message', (message) => {
	var rendered = Mustache.render(messageTemplate, {
		text: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
		username: message.username
	});

	$message.insertAdjacentHTML('beforeend', rendered);
	console.log(message);
});

socket.on('location-message', (messageObj) => {
	var rendered = Mustache.render(locationTemplate, {
		createdAt: moment(message.createdAt).format('h:mm a'),
		link: messageObj.link,
		location: messageObj.location,
		username: messageObj.username
	});

	$message.insertAdjacentHTML('beforeend', rendered);
	console.log(messageObj.location);
	console.log(messageObj.link);
});

socket.on('roomData', ({ room, users }) => {
	var rendered = Mustache.render(sidebarTemplate, {
		room: room,
		users: users
	});

	document.querySelector('#sidebar').innerHTML = rendered;
});

/////////////////////////////////////////////////////////////////////
socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});
