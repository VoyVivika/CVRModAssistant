window.OptionsPage = (() => {
    async function render(installDir, storeType) {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="options-page fade-in">
                <!-- Install Directory -->
                <div class="options-section">
                    <div class="options-section-title">Installation</div>

                    <div class="options-row">
                        <span class="options-label">CVR Directory</span>
                        <div class="dir-display" id="dir-display" title="${escHtml(installDir || '')}">
                            ${escHtml(installDir || 'Not detected')}
                        </div>
                    </div>

                    <div class="options-row" style="gap:8px;margin-left:120px;">
                        <button class="btn-ghost" id="opt-select-dir">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            Select Folder
                        </button>
                        <button class="btn-ghost" id="opt-open-dir" ${!installDir ? 'disabled' : ''}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Open Folder
                        </button>
                    </div>

                    <div class="options-row">
                        <span class="options-label">Store</span>
                        <span style="font-size:12px;color:var(--text-2);">${escHtml(storeType || 'Unknown')}</span>
                    </div>
                </div>

                <!-- MelonLoader Status -->
                <div class="options-section">
                    <div class="options-section-title">MelonLoader</div>
                    <div class="ml-status-row">
                        <div class="ml-status-dot" id="ml-dot"></div>
                        <span class="ml-status-text" id="ml-status-text">Checking…</span>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:4px;">
                        <button class="btn-ghost" id="opt-install-ml" ${!installDir ? 'disabled' : ''}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Install / Update ML
                        </button>
                        <button class="btn-danger" id="opt-remove-ml" ${!installDir ? 'disabled' : ''}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            </svg>
                            Remove ML
                        </button>
                    </div>
                </div>

                <!-- Mods -->
                <div class="options-section">
                    <div class="options-section-title">Mods</div>
                    <div class="options-row">
                        <input type="checkbox" id="opt-hide-broken" class="custom-checkbox" />
                        <label for="opt-hide-broken" class="options-label" style="min-width:unset;cursor:pointer;">Hide broken / retired mods</label>
                    </div>
                </div>

                <!-- Presets -->
                <div class="options-section">
                    <div class="options-section-title">Presets</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button class="btn-ghost" id="opt-export-presets">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Export Presets
                        </button>
                        <button class="btn-ghost" id="opt-import-presets">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Import Presets
                        </button>
                    </div>
                </div>

                <!-- Diagnostics / Danger Zone -->
                <div class="options-section">
                    <div class="options-section-title">Diagnostics</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                        <button class="btn-ghost" id="opt-open-appdata">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                            </svg>
                            Open App Data
                        </button>
                    </div>

                    <div class="danger-zone">
                        <div class="danger-zone-title">Destructive Actions</div>
                        <div class="danger-actions">
                            <button class="btn-danger" id="opt-remove-all-mods" ${!installDir ? 'disabled' : ''}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6m4-6v6" stroke-linecap="round"/>
                                </svg>
                                Remove All Mods
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (installDir) {
            window.cvrma.melonLoaderStatus(installDir).then(r => {
                const dot = document.getElementById('ml-dot');
                const text = document.getElementById('ml-status-text');
                if (dot && text) {
                    if (r.installed) {
                        dot.classList.add('installed');
                        text.textContent = 'MelonLoader is installed and detected.';
                        text.style.color = 'var(--online)';
                    } else {
                        text.textContent = 'MelonLoader is NOT installed.';
                        text.style.color = 'var(--text-2)';
                    }
                }
            });
        } else {
            const dot = document.getElementById('ml-dot');
            const text = document.getElementById('ml-status-text');
            if (dot && text) { text.textContent = 'Set install directory first.'; }
        }

        document.getElementById('opt-select-dir').addEventListener('click', async () => {
            const result = await window.cvrma.selectDir();
            if (!result) return;
            if (result.error) { setStatus(result.error, 'err'); return; }
            await window.cvrma.saveSettings({ installFolder: result.dir, storeType: result.store });
            window.App.setInstallDir(result.dir, result.store);
            // Re-render with new dir
            render(result.dir, result.store);
            setStatus(`Install directory set to: ${result.dir}`, 'ok');
        });

        const openDirBtn = document.getElementById('opt-open-dir');
        if (openDirBtn) {
            openDirBtn.addEventListener('click', () => {
                if (installDir) window.cvrma.openDir(installDir);
            });
        }

        const installMlBtn = document.getElementById('opt-install-ml');
        if (installMlBtn) {
            installMlBtn.addEventListener('click', async () => {
                installMlBtn.disabled = true;
                installMlBtn.innerHTML = '<span class="spinner" style="width:13px;height:13px;"></span> Installing…';
                const result = await window.cvrma.installMelonLoader(installDir);
                if (result.success) {
                    setStatus('MelonLoader installed successfully.', 'ok');
                    render(installDir, storeType);
                } else {
                    setStatus(`MelonLoader install failed: ${result.error}`, 'err');
                    installMlBtn.disabled = false;
                    installMlBtn.textContent = 'Install / Update ML';
                }
            });
        }

        const removeMlBtn = document.getElementById('opt-remove-ml');
        if (removeMlBtn) {
            removeMlBtn.addEventListener('click', async () => {
                if (!confirm('Remove MelonLoader? This will delete version.dll and the MelonLoader folder.')) return;
                removeMlBtn.disabled = true;
                const result = await window.cvrma.removeMelonLoader(installDir);
                if (result.success) {
                    setStatus('MelonLoader removed.', 'ok');
                    render(installDir, storeType);
                } else {
                    setStatus(`Failed: ${result.error}`, 'err');
                    removeMlBtn.disabled = false;
                }
            });
        }

        const hideBrokenChk = document.getElementById('opt-hide-broken');
        if (hideBrokenChk) {
            const s = await window.cvrma.loadSettings();
            hideBrokenChk.checked = s.hideBroken !== false; // default true
            hideBrokenChk.addEventListener('change', () => {
                window.cvrma.saveSettings({ hideBroken: hideBrokenChk.checked });
            });
        }

        document.getElementById('opt-export-presets').addEventListener('click', async () => {
            const result = await window.cvrma.exportPresets();
            if (result.cancelled) return;
            if (result.error) { setStatus(`Export failed: ${result.error}`, 'err'); return; }
            setStatus(`Presets exported to: ${result.path}`, 'ok');
        });

        document.getElementById('opt-import-presets').addEventListener('click', async () => {
            const result = await window.cvrma.importPresets();
            if (result.cancelled) return;
            if (result.error) { setStatus(`Import failed: ${result.error}`, 'err'); return; }
            const count = Object.keys(result.presets).length;
            setStatus(`Presets imported (${count} total). Reload the Mods page to see changes.`, 'ok');
        });

        document.getElementById('opt-open-appdata').addEventListener('click', () => window.cvrma.openAppData());

        const removeAllBtn = document.getElementById('opt-remove-all-mods');
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', async () => {
                if (!confirm('Remove ALL mods from Mods/ and Plugins/ directories? This cannot be undone.')) return;
                removeAllBtn.disabled = true;
                const result = await window.cvrma.removeAllMods(installDir);
                if (result.success) {
                    setStatus(`Removed ${result.count} mod file(s).`, 'ok');
                } else {
                    setStatus(`Failed: ${result.error}`, 'err');
                }
                removeAllBtn.disabled = false;
            });
        }
    }

    function setStatus(text, type = '') {
        const el = document.getElementById('status-text');
        if (!el) return;
        el.textContent = text;
        el.className = type ? `status-${type}` : '';
    }

    function escHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    return { render };
})();
