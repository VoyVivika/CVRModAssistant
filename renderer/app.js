// ─────────────────────────────────────────────────────────────────────────────
// app.js — Main renderer orchestrator
// Handles startup flow, navigation, and app-level state
// ─────────────────────────────────────────────────────────────────────────────

window.App = (() => {
    let appState = {
        page: 'mods',
        installDir: null,
        storeType: null,
        appVersion: null,
        settings: {},
    };

    // ── Startup ───────────────────────────────────────────────────────────────
    async function start() {
        // Load settings
        appState.settings = await window.cvrma.loadSettings();
        appState.appVersion = await window.cvrma.getAppVersion();

        // Wire titlebar window controls
        document.getElementById('btn-minimize').addEventListener('click', () => window.cvrma.minimize());
        document.getElementById('btn-maximize').addEventListener('click', () => window.cvrma.maximize());
        document.getElementById('btn-close').addEventListener('click', () => window.cvrma.close());

        // Listen for status pushes from main process (e.g., during download)
        window.cvrma.onStatusUpdate(data => {
            const el = document.getElementById('status-text');
            if (el) el.textContent = data.text;
            if (data.progress !== undefined) setProgress(data.progress);
        });

        // Check terms acceptance
        if (!appState.settings.termsAccepted) {
            showIntro();
        } else {
            enterApp();
        }
    }

    // ── Intro flow ────────────────────────────────────────────────────────────
    function showIntro() {
        hideShell();
        window.IntroPage.render();
    }

    async function enterApp() {
        // Detect install dir
        const detected = await window.cvrma.detectInstallDir();
        if (detected) {
            appState.installDir = detected.dir;
            appState.storeType = detected.store;
        }

        showShell();
        updateVersionDisplay();
        updateInstallDirLabel();
        navigateTo('mods');
    }

    function setInstallDir(dir, store) {
        appState.installDir = dir;
        appState.storeType = store;
        updateInstallDirLabel();
    }

    // ── Shell visibility ──────────────────────────────────────────────────────
    function hideShell() {
        const navRail = document.getElementById('nav-rail');
        const topbar = document.getElementById('topbar');
        const statusbar = document.getElementById('statusbar');
        if (navRail) navRail.style.display = 'none';
        if (topbar) topbar.style.display = 'none';
        if (statusbar) statusbar.style.display = 'none';
    }

    function showShell() {
        const navRail = document.getElementById('nav-rail');
        const topbar = document.getElementById('topbar');
        const statusbar = document.getElementById('statusbar');
        if (navRail) navRail.style.display = '';
        if (topbar) topbar.style.display = '';
        if (statusbar) statusbar.style.display = '';
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    function navigateTo(page) {
        appState.page = page;

        // Update nav rail active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });

        // Show/hide topbar search + install (only on Mods page)
        const topbarLeft = document.getElementById('topbar-left');
        const topbarRight = document.getElementById('topbar-right');
        if (topbarLeft && topbarRight) {
            topbarLeft.style.visibility  = page === 'mods' ? 'visible' : 'hidden';
            topbarRight.style.visibility = page === 'mods' ? 'visible' : 'hidden';
        }

        // Hide preset bar when not on mods
        const presetBar = document.getElementById('preset-bar');
        if (presetBar) presetBar.style.display = page === 'mods' ? '' : 'none';

        // Clear search on page switch
        const searchInput = document.getElementById('search-input');
        if (searchInput && page !== 'mods') searchInput.value = '';

        // Clear page content
        const content = document.getElementById('page-content');
        content.innerHTML = '';

        // Render target page
        switch (page) {
            case 'mods':
                window.ModsPage.init(appState.installDir);
                break;
            case 'options':
                window.OptionsPage.render(appState.installDir, appState.storeType);
                break;
            case 'about':
                window.AboutPage.render(appState.appVersion);
                break;
        }
    }

    // ── UI helpers ────────────────────────────────────────────────────────────
    function updateVersionDisplay() {
        const el = document.getElementById('app-version-nav');
        if (el) el.textContent = appState.appVersion || '—';
    }

    function updateInstallDirLabel() {
        const el = document.getElementById('install-dir-label');
        if (!el) return;
        if (appState.installDir) {
            el.textContent = appState.installDir;
            el.title = appState.installDir;
        } else {
            el.textContent = 'No install dir';
        }
    }

    function setProgress(val) {
        const bar = document.getElementById('progress-bar');
        if (!bar) return;
        bar.style.width = `${Math.round(val * 100)}%`;
    }

    // ── Nav rail wiring ───────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => navigateTo(btn.dataset.page));
        });
        start();
    });

    return {
        enterApp,
        navigateTo,
        setInstallDir,
    };
})();
