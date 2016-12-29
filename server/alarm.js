import Speaker from 'speaker';
import Lame from 'lame';
import Volume from 'pcm-volume';
import FS from 'fs';

export default class Alarm {

	constructor() {
		this.setMp3 = this.setMp3.bind(this);
		this.setTime = this.setTime.bind(this);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.delay = this.delay.bind(this);
		this.setVolume = this.setVolume.bind(this);

		this.setMp3('./musics/alarm.mp3');
		this.idle();
	}

	setMp3(mp3) {
		this._mp3 = mp3;
	}

	setTime(time) {
		console.log('setTime', time);
	}

	idle() {
		this.readable = FS.createReadStream(this._mp3);

		this.decoder = new Lame.Decoder({
			channels: 2,
			bitDepth: 16,
			sampleRate: 44100,
			bitRate: 320,
			outSampleRate: 22050,
			mode: Lame.STEREO
		});

		this.speaker = new Speaker();
		this.volume = new Volume();

		this.speaker.on('open', function () {
			console.log('speaker is opened.', new Date());
			this.state = 'START';
		});

		this.speaker.on('flush', function () {
			console.log('speaker is flushed.', new Date());
		});

		this.speaker.on('close', function () {
			console.log('speaker is closed.', new Date());
			this.state = 'STOP';
		});

		this.state = 'READY';
	}

	play() {
		if (this.state !== 'PLAY') {
			this.idle();
			this.volume.pipe(this.speaker); // pipe volume to speaker
			this.decoder.pipe(this.volume); // pipe PCM data to volume
			this.readable.pipe(this.decoder); // pipe file input to decoder
			this.state = 'PLAY';
			console.log(this.state, new Date());
		}
	}

	stop() {
		if (this.state !== 'STOP') {
			this.speaker.close();
			this.state = 'STOP';
			console.log(this.state, new Date());
		}
	}

	delay(timeout) {
		if (this.state === 'PLAY') {
			this.stop();
			setTimeout(() => {
				this.play();
			}, timeout * 1000);
			this.state = 'WAIT';
			console.log(this.state, new Date());
		}
	}

	setVolume(volume) {
		if (this.state === 'PLAY') {
			console.log('set volume to ' + volume);
			this.volume.setVolume(volume);
		}
	}

}