(function () {
    const el = document.currentScript;
    const saved = el
        ? {
            brightness: parseInt(el.dataset.brightness ?? '100'),
            enabled: el.dataset.enabled !== 'false',
            autoBrightness: el.dataset.autoBrightness !== 'false'
          }
        : { brightness: 100, enabled: true, autoBrightness: true };

    let skyTilemap = null;
    let brightness = saved.brightness;
    let enabled = saved.enabled;

    const pending = [];
    let ready = false;

    window.addEventListener('message', (e) => {
        if (e.source !== window) return;
        if (e.data.type === 'SET_BRIGHTNESS' || e.data.type === 'SET_ENABLED') {
            if (ready) {
                apply(e.data);
            } else {
                pending.push(e.data);
            }
        }
    });

    function apply(msg) {
        if (msg.type === 'SET_BRIGHTNESS') brightness = msg.value;
        if (msg.type === 'SET_ENABLED') enabled = msg.value;
        applyBrightness();
    }

    function applyBrightness() {
        if (!skyTilemap) return;
        if (!enabled) {
            skyTilemap.setTint(0xffffff);
            return;
        }
        const v = Math.floor((brightness / 100) * 255);
        skyTilemap.setTint((v << 16) | (v << 8) | v);
    }

    function init() {
        try {
            const iframe = document.getElementById('game_container');
            if (!iframe) { setTimeout(init, 500); return; }
            const iframeWin = iframe.contentWindow;
            if (!iframeWin.GameBundle?.game_manager?.game?.scene?.scenes) { setTimeout(init, 500); return; }
            const gameScene = iframeWin.GameBundle.game_manager.game.scene.scenes
                .find(s => s.scene.key === 'GameScene');
            skyTilemap = gameScene?.children.list
                .find(c => c.type === 'TilemapLayer' && c.layer.name === 'BehindThePlayer/sky');
            if (!skyTilemap) { setTimeout(init, 500); return; }
            if (saved.enabled && saved.autoBrightness) applyBrightness();

            ready = true;
            pending.forEach(apply);
            pending.length = 0;
        } catch (e) {
            setTimeout(init, 500);
        }
    }

    init();
})();