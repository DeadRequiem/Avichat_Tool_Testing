(function() {
    let skyTilemap = null;
    let brightness = 100;
    let enabled = true;

    function init() {
        try {
            const iframe = document.getElementById('game_container');
            if (!iframe) { setTimeout(init, 500); return; }
            const iframeWin = iframe.contentWindow;
            if (!iframeWin.GameBundle?.game_manager?.game?.scene?.scenes) { setTimeout(init, 500); return; }
            const gameScene = iframeWin.GameBundle.game_manager.game.scene.scenes.find(s => s.scene.key === 'GameScene');
            skyTilemap = gameScene?.children.list.find(c => c.type === 'TilemapLayer' && c.layer.name === 'BehindThePlayer/sky');
            if (!skyTilemap) { setTimeout(init, 500); return; }
            window.addEventListener('message', (e) => {
                if (e.source !== window) return;
                if (e.data.type === 'SET_BRIGHTNESS') { brightness = e.data.value; applyBrightness(); }
                if (e.data.type === 'SET_ENABLED') { enabled = e.data.value; applyBrightness(); }
            });

        } catch(e) { setTimeout(init, 500); }
    }

    function applyBrightness() {
        if (!skyTilemap) return;
        if (!enabled) { skyTilemap.setTint(0xffffff); return; }
        const tintValue = Math.floor((brightness / 100) * 255);
        const tint = (tintValue << 16) | (tintValue << 8) | tintValue;
        skyTilemap.setTint(tint);
    }

    init();
})();