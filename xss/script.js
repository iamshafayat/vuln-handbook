/* ============================================================
   XSS HANDBOOK — COMPLETE JAVASCRIPT
   ============================================================ */

'use strict';

/* ======================================================
   STATE
   ====================================================== */
const State = {
    currentPage: 0,
    totalPages: 9,
    completedPages: new Set([0]),
    storedComments: [],
    domXssPayload: 'Alice'
};

/* ======================================================
   DOM HELPERS
   ====================================================== */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function setHTML(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
}

function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
}

function show(id) { const el = $(id); if (el) el.style.display = ''; }
function hide(id) { const el = $(id); if (el) el.style.display = 'none'; }

/* ======================================================
   ESCAPE UTILITY
   ====================================================== */
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/* ======================================================
   NAVIGATION
   ====================================================== */
function navigateTo(pageNum) {
    pageNum = parseInt(pageNum, 10);
    if (pageNum < 0 || pageNum >= State.totalPages) return;

    // Hide all pages
    $$('.page').forEach(p => p.classList.remove('active'));
    $$('.sidebar-item').forEach(i => i.classList.remove('active'));

    // Show target
    const page = $(`page-${pageNum}`);
    const nav  = $(`nav-${pageNum}`);
    if (!page) return;

    page.classList.add('active');
    if (nav) nav.classList.add('active');

    State.completedPages.add(pageNum);
    State.currentPage = pageNum;

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar
    if (window.innerWidth < 768) {
        $('sidebar').classList.remove('open');
    }
}

function updateProgress() {
    const done = State.completedPages.size;
    const pct  = (done / State.totalPages) * 100;

    // Navbar progress
    const fill = $('navProgressFill');
    const lbl  = $('navProgressLabel');
    if (fill) fill.style.width = pct + '%';
    if (lbl)  lbl.textContent  = `${done} / ${State.totalPages} Topics`;

    // Sidebar progress
    const sFill = $('sidebarProgressFill');
    const sPct  = $('sidebarProgressPct');
    if (sFill) sFill.style.width = pct + '%';
    if (sPct)  sPct.textContent  = Math.round(pct) + '%';

    // Check marks
    State.completedPages.forEach(n => {
        const checkEl = $(`check-${n}`);
        const navEl   = $(`nav-${n}`);
        if (checkEl) checkEl.textContent = '✓';
        if (navEl)   navEl.classList.add('completed');
    });
}

function toggleSidebar() {
    $('sidebar').classList.toggle('open');
}

/* ======================================================
   KEYBOARD NAVIGATION
   ====================================================== */
document.addEventListener('keydown', e => {
    // Don't hijack when typing in inputs
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && State.currentPage < State.totalPages - 1) {
        navigateTo(State.currentPage + 1);
    } else if (e.key === 'ArrowLeft' && State.currentPage > 0) {
        navigateTo(State.currentPage - 1);
    }
});

/* ======================================================
   TABS
   ====================================================== */
function switchTab(btnEl, paneId) {
    const tabsEl = btnEl.closest('.tabs');
    if (!tabsEl) return;
    tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabsEl.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btnEl.classList.add('active');
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.add('active');
}

/* ======================================================
   HINTS
   ====================================================== */
function toggleHint(id) {
    const body   = $(`hint-body-${id}`);
    const toggle = $(`hint-toggle-${id}`);
    if (!body) return;
    const isOpen = body.classList.toggle('visible');
    if (toggle) {
        toggle.classList.toggle('open', isOpen);
        const labelEl = toggle.querySelector('.hint-label');
        if (labelEl) labelEl.textContent = isOpen ? 'Hide Hints' : 'Show Hints';
    }
}

/* ======================================================
   XSS MODAL
   ====================================================== */
function showXSSModal(type, data) {
    const overlay = $('xssModal');
    if (!overlay) return;

    const titleEl  = $('modalTitle');
    const bodyEl   = $('modalBody');
    const cookieEl = $('modalCookie');

    const configs = {
        reflected: {
            title: '⚠️ Reflected XSS Executed!',
            body: 'Your script ran in the victim\'s browser via the URL. The server included your payload directly in the HTML response without sanitization.',
            cookie: data || 'sessionId=USER_ABC123; authToken=SECRET_XYZ789; role=user'
        },
        stored: {
            title: '💾 Stored XSS Executed!',
            body: 'Your payload was stored in the database and executed when ANY visitor loaded the page — including administrators with elevated privileges!',
            cookie: data || 'sessionId=ADMIN_TOKEN_456; role=administrator; csrf=abc123def456'
        },
        dom: {
            title: '🔀 DOM-Based XSS Executed!',
            body: 'The attack happened entirely in the browser. The server\'s response was CLEAN — only the client-side JavaScript was vulnerable. Traditional WAFs would NOT catch this!',
            cookie: data || 'sessionId=DOM_VICTIM_789; userPref=dark; lastLogin=2024-01-01'
        }
    };

    const cfg = configs[type] || configs.reflected;
    if (titleEl)  titleEl.textContent  = cfg.title;
    if (bodyEl)   bodyEl.textContent   = cfg.body;
    if (cookieEl) cookieEl.textContent = cfg.cookie;

    overlay.classList.add('show');
}

function closeXSSModal() {
    const overlay = $('xssModal');
    if (overlay) overlay.classList.remove('show');
}

// Close modal on backdrop click
document.addEventListener('click', e => {
    const overlay = $('xssModal');
    if (e.target === overlay) closeXSSModal();
});

/* ======================================================
   XSS PATTERN DETECTION
   ====================================================== */
const XSS_PATTERNS = [
    /<script/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /onfocus\s*=/i,
    /onmouseenter\s*=/i,
    /onkeypress\s*=/i,
    /onkeydown\s*=/i,
    /ontoggle\s*=/i,
    /onanimation/i,
    /<svg/i,
    /<img/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<details/i,
    /javascript\s*:/i,
    /data\s*:/i,
    /alert\s*\(/i,
    /prompt\s*\(/i,
    /confirm\s*\(/i,
    /eval\s*\(/i,
    /document\s*\./i,
    /window\s*\./i,
    /fetch\s*\(/i,
    /xhr\s*\./i,
    /\$\s*\(/i
];

function isXSSPayload(input) {
    return XSS_PATTERNS.some(p => p.test(input));
}

function hasCookieAccess(input) {
    return /document\s*\.\s*cookie/i.test(input);
}

function hasRedirect(input) {
    return /location\s*(\.\s*(href|assign|replace)|\s*=)/i.test(input);
}

function isHTMLInjection(input) {
    return /<[a-zA-Z]/.test(input) && !isXSSPayload(input);
}

/* ======================================================
   LAB 1 — REFLECTED XSS
   ====================================================== */
function updateReflectedURL(val) {
    const el = $('reflected-url-text');
    if (el) el.textContent = `https://vulnerable-shop.com/search?q=${encodeURIComponent(val || '')}`;
}

function setReflectedPayload(payload) {
    const inp = $('reflected-input');
    if (!inp) return;
    inp.value = payload;
    updateReflectedURL(payload);
}

function runReflectedXSS() {
    const inp      = $('reflected-input');
    const output   = $('reflected-output');
    const analysis = $('reflected-analysis');
    const result   = $('reflected-result');
    if (!inp) return;

    const input = inp.value.trim();
    updateReflectedURL(input);

    if (!input) {
        if (output)   output.innerHTML = '<span style="color:#999;font-size:0.9rem;">Enter a search term and click Search...</span>';
        if (analysis) analysis.textContent = 'Waiting for input...';
        if (result)   result.innerHTML = '';
        return;
    }

    const xss      = isXSSPayload(input);
    const cookie   = hasCookieAccess(input);
    const redirect = hasRedirect(input);
    const html     = isHTMLInjection(input);
    const escaped  = escHtml(input);

    if (xss) {
        // Show what the vulnerable server returns
        if (output) {
            output.innerHTML = `
                <div style="font-family:Arial;padding:5px 0;">
                    <span style="color:#888;font-size:0.88rem;font-weight:bold;">Search results for: </span>
                    <span style="color:#d50000;font-family:monospace;font-size:0.82rem;">${escaped}</span>
                    <div style="color:#d50000;font-size:0.8rem;margin-top:8px;padding:8px;background:#fff0f0;border-radius:4px;border-left:3px solid #d50000;">
                        ⚠️ Payload injected directly into HTML! Script would execute here.
                    </div>
                </div>`;
        }

        let analysisHtml = '';
        analysisHtml += `<span class="lo-danger">⚠️  XSS PAYLOAD DETECTED\n\n</span>`;
        analysisHtml += `<span class="lo-info">📍 Type: Reflected XSS\n</span>`;
        analysisHtml += `<span class="lo-info">📝 Input: ${escaped}\n\n</span>`;
        analysisHtml += `<span class="lo-danger">💀 Impact:\n</span>`;
        if (cookie)   analysisHtml += `<span class="lo-danger">   → document.cookie stolen!\n   → Session hijacking possible!\n</span>`;
        if (redirect) analysisHtml += `<span class="lo-danger">   → Page redirect to attacker site!\n</span>`;
        if (!cookie && !redirect) analysisHtml += `<span class="lo-danger">   → JS executes in victim's browser\n   → Runs as vulnerable-shop.com origin\n</span>`;
        analysisHtml += `\n<span class="lo-warning">🛡️  Fix: htmlspecialchars($input, ENT_QUOTES, 'UTF-8')</span>`;

        if (analysis) analysis.innerHTML = analysisHtml;

        if (result) {
            result.innerHTML = `
                <div class="lab-alert la-danger">
                    <span class="la-icon">🎯</span>
                    <div><strong>XSS Successful!</strong> In a real application, this script would execute in the victim's browser with full access to the <code>vulnerable-shop.com</code> origin.</div>
                </div>`;
        }

        setTimeout(() => showXSSModal('reflected',
            cookie ? 'sessionId=USER_ABC123; authToken=SECRET_XYZ789; cart=item1,item2' : null
        ), 350);

    } else if (html) {
        if (output) {
            output.innerHTML = `
                <div style="font-family:Arial;padding:5px 0;">
                    <span style="color:#888;font-size:0.88rem;font-weight:bold;">Search results for: </span>
                    <span style="color:#e67e00;font-family:monospace;font-size:0.82rem;">${escaped}</span>
                    <div style="color:#e67e00;font-size:0.8rem;margin-top:8px;padding:8px;background:#fff8f0;border-radius:4px;border-left:3px solid #e67e00;">
                        ⚠️ HTML injected but no JavaScript event. Try adding an event handler.
                    </div>
                </div>`;
        }
        if (analysis) analysis.innerHTML = `<span class="lo-warning">⚠️  HTML INJECTION (partial)\n\nHTML was injected but no JS executed.\nTry adding: onerror=alert(1) or onclick=alert(1)</span>`;
        if (result)   result.innerHTML   = `<div class="lab-alert la-warning"><span class="la-icon">⚠️</span><div>HTML injected! Add a JavaScript event handler to complete the XSS.</div></div>`;

    } else {
        if (output) {
            output.innerHTML = `
                <div style="font-family:Arial;padding:5px 0;">
                    <span style="color:#888;font-size:0.88rem;font-weight:bold;">Search results for: </span>
                    <strong style="color:#333;">"${escaped}"</strong>
                    <p style="color:#999;font-size:0.88rem;margin-top:8px;">0 products found. Try another term.</p>
                </div>`;
        }
        if (analysis) analysis.innerHTML = `<span class="lo-safe">✅ Normal input - no XSS detected\n\n</span><span class="lo-info">💡 Try these payloads:\n  &lt;script&gt;alert(1)&lt;/script&gt;\n  &lt;img src=x onerror=alert(1)&gt;\n  &lt;svg onload=alert(document.cookie)&gt;</span>`;
        if (result)   result.innerHTML   = `<div class="lab-alert la-info"><span class="la-icon">ℹ️</span><div>Normal input. Try an XSS payload from the list above!</div></div>`;
    }
}

/* ======================================================
   LAB 2 — STORED XSS
   ====================================================== */
function setStoredPayload(name, comment) {
    const nEl = $('stored-name');
    const cEl = $('stored-comment');
    if (nEl) nEl.value = name;
    if (cEl) cEl.value = comment;
}

function submitStoredComment() {
    const nameEl    = $('stored-name');
    const commentEl = $('stored-comment');
    const analysis  = $('stored-analysis');
    if (!nameEl || !commentEl) return;

    const name    = nameEl.value.trim() || 'Anonymous';
    const comment = commentEl.value.trim();

    if (!comment) {
        if (analysis) analysis.innerHTML = '<div class="lab-alert la-warning"><span class="la-icon">⚠️</span><div>Please enter a comment!</div></div>';
        return;
    }

    const xss    = isXSSPayload(comment);
    const cookie = hasCookieAccess(comment);

    const commentObj = {
        id: Date.now(),
        name,
        comment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isXSS: xss,
        hasCookie: cookie
    };

    State.storedComments.push(commentObj);
    renderComments();

    const countEl = $('stored-count');
    if (countEl) countEl.textContent = State.storedComments.length;

    if (analysis) {
        if (xss) {
            analysis.innerHTML = `
                <div class="lab-alert la-danger">
                    <span class="la-icon">💾</span>
                    <div>
                        <strong>Payload Stored in Database!</strong><br>
                        This XSS script is now permanently stored. Every visitor who loads this page — including site administrators — will have this script execute in their browser.
                    </div>
                </div>
                <div class="lab-alert la-warning" style="margin-top:8px;">
                    <span class="la-icon">👑</span>
                    <div>
                        <strong>Admin Account Takeover:</strong> If an admin views this comment, their session token can be stolen, giving the attacker full admin access — all from a single comment!
                    </div>
                </div>`;
            setTimeout(() => showXSSModal('stored',
                cookie ? 'sessionId=ADMIN_TOKEN_456; role=administrator; csrfToken=abc123' : null
            ), 400);
        } else {
            analysis.innerHTML = `<div class="lab-alert la-success"><span class="la-icon">✅</span><div>Normal comment posted. Try submitting an XSS payload to see the attack!</div></div>`;
        }
    }

    nameEl.value    = '';
    commentEl.value = '';
}

function renderComments() {
    const container = $('stored-comments-list');
    if (!container) return;

    if (State.storedComments.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;padding:20px 0;font-size:0.88rem;">No comments yet. Be the first to comment!</p>';
        return;
    }

    const avatarColors = ['#1877f2','#e74c3c','#27ae60','#9b59b6','#f39c12','#16a085'];

    container.innerHTML = State.storedComments.map((c, i) => {
        const color   = avatarColors[i % avatarColors.length];
        const initial = c.name.charAt(0).toUpperCase();
        const xssBg   = c.isXSS ? 'background:#fff0f0;border-left:3px solid #d50000;' : '';

        return `
            <div class="cs-comment" style="${xssBg}">
                <div class="cs-avatar" style="background:${color};">${initial}</div>
                <div class="cs-comment-body">
                    <div class="cs-comment-bubble">
                        <div class="cs-comment-name">${escHtml(c.name)}</div>
                        <div class="cs-comment-text">
                            ${escHtml(c.comment)}
                            ${c.isXSS ? '<br><small style="color:#d50000;">🔴 XSS payload stored — fires for every visitor!</small>' : ''}
                        </div>
                    </div>
                    <span class="cs-comment-time">${c.time}</span>
                    ${c.isXSS ? ' · <span style="color:#d50000;font-size:0.72rem;font-weight:700;">⚠️ MALICIOUS</span>' : ''}
                </div>
            </div>`;
    }).join('');
}

function clearStoredComments() {
    State.storedComments = [];
    renderComments();
    const countEl  = $('stored-count');
    const analysis = $('stored-analysis');
    if (countEl)  countEl.textContent = '0';
    if (analysis) analysis.innerHTML  = '';
}

/* ======================================================
   LAB 3 — DOM-BASED XSS
   ====================================================== */
function updateDOMUrl(val) {
    State.domXssPayload = val || '';
    const urlText = `vulnerable.com/welcome#${encodeURIComponent(val || '')}`;
    const display  = $('dom-url-display');
    const browserU = $('dom-browser-url');
    if (display)  display.textContent = urlText;
    if (browserU) browserU.textContent = urlText;
}

function setDOMPayload(payload) {
    const inp = $('dom-payload');
    if (!inp) return;
    inp.value = payload;
    updateDOMUrl(payload);
}

function runDOMXSS() {
    const inp     = $('dom-payload');
    const output  = $('dom-greeting');
    const trace   = $('dom-trace');
    const result  = $('dom-result');
    if (!inp) return;

    const input  = inp.value;
    const xss    = isXSSPayload(input);
    const cookie = hasCookieAccess(input);
    const html   = isHTMLInjection(input);
    const escaped = escHtml(input);

    updateDOMUrl(input);

    // Build trace output
    let traceHtml = '';
    traceHtml += `<span class="lo-info">📥 SOURCE:\n  location.hash.substring(1)\n  → "${escaped}"\n\n</span>`;
    traceHtml += `<span class="lo-info">⚙️  PROCESSING:\n  name = decodeURIComponent("${escaped}")\n\n</span>`;

    if (xss) {
        traceHtml += `<span class="lo-danger">💀 SINK (VULNERABLE):\n  element.innerHTML = "Hello, ${escaped}"\n\n</span>`;
        traceHtml += `<span class="lo-danger">⚠️  RESULT: Script executed!\n  Server response was IDENTICAL.\n  WAF would NOT detect this!</span>`;

        if (output) {
            output.innerHTML = `
                <span style="color:#d50000;font-weight:bold;">⚠️ XSS Executed!</span>
                <br><span style="font-size:0.75rem;color:#999;">Payload: ${escaped}</span>
                <br><span style="font-size:0.75rem;color:#999;">Server response was clean — attack is 100% client-side</span>`;
        }

        if (result) {
            result.innerHTML = `
                <div class="lab-alert la-danger">
                    <span class="la-icon">🎯</span>
                    <div>
                        <strong>DOM XSS Successful!</strong> The script executed purely in the browser.
                        The server sent the <em>exact same clean response</em> regardless of the payload — making this invisible to server-side security tools.
                    </div>
                </div>`;
        }

        setTimeout(() => showXSSModal('dom',
            cookie ? 'sessionId=DOM_VICTIM_789; userPref=dark; remember=true' : null
        ), 350);

    } else if (html) {
        traceHtml += `<span class="lo-warning">⚠️  SINK (HTML INJECTION):\n  element.innerHTML = "Hello, ${escaped}"\n\n  HTML rendered but no JS triggered.\n  Add event handler to complete XSS!</span>`;

        if (output) {
            output.innerHTML = `Hello, <span style="color:red;font-weight:bold;">[HTML Injected: ${escaped}]</span>`;
        }

        if (result) {
            result.innerHTML = `<div class="lab-alert la-warning"><span class="la-icon">⚠️</span><div>HTML injected! Now add a JavaScript event handler like <code>onerror</code> or <code>onload</code> to execute JS.</div></div>`;
        }

    } else if (input.trim()) {
        traceHtml += `<span class="lo-safe">✅ SINK (would be safe with textContent):\n  "Hello, ${escaped}"\n\n  Text rendered harmlessly.\n  No HTML/JS interpreted.</span>`;

        if (output) output.textContent = `Hello, ${input}!`;

        if (result) {
            result.innerHTML = `<div class="lab-alert la-info"><span class="la-icon">ℹ️</span><div>Normal input. Try: <code>&lt;img src=x onerror=alert(1)&gt;</code></div></div>`;
        }

    } else {
        traceHtml = '<span class="lo-info">Enter a value above and click Execute to trace the data flow...</span>';
        if (output) output.textContent = 'Hello, World!';
        if (result) result.innerHTML   = '';
    }

    if (trace) trace.innerHTML = traceHtml;
}

/* ======================================================
   COPY BUTTON
   ====================================================== */
function copyCode(btnEl) {
    const block = btnEl.closest('.code-block');
    if (!block) return;
    const body = block.querySelector('.code-body');
    if (!body) return;
    navigator.clipboard.writeText(body.innerText).then(() => {
        const orig = btnEl.textContent;
        btnEl.textContent = '✓ Copied!';
        btnEl.style.background = 'var(--success)';
        btnEl.style.color = 'white';
        setTimeout(() => {
            btnEl.textContent = orig;
            btnEl.style.background = '';
            btnEl.style.color = '';
        }, 1800);
    }).catch(() => {
        btnEl.textContent = 'Copy failed';
        setTimeout(() => { btnEl.textContent = '⎘ Copy'; }, 1500);
    });
}

/* ======================================================
   SCROLL TO TOP
   ====================================================== */
window.addEventListener('scroll', () => {
    const btn = $('scrollTopBtn');
    if (!btn) return;
    btn.classList.toggle('show', window.scrollY > 300);
});

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ======================================================
   CONTEXT HIGHLIGHTING (Comparison interactive)
   ====================================================== */
function highlightContext(ctx) {
    $$('.ctx-item').forEach(el => {
        el.classList.toggle('active', el.dataset.ctx === ctx);
    });
}

/* ======================================================
   DOM PAYLOAD LIVE INPUT
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Wire DOM payload input
    const domInp = $('dom-payload');
    if (domInp) {
        domInp.addEventListener('input', () => updateDOMUrl(domInp.value));
    }

    // Wire reflected input URL update
    const refInp = $('reflected-input');
    if (refInp) {
        refInp.addEventListener('input', () => updateReflectedURL(refInp.value));
    }

    // Initial state
    updateProgress();
    renderComments();

    // Animate hero stats on first load
    setTimeout(() => {
        $$('.hero-stat-num[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            animateCount(el, target);
        });
    }, 400);
});

/* ======================================================
   COUNT ANIMATION (for stats)
   ====================================================== */
function animateCount(el, target) {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const isFloat = String(target).includes('.');

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = isFloat
            ? (target * ease).toFixed(1)
            : Math.round(target * ease);
        el.textContent = el.dataset.suffix ? value + el.dataset.suffix : value;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ======================================================
   INTERSECTION OBSERVER (lazy animations)
   ====================================================== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    $$('.animate-on-scroll').forEach(el => observer.observe(el));
});

/* ======================================================
   CLOSE SIDEBAR ON OUTSIDE CLICK (mobile)
   ====================================================== */
document.addEventListener('click', e => {
    const sidebar = $('sidebar');
    const menuBtn = $('menuBtn');
    if (!sidebar || !menuBtn) return;
    if (window.innerWidth < 768
        && sidebar.classList.contains('open')
        && !sidebar.contains(e.target)
        && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

/* ======================================================
   COMPARISON TABLE — interactive highlight
   ====================================================== */
function highlightColumn(colIdx) {
    const rows = $$('.comparison-table tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        cells.forEach((cell, i) => {
            cell.classList.toggle('col-highlight', i === colIdx);
        });
    });
}

/* ======================================================
   PUBLIC API (for inline onclick attributes)
   ====================================================== */
window.navigateTo         = navigateTo;
window.toggleSidebar      = toggleSidebar;
window.switchTab          = switchTab;
window.toggleHint         = toggleHint;
window.showXSSModal       = showXSSModal;
window.closeXSSModal      = closeXSSModal;
window.scrollTop          = scrollTop;
window.copyCode           = copyCode;

// Lab 1
window.updateReflectedURL = updateReflectedURL;
window.setReflectedPayload= setReflectedPayload;
window.runReflectedXSS    = runReflectedXSS;

// Lab 2
window.setStoredPayload   = setStoredPayload;
window.submitStoredComment= submitStoredComment;
window.clearStoredComments= clearStoredComments;

// Lab 3
window.updateDOMUrl       = updateDOMUrl;
window.setDOMPayload      = setDOMPayload;
window.runDOMXSS          = runDOMXSS;