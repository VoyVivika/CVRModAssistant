window.IntroPage = (() => {
    const TERMS_HTML = `
        <div class="intro-terms-box" id="intro-terms-scroll">
            <p>
                        <strong style="color: var(--text)">CVR Mod Assistant</strong> is a community-made mod manager
                for ChilloutVR. It is not affiliated with, endorsed by, or supported by
                ChilloutVR Team.
            </p>
            <p>By using mods you agree to the following:</p>
            <ul>
                <li>Modding may violate ChilloutVR's Terms of Service. You do so at your own risk.</li>
                <li>Mods can break after game updates. This tool automatically handles broken/retired mods, but some instability may occur.</li>
                <li>Do <strong style="color: var(--text)">not</strong> report bugs to the ChilloutVR Team that occur when mods are installed. Remove all mods before filing bug reports.</li>
                <li>The developers of CVR Mod Assistant are not responsible for any data loss, account actions, or other consequences of using this software.</li>
                <li>Mods listed here come from the CVRMG (ChilloutVR Modding Group). Use mods from unknown sources at your own risk.</li>
            </ul>
            <p>
                By clicking <em style="color: var(--text)">I Agree</em>, you acknowledge that you have read,
                understood, and accepted these terms.
            </p>
        </div>
    `;

    function render() {
        const container = document.getElementById('page-content');
        container.innerHTML = `
            <div id="intro-screen">
                <div class="intro-card fade-in">
                    <div class="intro-logo-row">
                        <div class="intro-logo-icon">
                            <img src="assets/icons/icon.svg" width="48" height="48" alt="CVR Mod Assistant Logo">
                        </div>
                        <div>
                            <div class="intro-title">CVR Mod Assistant</div>
                            <div class="intro-subtitle mono">Mod Manager for ChilloutVR &mdash; by LensError</div>
                        </div>
                    </div>

                    <div class="intro-section-title">Terms &amp; Conditions</div>

                    ${TERMS_HTML}

                    <div class="intro-checkbox-row">
                        <input type="checkbox" class="custom-checkbox" id="intro-agree-check" />
                        <label for="intro-agree-check">
                            I have read and agree to the terms listed above.
                            I understand that modding is unsupported by the game developers.
                        </label>
                    </div>

                    <div class="intro-actions">
                        <button class="intro-btn-disagree" id="intro-disagree-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            Disagree &amp; Exit
                        </button>
                        <button class="intro-btn-agree" id="intro-agree-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            I Agree, Continue
                        </button>
                    </div>
                </div>
            </div>
        `;

        const check = document.getElementById('intro-agree-check');
        const agreeBtn = document.getElementById('intro-agree-btn');
        const disagreeBtn = document.getElementById('intro-disagree-btn');

        check.addEventListener('change', () => {
            agreeBtn.disabled = !check.checked;
        });

        agreeBtn.addEventListener('click', async () => {
            if (!check.checked) return;
            agreeBtn.disabled = true;
            agreeBtn.innerHTML = `<span class="spinner" style="width:14px;height:14px;"></span> Saving…`;
            await window.cvrma.saveSettings({ termsAccepted: true, termsAcceptedAt: new Date().toISOString() });
            // Fade out intro, show app shell
            const card = document.querySelector('.intro-card');
            card.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-8px)';
            setTimeout(() => window.App.enterApp(), 280);
        });

        disagreeBtn.addEventListener('click', () => {
            disagreeBtn.textContent = 'Closing…';
            window.cvrma.close();
        });
    }

    return { render };
})();
