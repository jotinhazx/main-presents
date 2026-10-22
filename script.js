/* ===================================================================
   COM CARINHO, JOTINHA — JAVASCRIPT PRINCIPAL
   Interatividade, Animações, Canvas de Partículas, Áudio Sintetizado e Lightbox
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderContentFromConfig();
    setupAmbientCanvas();
    setupHeartTrigger();
    setupLightbox();
    setupScrollEffects();
    setupEasterEgg();
    setupAmbientAudio();
    setupBackToTop();
}

/* -------------------------------------------------------------------
   1. RENDERIZAÇÃO A PARTIR DE CONTENT.JS
------------------------------------------------------------------- */
function renderContentFromConfig() {
    if (typeof HOMENAGEM_CONFIG === 'undefined') return;

    // Renderizar Galeria
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && HOMENAGEM_CONFIG.galeria) {
        galleryContainer.innerHTML = '';
        HOMENAGEM_CONFIG.galeria.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `gallery-item item-${index + 1} reveal-on-scroll`;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Ampliar foto: ${item.destaque || item.alt}`);

            card.innerHTML = `
                <div class="gallery-img-container">
                    <img class="gallery-img" src="${item.src}" alt="${item.alt}" loading="lazy">
                    <div class="gallery-zoom-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </div>
                    <div class="gallery-overlay">
                        ${item.destaque ? `<span class="gallery-badge">${item.destaque}</span>` : ''}
                        <p class="gallery-caption">${item.legenda}</p>
                    </div>
                </div>
            `;

            // Clique e teclado para abrir lightbox
            const openAction = () => openLightbox(item.src, item.alt, item.legenda);
            card.addEventListener('click', openAction);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openAction();
                }
            });

            galleryContainer.appendChild(card);
        });
    }

    // Renderizar Mensagens / Elogios
    const elogiosContainer = document.getElementById('elogios-container');
    if (elogiosContainer && HOMENAGEM_CONFIG.elogios) {
        elogiosContainer.innerHTML = '';
        HOMENAGEM_CONFIG.elogios.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'message-card reveal-on-scroll';

            let iconSvg = '';
            if (item.icone === 'sparkles') {
                iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
            } else if (item.icone === 'sun') {
                iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
            } else if (item.icone === 'heart') {
                iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
            } else {
                iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`;
            }

            card.innerHTML = `
                <div class="message-icon-box">
                    ${iconSvg}
                </div>
                <h3 class="message-title">${item.titulo}</h3>
                <p>${item.texto}</p>
            `;
            elogiosContainer.appendChild(card);
        });
    }

    // Renderizar Abertura
    if (HOMENAGEM_CONFIG.abertura) {
        const welcomeHeading = document.getElementById('welcome-heading');
        const welcomeCard = document.getElementById('welcome-body-card');
        if (welcomeHeading && HOMENAGEM_CONFIG.abertura.saudacao) {
            welcomeHeading.textContent = HOMENAGEM_CONFIG.abertura.saudacao;
        }
        if (welcomeCard && HOMENAGEM_CONFIG.abertura.paragrafos) {
            welcomeCard.innerHTML = HOMENAGEM_CONFIG.abertura.paragrafos
                .map(p => `<p class="text-justified">${p}</p>`)
                .join('');
        }
    }

    // Renderizar Citação
    if (HOMENAGEM_CONFIG.citacao) {
        const qText = document.getElementById('quote-content');
        const qAuthor = document.getElementById('quote-author');
        const qContext = document.getElementById('quote-context');
        if (qText) qText.textContent = HOMENAGEM_CONFIG.citacao.frase;
        if (qAuthor) qAuthor.textContent = HOMENAGEM_CONFIG.citacao.autor;
        if (qContext) qContext.textContent = HOMENAGEM_CONFIG.citacao.contexto;
    }

    // Renderizar Mensagem Final
    if (HOMENAGEM_CONFIG.mensagemFinal) {
        const finalSection = document.getElementById('sec-final');
        if (finalSection) {
            const finalTitle = finalSection.querySelector('.closing-title');
            const signatureContainer = finalSection.querySelector('.signature-container');
            const easterEgg = finalSection.querySelector('.easter-egg-btn');
            
            if (finalTitle && HOMENAGEM_CONFIG.mensagemFinal.titulo) {
                finalTitle.textContent = HOMENAGEM_CONFIG.mensagemFinal.titulo;
            }

            // Inserir parágrafos atualizados preservando assinatura e botão
            const paragraphsHtml = HOMENAGEM_CONFIG.mensagemFinal.paragrafos
                .map(p => `<p class="closing-text">${p}</p>`)
                .join('');
            
            const card = finalSection.querySelector('.closing-card');
            if (card) {
                card.innerHTML = `
                    <h2 class="closing-title">${HOMENAGEM_CONFIG.mensagemFinal.titulo}</h2>
                    ${paragraphsHtml}
                    <div class="signature-container">
                        <span class="signature-text">
                            ${HOMENAGEM_CONFIG.mensagemFinal.assinatura}
                        </span>
                    </div>
                    <button class="easter-egg-btn" id="easter-egg-btn" aria-label="Ver lembrete especial">
                        ✨ Toque aqui para um lembrete secreto
                    </button>
                `;
                setupEasterEgg();
            }
        }
    }
}

/* -------------------------------------------------------------------
   2. TRANSIÇÃO DA TELA INICIAL (O PRIMEIRO CLIQUE)
------------------------------------------------------------------- */
function setupHeartTrigger() {
    const heartBtn = document.getElementById('heart-trigger-btn');
    const ctaText = document.getElementById('cta-text');
    const introScreen = document.getElementById('screen-intro');
    const mainApp = document.getElementById('main-app');

    const handleFirstClick = (e) => {
        // Disparar explosão delicada de partículas no ponto do clique
        const rect = heartBtn.getBoundingClientRect();
        const clientX = e.clientX || (rect.left + rect.width / 2);
        const clientY = e.clientY || (rect.top + rect.height / 2);
        createHeartBurst(clientX, clientY, 24);

        // Desvanecer suavemente a tela de introdução
        introScreen.classList.add('hidden');

        // Revelar o conteúdo principal
        setTimeout(() => {
            mainApp.classList.remove('hidden');
            mainApp.classList.add('visible');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Iniciar observador de rolagem das seções
            initIntersectionObserver();
        }, 500);
    };

    if (heartBtn) heartBtn.addEventListener('click', handleFirstClick);
    if (ctaText) ctaText.addEventListener('click', handleFirstClick);

    // Botão de scroll até a galeria
    const scrollBtn = document.getElementById('scroll-to-gallery-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const gal = document.getElementById('sec-gallery');
            if (gal) gal.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* Efeito de pequenas partículas/corações saindo ao interagir */
function createHeartBurst(x, y, count = 16) {
    const symbols = ['❤️', '✨', '🌸', '💖', '⭐'];
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'floating-petal';
        petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
        const distance = 70 + Math.random() * 110;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 180;

        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.setProperty('--dx', `${dx}px`);
        petal.style.setProperty('--dy', `${dy}px`);
        petal.style.setProperty('--rot', `${rot}deg`);

        document.body.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 1800);
    }
}

/* -------------------------------------------------------------------
   3. LIGHTBOX AMPLIADO PARA AS FOTOS
------------------------------------------------------------------- */
let currentLightboxImg = null;

function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openLightbox(src, alt, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');

    if (!modal || !img) return;

    img.src = src;
    img.alt = alt || 'Fotografia em destaque';
    if (captionEl) captionEl.textContent = caption || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* -------------------------------------------------------------------
   4. SCROLL EFFECTS & REVEAL ON SCROLL
------------------------------------------------------------------- */
function initIntersectionObserver() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
}

function setupScrollEffects() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;

        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
        }

        if (backToTop) {
            if (scrollTop > 450) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }, { passive: true });
}

function setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* -------------------------------------------------------------------
   5. DETALHE INTERATIVO (EASTER EGG / LEMBRETE SECRETO)
------------------------------------------------------------------- */
let currentSurpriseIndex = 0;
let toastTimeoutId = null;

function setupEasterEgg() {
    const btn = document.getElementById('easter-egg-btn');
    const toast = document.getElementById('secret-toast');

    if (!btn || !toast) return;

    // Remove listener antigo se existir clonando o botão
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
        const list = (typeof HOMENAGEM_CONFIG !== 'undefined' && HOMENAGEM_CONFIG.surpresasInterativas)
            ? HOMENAGEM_CONFIG.surpresasInterativas
            : ['Espero que seu dia seja muito leve e especial! ✨'];

        const msg = list[currentSurpriseIndex % list.length];
        currentSurpriseIndex++;

        // Limpa timer anterior se houver
        if (toastTimeoutId) {
            clearTimeout(toastTimeoutId);
            toastTimeoutId = null;
        }

        toast.innerHTML = `
            <div class="toast-text-content">${msg}</div>
            <button class="toast-close-btn" id="toast-close-btn" aria-label="Fechar mensagem">&times;</button>
        `;
        toast.classList.add('show');

        // Botão de fechar manual para a pessoa fechar quando quiser
        const closeBtn = document.getElementById('toast-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
                if (toastTimeoutId) clearTimeout(toastTimeoutId);
            });
        }

        // Partículas delicadas ao redor do botão
        const rect = newBtn.getBoundingClientRect();
        createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

        // Tempo estendido generoso: 10 segundos (10000ms)
        const hideAfterDelay = () => {
            toastTimeoutId = setTimeout(() => {
                toast.classList.remove('show');
            }, 10000);
        };

        hideAfterDelay();

        // Se passar o mouse ou tocar por cima, não fecha enquanto estiver lendo
        toast.onmouseenter = () => {
            if (toastTimeoutId) clearTimeout(toastTimeoutId);
        };
        toast.onmouseleave = () => {
            hideAfterDelay();
        };
    });
}

/* -------------------------------------------------------------------
   6. CANVAS DE PARTÍCULAS SUTIS & BRILHOS (GOLD & SUNSET DUST)
------------------------------------------------------------------- */
function setupAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 22 : 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.6,
            alpha: Math.random() * 0.45 + 0.15,
            speedY: Math.random() * 0.35 + 0.1,
            speedX: (Math.random() - 0.5) * 0.25,
            pulse: Math.random() * 0.02 + 0.01,
            color: Math.random() > 0.4 ? 'rgba(230, 169, 107,' : 'rgba(245, 207, 158,'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.y -= p.speedY;
            p.x += p.speedX;
            p.alpha += Math.sin(Date.now() * 0.002) * 0.004;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            const currentAlpha = Math.max(0.1, Math.min(0.65, p.alpha));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color} ${currentAlpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(230, 169, 107, 0.4)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* -------------------------------------------------------------------
   7. TRILHA SONORA AMBIENTE SUAVE (SINTETIZADA VIA WEB AUDIO API)
   Sem arquivos externos pesados ou erros de CORS, som de piano suave
------------------------------------------------------------------- */
let audioCtx = null;
let isAudioPlaying = false;
let melodyInterval = null;

function setupAmbientAudio() {
    const toggleBtn = document.getElementById('audio-toggle-btn');
    const statusText = document.getElementById('audio-status-text');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        if (!isAudioPlaying) {
            startGentleMelody();
            toggleBtn.classList.add('playing');
            if (statusText) statusText.textContent = 'Pausar melodia';
            isAudioPlaying = true;
        } else {
            stopGentleMelody();
            toggleBtn.classList.remove('playing');
            if (statusText) statusText.textContent = 'Melodia suave';
            isAudioPlaying = false;
        }
    });
}

function startGentleMelody() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Sequência de acordes sutis e tranquilos em pentatônica (G / Em / C / D)
    const notes = [
        392.00, 440.00, 493.88, 587.33, 659.25, 783.99, // Sol, Lá, Si, Ré, Mi, Sol
        523.25, 587.33, 659.25, 783.99, 880.00
    ];

    let noteIdx = 0;
    const playNextNote = () => {
        if (!isAudioPlaying || !audioCtx) return;

        const freq = notes[noteIdx % notes.length];
        noteIdx = (noteIdx + Math.floor(Math.random() * 2) + 1) % notes.length;

        playPianoTone(freq, 2.6);
    };

    playNextNote();
    melodyInterval = setInterval(playNextNote, 1600);
}

function stopGentleMelody() {
    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

function playPianoTone(freq, duration = 2.5) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope suave de ataque e release longo (efeito etéreo e aconchegante)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
}
