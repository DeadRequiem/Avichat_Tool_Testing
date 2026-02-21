const api = typeof browser !== 'undefined' ? browser : chrome;

api.storage.local.get({ brightness: 100, enabled: true, autoBrightness: true }, (data) => {
    const script = document.createElement('script');
    script.src = api.runtime.getURL('inject.js');
    script.dataset.brightness = data.brightness;
    script.dataset.enabled = data.enabled;
    script.dataset.autoBrightness = data.autoBrightness;
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
});

api.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_BRIGHTNESS' || msg.type === 'SET_ENABLED') {
        window.postMessage(msg, '*');
    }
});