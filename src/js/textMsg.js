import currentDay from './currentDate';
import validate from './validate';

export default class TextMsg {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.chatWindow = parentElement.querySelector('.messages');
    this.input = parentElement.querySelector('.input-message');
    this.saveRecBtn = document.querySelector('.btn-save');
    this.cancleRecBtn = document.querySelector('.btn-cancle');
    this.videoStream = document.querySelector('.video-stream');
    this.audioStream = document.querySelector('.audio-stream');
    this.timer = document.querySelector('.timer');
    this.timerFunc = this.timerFunc.bind(this);
    this.saveRec = this.saveRec.bind(this);
    this.showBtn = this.showBtn.bind(this);
    this.blob = null;
    this.sec = 0;
    this.min = 0;
    this.counter = null;
    this.action = null;
  }

  init() {
    this.audioBtn = this.parentElement.querySelector('.audio-btn');
    this.videoBtn = this.parentElement.querySelector('.video-btn');

    this.audioBtn.addEventListener('click', this.audioRec);
    this.videoBtn.addEventListener('click', this.videoRec);

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.action = null;
        const newMsg = this.newMsg(this.input.value);
        this.chatWindow.append(newMsg);
        this.input.value = '';
        this.chatWindow.lastElementChild.scrollIntoView();
      }
    });
  }

  newMsg = (item) => {
    const divMsg = document.createElement('div');
    const divInfo = document.createElement('div');
    const spanDate = document.createElement('span');
    const spanGeo = document.createElement('span');

    divMsg.classList.add('message');
    divInfo.classList.add('info');
    spanDate.classList.add('date');
    spanGeo.classList.add('geo');

    spanDate.textContent = currentDay();

    if (this.action === 'audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = URL.createObjectURL(item);
      divInfo.appendChild(audio);
    } else if (this.action === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.src = URL.createObjectURL(item);
      divInfo.appendChild(video);
    } else {
      const p = document.createElement('p');
      p.textContent = item;
      divInfo.appendChild(p);
    }

    divInfo.appendChild(spanDate);

    divMsg.appendChild(divInfo);
    divMsg.appendChild(spanGeo);
    this.spanGeo = spanGeo;

    this.geo(spanGeo);

    return divMsg;
  };

  geo(element) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        const { latitude, longitude } = data.coords;
        const lat = Math.round(latitude * 10000);
        const lon = Math.round(longitude * 10000);
        element.textContent = `[${lat / 10000}, ${lon / 10000}]`;
      }, () => {
        const popup = document.querySelector('.popup-container');
        popup.classList.toggle('hidden');
        const cancelBtn = popup.querySelector('.cancel-btn');
        const actionBtn = popup.querySelector('.action-btn');

        cancelBtn.addEventListener('click', this.popupClose);
        actionBtn.addEventListener('click', this.sendCords);
      });
    }
  }

  popupClose = () => {
    document.getElementById('name-field').value = '';
    if (!document.querySelector('.error-validation').classList.contains('hidden')) {
      document.querySelector('.error-validation').classList.add('hidden');
    }
    document.querySelector('.popup-container').classList.toggle('hidden');
  };

  sendCords = () => {
    const coords = document.getElementById('name-field').value;

    if (!validate(coords)) {
      document.querySelector('.error-validation').classList.remove('hidden');
      return;
    }

    this.spanGeo.textContent = coords;

    if (!document.querySelector('.error-validation').classList.contains('hidden')) {
      document.querySelector('.error-validation').classList.add('hidden');
    }

    document.getElementById('name-field').value = '';
    document.querySelector('.popup-container').classList.toggle('hidden');
  };

  audioRec = async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch {
        alert('Необходимо разрешение для использования камеры');
        return;
      }
      this.action = 'audio';
      // debugger
      this.showBtn();
  
      this.audioStream.srcObject = this.stream;
  
      this.audioStream.addEventListener('canplay', this.audioPlay);
  
      this.recorder = new MediaRecorder(this.stream);
      const chunks = [];
  
      this.recorder.start();
  
      this.recorder.addEventListener('dataavailable', (ev) => {
        chunks.push(ev.data);
      });
  
      this.recorder.addEventListener('stop', () => {
        this.blob = new Blob(chunks);
      });
  
      this.saveRecBtn.addEventListener('click', this.saveRec);
  
      this.cancleRecBtn.addEventListener('click', this.cancleRec);
  };

  videoRec = async () => {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch {
      alert('Необходимо разрешение для использования камеры');
      return;
    }

    this.action = 'video';

    this.showBtn();

    this.videoStream.srcObject = this.stream;

    this.videoStream.addEventListener('canplay', this.videoPlay);

    this.recorder = new MediaRecorder(this.stream);
    const chunks = [];

    this.recorder.start();

    this.recorder.addEventListener('dataavailable', (ev) => {
      chunks.push(ev.data);
    });

    this.recorder.addEventListener('stop', () => {
      this.blob = new Blob(chunks);
    });

    this.saveRecBtn.addEventListener('click', this.saveRec);

    this.cancleRecBtn.addEventListener('click', this.cancleRec);
  };

  showBtn() {
    this.timer.textContent = '00:00';
    if (this.timer.classList.contains('hidden')) {
      this.counter = setInterval(this.timerFunc, 1000);
    } else {
      clearInterval(this.counter);
      this.counter = null;
      this.sec = 0;
      this.min = 0;
    }

    if(this.action === 'audio') {
      this.audioStream.classList.toggle('hidden');
    } else {
      this.videoStream.classList.toggle('hidden');
    } 

    this.videoBtn.classList.toggle('hidden');
    this.audioBtn.classList.toggle('hidden');

    this.saveRecBtn.classList.toggle('hidden');
    this.cancleRecBtn.classList.toggle('hidden');
    this.timer.classList.toggle('hidden');
  }

  saveRec() {
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());

    setTimeout(() => {
      const newMsg = this.newMsg(this.blob);

      this.blob = null;
      this.chatWindow.append(newMsg);
      this.chatWindow.lastElementChild.scrollIntoView();
      this.showBtn();
      this.videoStream.removeEventListener('canplay', this.videoPlay);
    }, 0);

    this.saveRecBtn.removeEventListener('click', this.saveRec);
    this.recorder = null;
    this.stream = null;
  }

  cancleRec = () => {
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
    this.blob = null;
    this.showBtn();
    this.recorder = null;
    this.stream = null;
    this.cancleRecBtn.removeEventListener('click', this.cancleRec);
    this.videoStream.removeEventListener('canplay', this.videoPlay);
  };

  timerFunc = () => {
    this.sec += 1;
    if (this.sec === 60) {
      this.min += 1;
      this.sec = 0;
    }
    this.timer.textContent = `${(`0${this.min}`).slice(-2)}:${(`0${this.sec}`).slice(-2)}`;
  };

  videoPlay = () => {
    this.videoStream.play();
    this.videoStream.muted = true;
  };

  audioPlay = () => {
    this.audioStream.play();
    this.audioStream.muted = true;
  };
}
