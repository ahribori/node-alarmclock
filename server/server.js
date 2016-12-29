const express = require('express');
const app = express();
const PORT = 3000;

import Alarm from './alarm';

let alarm = new Alarm();

app.get('/', (req, res) => {

	res.json('Test Server!!');
});

app.get('/alarm/play', function (req, res) {
	alarm.play();
	res.send('play!');
});

app.get('/alarm/stop', function (req, res) {
	alarm.stop();
	res.send('stop!');
});

app.get('/alarm/pause', function (req, res) {
	alarm.delay(10);
	res.send('pause!');
});



app.listen(PORT, () => {
	console.log('Test server listening on PORT 3000!');
});

