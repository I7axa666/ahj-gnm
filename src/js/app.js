import TextMsg from './textMsg';

const chat = document.querySelector('.chat');

const textMsg = new TextMsg(chat);
textMsg.init();
