const api = typeof browser !== 'undefined' ? browser : chrome;
console.log('Brightness content script loaded');
const script = document.createElement('script');
script.src = api.runtime.getURL('inject.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);
api.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_BRIGHTNESS' || msg.type === 'SET_ENABLED') {
        window.postMessage(msg, '*');
    }
});