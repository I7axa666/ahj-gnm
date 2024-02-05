import currentDay from './currentDate';
import validate from './validate';

export default class TextMsg {
  constructor(parentElement) {
    this.chatWindow = parentElement.querySelector('.messages');
    this.input = parentElement.querySelector('.input-message');
  }

  init() {
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newMsg = this.newMsg(this.input.value);
        this.chatWindow.append(newMsg);
        this.input.value = '';
        this.chatWindow.lastElementChild.scrollIntoView();
      }
    });
  }

  newMsg = (text) => {
    const divMsg = document.createElement('div');
    const divInfo = document.createElement('div');
    const p = document.createElement('p');
    const spanDate = document.createElement('span');
    const spanGeo = document.createElement('span');

    divMsg.classList.add('message');
    divInfo.classList.add('info');
    spanDate.classList.add('date');
    spanGeo.classList.add('geo');

    spanDate.textContent = currentDay();
    p.textContent = text;

    divInfo.appendChild(p);
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
}
