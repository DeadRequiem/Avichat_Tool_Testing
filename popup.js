const api = typeof browser !== 'undefined' ? browser : chrome;
const slider = document.getElementById('slider');
const toggle = document.getElementById('toggle');
const autoChk = document.getElementById('auto-enable');
const valueDisplay = document.getElementById('brightness-value');

const AVICHAT_URL = 'https://www.gaiaonline.com/avichat/';

function getAvichatTab(cb) {
    api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.url?.startsWith(AVICHAT_URL)) {
            cb(tab);
        } else {
            api.tabs.query({ url: AVICHAT_URL + '*' }, (aviTabs) => {
                cb(aviTabs[0] ?? null);
            });
        }
    });
}

function sendToContent(type, value) {
    getAvichatTab((tab) => {
        if (!tab) return;
        api.tabs.sendMessage(tab.id, { type, value }, () => {
            void api.runtime.lastError;
        });
    });
}

function saveState() {
    api.storage.local.set({
        brightness: parseInt(slider.value),
        enabled: toggle.checked,
        autoBrightness: autoChk.checked
    });
}

api.storage.local.get({ brightness: 100, enabled: true, autoBrightness: true }, (data) => {
    slider.value = data.brightness;
    valueDisplay.textContent = data.brightness + '%';
    toggle.checked = data.enabled;
    autoChk.checked = data.autoBrightness;
});

slider.addEventListener('input', () => {
    valueDisplay.textContent = slider.value + '%';
    saveState();
    if (toggle.checked) sendToContent('SET_BRIGHTNESS', parseInt(slider.value));
});

toggle.addEventListener('change', () => {
    saveState();
    sendToContent('SET_ENABLED', toggle.checked);
});

autoChk.addEventListener('change', () => {
    saveState();
});