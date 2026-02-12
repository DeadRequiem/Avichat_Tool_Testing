const api = typeof browser !== 'undefined' ? browser : chrome;
const slider = document.getElementById('slider');
const toggle = document.getElementById('toggle');
const valueDisplay = document.getElementById('brightness-value');

function sendToContent(type, value) {
    api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        api.tabs.sendMessage(tabs[0].id, { type, value }, () => {
            void api.runtime.lastError;
        });
    });
}

slider.addEventListener('input', () => {
    valueDisplay.textContent = slider.value + '%';
    sendToContent('SET_BRIGHTNESS', parseInt(slider.value));
});

toggle.addEventListener('change', () => {
    sendToContent('SET_ENABLED', toggle.checked);
});