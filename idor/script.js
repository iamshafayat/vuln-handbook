/* =========================================================
   IDOR Handbook v3 — script.js
   ========================================================= */
;(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const on = (el, ev, fn, o) => el?.addEventListener(ev, fn, o);
  const qs = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const create = (tag, cls = "", html = "") => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html) el.innerHTML = html;
    return el;
  };

  /* ═══════════════════════════════════════
     DATABASE
  ═══════════════════════════════════════ */
  const DB = {
    users: [
      { id:1001, username:"alice", name:"Alice Johnson", email:"alice@techcorp.com", ssn:"123-45-6789", salary:75000, role:"employee", dept:"Engineering", phone:"+1-555-0101", address:"123 Maple St, New York, NY 10001", dob:"1990-05-15", passport:"US-A12345678", bank_account:"****-****-****-4242", credit_score:720, medical_conditions:"Hypertension", joined:"2019-03-12" },
      { id:1002, username:"bob", name:"Bob Williams", email:"bob@techcorp.com", ssn:"987-65-4321", salary:85000, role:"employee", dept:"Marketing", phone:"+1-555-0102", address:"456 Oak Ave, Los Angeles, CA 90001", dob:"1988-11-22", passport:"US-B98765432", bank_account:"****-****-****-1337", credit_score:680, medical_conditions:"Diabetes Type 2", joined:"2018-07-01" },
      { id:1003, username:"charlie", name:"Charlie Brown", email:"charlie@techcorp.com", ssn:"555-12-3456", salary:110000, role:"manager", dept:"Finance", phone:"+1-555-0103", address:"789 Pine Blvd, Austin, TX 78701", dob:"1985-03-08", passport:"US-C55512345", bank_account:"****-****-****-9999", credit_score:790, medical_conditions:"None", joined:"2016-01-15" },
      { id:1004, username:"diana", name:"Diana Prince", email:"diana@techcorp.com", ssn:"222-33-4444", salary:92000, role:"employee", dept:"HR", phone:"+1-555-0105", address:"321 Cedar Ln, Chicago, IL 60601", dob:"1992-08-30", passport:"US-D22233444", bank_account:"****-****-****-7878", credit_score:750, medical_conditions:"Asthma", joined:"2020-06-10" },
      { id:1005, username:"admin", name:"System Administrator", email:"admin@techcorp.com", ssn:"111-22-3333", salary:180000, role:"admin", dept:"IT Security", phone:"+1-555-0000", address:"1 Admin Tower, Seattle, WA 98101", dob:"1980-01-01", passport:"US-E11122333", bank_account:"****-****-****-0000", credit_score:850, medical_conditions:"N/A", joined:"2010-01-01" }
    ],
    orders: [
      { id:5001, user_id:1001, product:"MacBook Pro 16\"", amount:2499.99, status:"shipped", address:"123 Maple St, New York, NY 10001", card_last4:"4242", tracking:"TRK-001-ALICE" },
      { id:5002, user_id:1001, product:"AirPods Pro", amount:249.00, status:"delivered", address:"123 Maple St, New York, NY 10001", card_last4:"4242", tracking:"TRK-002-ALICE" },
      { id:5003, user_id:1002, product:"Dell Monitor 27\"", amount:449.99, status:"processing", address:"456 Oak Ave, Los Angeles, CA 90001", card_last4:"1337", tracking:"TRK-003-BOB" },
      { id:5004, user_id:1002, product:"Mechanical Keyboard", amount:159.99, status:"shipped", address:"456 Oak Ave, Los Angeles, CA 90001", card_last4:"1337", tracking:"TRK-004-BOB" },
      { id:5005, user_id:1003, product:"Server Rack 42U", amount:4999.99, status:"delivered", address:"789 Pine Blvd, Austin, TX 78701", card_last4:"9999", tracking:"TRK-005-CHARLIE" },
      { id:5006, user_id:1004, product:"iPad Pro 12.9\"", amount:1099.00, status:"shipped", address:"321 Cedar Ln, Chicago, IL 60601", card_last4:"7878", tracking:"TRK-006-DIANA" },
      { id:5007, user_id:1005, product:"Security HSM Device", amount:18999.00, status:"processing", address:"1 Admin Tower, Seattle, WA 98101", card_last4:"0000", tracking:"TRK-007-ADMIN" }
    ],
    messages: [
      { id:1, from:1001, to:1002, subject:"Team Lunch Friday?", body:"Hey Bob! Want to grab lunch on Friday with the team? Thinking of that new Italian place on 5th.", ts:"2024-11-20 09:15" },
      { id:2, from:1002, to:1001, subject:"Re: Team Lunch Friday?", body:"Sounds great Alice! I'll be there. Can we make it 12:30pm instead of noon?", ts:"2024-11-20 09:45" },
      { id:3, from:1003, to:1005, subject:"CONFIDENTIAL: Q4 Revenue", body:"Admin, Q4 net revenue hit $4.2M (+18% YoY). Profit margin 23.4%. Full board report attached. Keep private until earnings call.", ts:"2024-11-19 14:30" },
      { id:4, from:1005, to:1003, subject:"Re: CONFIDENTIAL: Q4 Rev", body:"Thanks Charlie. I've forwarded to the CFO. Under no circumstances share these figures before Dec 15th announcement.", ts:"2024-11-19 15:10" },
      { id:5, from:1001, to:1004, subject:"Welcome to the team!", body:"Hi Diana, welcome aboard! I'm Alice from Engineering. Let me know if you need any help settling in!", ts:"2024-11-18 10:00" },
      { id:6, from:1005, to:1005, subject:"System Password Vault", body:"INTERNAL NOTE — Root passwords: DB_PROD=Sup3rS3cr3t!, AWS_ROOT=Cloud@Admin2024, VPN_KEY=XK29-LM47-PQ83-RT61", ts:"2024-11-15 08:00" }
    ],
    documents: [
      { id:101, user_id:1001, name:"alice_tax_return_2024.pdf", type:"Financial", classification:"Private", size:"2.4 MB", content_preview:"Adjusted Gross Income: $75,000 | Tax Owed: $12,450 | Bank: Chase ****4242" },
      { id:102, user_id:1002, name:"bob_medical_history.pdf", type:"Medical", classification:"Confidential", size:"1.8 MB", content_preview:"Patient: Bob Williams | Dx: Diabetes Type 2 | Medications: Metformin 500mg | Insurance: BlueCross #BC-987654" },
      { id:103, user_id:1003, name:"all_employee_salaries_2024.xlsx", type:"HR", classification:"Restricted", size:"4.1 MB", content_preview:"Contains salary, SSN, and performance data for all 847 employees across 12 departments" },
      { id:104, user_id:1005, name:"admin_master_credentials.txt", type:"Security", classification:"Top Secret", size:"0.3 MB", content_preview:"DB_PROD_PASS=Sup3rS3cr3t! | AWS_KEY=AKIAIOSFODNN7EXAMPLE | ROOT_SSH_KEY=[RSA PRIVATE KEY...]" },
      { id:105, user_id:1004, name:"diana_hr_performance_review.pdf", type:"HR", classification:"Confidential", size:"0.9 MB", content_preview:"Rating: Exceeds Expectations | Salary raise approved: +8% | Manager notes: Exceptional teamwork" }
    ],
    admin_endpoints: [
      { path:"/api/v1/admin/users", method:"GET", description:"List ALL users with full details", data_type:"All user PII including SSN, salary", access:"admin only" },
      { path:"/api/v1/admin/audit-log", method:"GET", description:"System audit log with all user actions", data_type:"Login times, IP addresses, actions", access:"admin only" },
      { path:"/api/v1/admin/system-config", method:"GET", description:"Server configuration & secrets", data_type:"API keys, DB credentials, env vars", access:"admin only" },
      { path:"/api/v1/admin/analytics/revenue", method:"GET", description:"Company revenue & financial data", data_type:"Revenue, costs, profit margins", access:"admin only" },
      { path:"/api/v1/admin/users/{id}/reset-password", method:"POST", description:"Force reset any user's password", data_type:"Password reset tokens", access:"admin only" }
    ],
    sessions: {}
  };

  const LAB = { user: null, token: null };

  function dbLogin(username) {
    const u = DB.users.find(x => x.username === username);
    if (!u) return null;
    const tok = `sess_${u.username}_${Math.random().toString(36).slice(2, 9)}`;
    DB.sessions[tok] = u.id;
    LAB.user = u;
    LAB.token = tok;
    return { user: u, token: tok };
  }

  function userName(id) {
    return DB.users.find(u => u.id === id)?.username || `user_${id}`;
  }

  /* ═══════════════════════════════════════
     1 · THEME
  ═══════════════════════════════════════ */
  function initTheme() {
    const saved = localStorage.getItem("idor-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeBtn(saved);
    on(qs("themeBtn"), "click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("idor-theme", next);
      updateThemeBtn(next);
    });
  }
  function updateThemeBtn(t) {
    const b = qs("themeBtn");
    if (!b) return;
    b.innerHTML = t === "light"
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  }

  /* ═══════════════════════════════════════
     2 · SIDEBAR
  ═══════════════════════════════════════ */
  function initSidebar() {
    const sb = qs("sidebar");
    const openSB = () => { sb?.classList.add("open"); document.body.style.overflow = "hidden"; };
    const closeSB = () => { sb?.classList.remove("open"); document.body.style.overflow = ""; };
    on(qs("sidebarOpen"), "click", openSB);
    on(qs("mobileMenu"), "click", openSB);
    on(qs("sidebarClose"), "click", closeSB);
    on(sb, "click", e => { if (e.target === sb) closeSB(); });
    $$(".toc a").forEach(a => on(a, "click", () => { if (window.innerWidth <= 1024) closeSB(); }));
  }

  /* ═══════════════════════════════════════
     3 · PROGRESS
  ═══════════════════════════════════════ */
  function initProgress() {
    const bar = $(".progress-bar");
    if (!bar) return;
    const u = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
    };
    window.addEventListener("scroll", u, { passive: true });
    u();
  }

  /* ═══════════════════════════════════════
     4 · SCROLLSPY
  ═══════════════════════════════════════ */
  function initScrollSpy() {
    const secs = $$("[data-section]");
    const links = $$(".toc a[data-target]");
    if (!secs.length || !links.length) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting)
        links.forEach(l => l.classList.toggle("active", l.dataset.target === e.target.dataset.section));
    }), { rootMargin: "-18% 0px -60% 0px" });
    secs.forEach(s => io.observe(s));
  }

  /* ═══════════════════════════════════════
     5 · SEARCH
  ═══════════════════════════════════════ */
  function initSearch() {
    const inputs = $$(".search-input");
    const allSecs = () => $$("[data-section]");
    inputs.forEach(inp => {
      on(inp, "input", () => {
        const q = inp.value.trim().toLowerCase();
        allSecs().forEach(s => s.classList.toggle("hidden", !!(q && !s.textContent.toLowerCase().includes(q))));
      });
    });
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); inputs[0]?.focus(); }
      if (e.key === "Escape") {
        inputs.forEach(i => { i.value = ""; i.dispatchEvent(new Event("input")); });
        allSecs().forEach(s => s.classList.remove("hidden"));
      }
    });
  }

  /* ═══════════════════════════════════════
     6 · COPY
  ═══════════════════════════════════════ */
  function initCopy() {
    on(document, "click", async e => {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const pre = btn.closest(".code-wrap")?.querySelector("pre");
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent.trim());
        const o = btn.innerHTML;
        btn.innerHTML = "✓ Copied!";
        btn.style.color = "var(--good)";
        setTimeout(() => { btn.innerHTML = o; btn.style.color = ""; }, 1800);
      } catch (_) {}
    });
  }

  /* ═══════════════════════════════════════
     7 · ACCORDIONS
  ═══════════════════════════════════════ */
  function initAccordions() {
    on(document, "click", e => {
      const btn = e.target.closest(".acc-btn");
      if (!btn) return;
      const item = btn.closest(".acc-item");
      if (!item) return;
      const open = item.classList.contains("open");
      $$(".acc-item.open", item.parentElement).forEach(i => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  }

  /* ═══════════════════════════════════════
     8 · COUNTERS
  ═══════════════════════════════════════ */
  function initCounters() {
    const els = $$("[data-count]");
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, t = +el.dataset.count, pfx = el.dataset.prefix || "", sfx = el.dataset.suffix || "";
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / 1400, 1);
        el.textContent = pfx + Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString() + sfx;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    }), { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════
     9 · SCROLL ANIMS
  ═══════════════════════════════════════ */
  function initScrollAnims() {
    const els = $$(".anim-in");
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }), { threshold: 0.05 });
    els.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════
     10 · DATA TABLES
  ═══════════════════════════════════════ */
  function initTables() {
    const tb = id => qs(id);
    const ut = tb("usersTableBody");
    if (ut) DB.users.forEach(u => {
      ut.appendChild(create("tr", "", `<td><code>${u.id}</code></td><td><strong>${u.username}</strong></td><td>${u.name}</td><td>${u.email}</td><td><span class="tag ${u.role==='admin'?'bad':u.role==='manager'?'warn':'info'}">${u.role}</span></td><td>${u.dept}</td>`));
    });
    const ot = tb("ordersTableBody");
    if (ot) DB.orders.forEach(o => {
      const ow = DB.users.find(u => u.id === o.user_id);
      ot.appendChild(create("tr", "", `<td><code>${o.id}</code></td><td>${ow?.username}</td><td>${o.product}</td><td>$${o.amount.toLocaleString()}</td><td><span class="tag ${o.status==='delivered'?'good':o.status==='processing'?'warn':'info'}">${o.status}</span></td>`));
    });
    const mt = tb("msgsTableBody");
    if (mt) DB.messages.forEach(m => {
      const s = DB.users.find(u => u.id === m.from), r = DB.users.find(u => u.id === m.to);
      mt.appendChild(create("tr", "", `<td><code>${m.id}</code></td><td>${s?.username}</td><td>${r?.username}</td><td>${m.subject}</td><td>${m.ts}</td>`));
    });
    const dt = tb("docsTableBody");
    if (dt) DB.documents.forEach(d => {
      const ow = DB.users.find(u => u.id === d.user_id);
      const cls = d.classification==="Top Secret"?"bad":d.classification==="Restricted"?"bad":d.classification==="Confidential"?"warn":"info";
      dt.appendChild(create("tr", "", `<td><code>${d.id}</code></td><td>${ow?.username}</td><td>${d.name}</td><td><span class="tag ${cls}">${d.classification}</span></td><td>${d.type}</td>`));
    });
    // Admin endpoints table
    const at = tb("adminTableBody");
    if (at) DB.admin_endpoints.forEach(ep => {
      at.appendChild(create("tr","",`<td><span class="http-method ${ep.method.toLowerCase()}" style="font-size:.72rem">${ep.method}</span></td><td><code style="font-size:.8rem">${ep.path}</code></td><td style="font-size:.85rem">${ep.description}</td><td><span class="tag bad" style="font-size:.7rem">${ep.access}</span></td>`));
    });
  }

  /* ═══════════════════════════════════════
     HTTP VISUAL HELPERS
  ═══════════════════════════════════════ */
  function methodColor(m) { return {GET:"get",POST:"post",PUT:"put",DELETE:"delete",PATCH:"patch"}[m]||"get"; }
  function statusHtml(c) {
    const cls = c < 300 ? "s200" : c === 403 ? "s403" : "s404";
    const msgs = {200:"OK",201:"Created",204:"No Content",403:"Forbidden",404:"Not Found"};
    return `<span class="http-status ${cls}">${c} ${msgs[c]||""}</span>`;
  }

  function buildHttpVisual(opts) {
    const { method, url, headers = {}, reqBody = null, statusCode, resBody, isVuln, vulnFields = [], explanation } = opts;
    const allH = { "Host":"api.techcorp.com", "Accept":"application/json", ...headers };
    const hStr = Object.entries(allH).map(([k,v])=>`${k}: ${v}`).join("\n");
    const bStr = reqBody ? "\n\n" + JSON.stringify(reqBody, null, 2) : "";

    const vi = isVuln
      ? `<div class="vuln-indicator vulnerable slide-in"><span class="vi-icon">🔴</span><span>IDOR VULNERABILITY CONFIRMED — ${explanation}</span></div>`
      : `<div class="vuln-indicator secure slide-in"><span class="vi-icon">🟢</span><span>PROPERLY SECURED — ${explanation}</span></div>`;

    let resJson = "";
    if (resBody) {
      let s = JSON.stringify(resBody, null, 2);
      // Apply JSON syntax highlighting FIRST on clean JSON text
      s = s
        .replace(/(".*?")\s*:/g, '<span style="color:var(--brand3)">$1</span>:')
        .replace(/:\s*(".*?")/g, ': <span style="color:var(--good)">$1</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:var(--warn)">$1</span>');
      // THEN apply vulnerability field highlighting on top
      if (isVuln && vulnFields.length) {
        vulnFields.forEach(f => {
          s = s.replace(new RegExp(`(<span style="color:var\\(--brand3\\)">)"${f}"(</span>:\\s*.+)`, "g"),
            `<span style="background:rgba(239,68,68,.12);border-radius:3px;padding:0 2px">$1"${f}"$2 ⚠️</span>`);
        });
      }
      resJson = s;
    }

    return `
    <div class="http-visual slide-in">
      <div class="http-tab">
        <button class="http-tab-btn active" data-htab="req">📤 Request</button>
        <button class="http-tab-btn" data-htab="res">📥 Response</button>
        ${isVuln ? '<button class="http-tab-btn" data-htab="flow">🔍 Server Flow</button>' : ""}
      </div>
      <div class="http-body" data-hpanel="req">
        <div class="http-line"><span class="http-method ${methodColor(method)}">${method}</span><span class="http-url">${url}</span><span style="color:var(--dim);font-size:.78rem">HTTP/1.1</span></div>
        <div class="code-wrap" style="margin-top:.35rem"><pre style="margin:0"><code>${hStr}${bStr}</code></pre></div>
      </div>
      <div class="http-body hidden" data-hpanel="res">
        <div class="http-line" style="margin-bottom:.35rem">${statusHtml(statusCode)}<span style="color:var(--dim);font-size:.78rem">Content-Type: application/json</span></div>
        ${resBody ? `<div class="result-json"><pre style="margin:0;border:none;background:transparent;padding:0"><code>${resJson}</code></pre></div>` : `<p style="color:var(--dim)">No response body</p>`}
        ${vi}
      </div>
      ${isVuln ? `
      <div class="http-body hidden" data-hpanel="flow">
        <div class="server-flow">
          <div class="sf-row pass"><span class="sf-icon">✅</span><span>Step 1 — Client sends request with session token</span></div>
          <div class="sf-row pass"><span class="sf-icon">✅</span><span>Step 2 — Server validates session → User authenticated</span></div>
          <div class="sf-row skip"><span class="sf-icon">❌</span><span>Step 3 — Authorization check → <strong>MISSING!</strong> No ownership/role verification</span></div>
          <div class="sf-row fail"><span class="sf-icon">🔓</span><span>Step 4 — Server queries DB with attacker-supplied ID</span><span class="sf-status" style="margin-left:auto">IDOR!</span></div>
          <div class="sf-row fail"><span class="sf-icon">💥</span><span>Step 5 — Sensitive data returned without authorization</span></div>
        </div>
        ${vi}
      </div>` : ""}
    </div>`;
  }

  // HTTP tab switching
  on(document, "click", e => {
    const btn = e.target.closest("[data-htab]");
    if (!btn) return;
    const vis = btn.closest(".http-visual");
    if (!vis) return;
    const tab = btn.dataset.htab;
    $$("[data-htab]", vis).forEach(b => b.classList.toggle("active", b.dataset.htab === tab));
    $$("[data-hpanel]", vis).forEach(p => p.classList.toggle("hidden", p.dataset.hpanel !== tab));
  });

  function renderResult(cid, opts) {
    const el = qs(cid);
    if (!el) return;
    const { title, statusCode, isVuln, http } = opts;
    const cc = isVuln === true ? "bad" : isVuln === false ? "good" : "warn";
    const icons = { bad:"🔴", good:"🟢", warn:"🟡" };
    el.innerHTML = `
      <div class="result-header"><span class="result-title">${icons[cc]} ${title}</span>${statusHtml(statusCode)}</div>
      <div class="result-body">
        ${opts.desc ? `<p class="result-desc">${opts.desc}</p>` : ""}
        ${http ? buildHttpVisual(http) : ""}
      </div>`;
    if (!opts.noScroll) el.scrollIntoView({ behavior:"smooth", block:"nearest" });
  }

  /* ═══════════════════════════════════════
     LAB 1 — Horizontal Profile IDOR
  ═══════════════════════════════════════ */
  function initLab1() {
    const form = qs("lab1Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab1Login").value);
      const tid = parseInt(qs("lab1Target").value, 10);
      if (!sess) return;
      const target = DB.users.find(u => u.id === tid);
      if (!target) { renderResult("lab1Result",{title:"404 Not Found",statusCode:404,isVuln:null,desc:`No user with ID <code>${tid}</code>.`,http:null}); return; }
      const isOwn = sess.user.id === tid;
      const url = `/api/v1/users/${tid}/profile`;
      const sensitiveFields = ["ssn","salary","bank_account","credit_score","medical_conditions","dob","passport","phone","address"];
      const resBody = { id:target.id, username:target.username, name:target.name, email:target.email, phone:target.phone, address:target.address, ssn:target.ssn, dob:target.dob, passport:target.passport, salary:target.salary, bank_account:target.bank_account, credit_score:target.credit_score, medical_conditions:target.medical_conditions, role:target.role, dept:target.dept };
      if (isOwn) {
        renderResult("lab1Result",{title:"Your Own Profile — Normal Access",statusCode:200,isVuln:false,desc:`Logged in as <strong>${sess.user.username}</strong> → accessing your own profile (ID:${tid}). This is expected.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"User accessing their own resource"}});
      } else {
        renderResult("lab1Result",{title:`IDOR DETECTED — Accessing ${target.username}'s Sensitive Profile`,statusCode:200,isVuln:true,desc:`Logged in as <strong>${sess.user.username}</strong> (ID:${sess.user.id}) but retrieved <strong>${target.name}</strong>'s (ID:${tid}) full profile including SSN, salary, passport, medical info and bank details. <span style="color:var(--bad);font-weight:700">Server never checked ownership!</span>`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:sensitiveFields,explanation:`${sess.user.username} read ${target.username}'s private data without authorization`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 2 — Vertical IDOR (NEW)
  ═══════════════════════════════════════ */
  function initLab2() {
    const form = qs("lab2Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab2Login").value);
      const endpoint = qs("lab2Endpoint").value;
      if (!sess) return;

      const ep = DB.admin_endpoints.find(x => x.path === endpoint);
      const url = endpoint;
      const isAdmin = sess.user.role === "admin";

      if (isAdmin) {
        // Admin accessing admin endpoints — normal
        let resBody = {};
        if (endpoint.includes("/users")) resBody = { total_users: DB.users.length, users: DB.users.map(u=>({id:u.id,username:u.username,email:u.email,ssn:u.ssn,salary:u.salary,role:u.role})) };
        else if (endpoint.includes("/audit")) resBody = { entries:[ {ts:"2024-11-20 09:00",user:"alice",action:"login",ip:"192.168.1.101"}, {ts:"2024-11-20 09:05",user:"bob",action:"view_profile",ip:"10.0.0.55"}, {ts:"2024-11-20 09:10",user:"admin",action:"update_config",ip:"172.16.0.1"} ]};
        else if (endpoint.includes("/system-config")) resBody = { db_host:"prod-db.internal",db_pass:"Sup3rS3cr3t!",aws_key:"AKIAIOSFODNN7EXAMPLE",jwt_secret:"ultra-s3cr3t-jwt-key-2024",redis_url:"redis://cache.internal:6379" };
        else if (endpoint.includes("/revenue")) resBody = { q4_revenue:"$4,200,000",profit_margin:"23.4%",yoy_growth:"+18%",operating_costs:"$3,216,000",employee_count:847 };
        else if (endpoint.includes("/reset-password")) resBody = { success:true,message:"Password reset token generated",token:"rst_eyJhbGciOiJIUzI1NiJ9.abc123",expires:"15 minutes" };

        renderResult("lab2Result",{title:"200 OK — Admin Access (Authorized)",statusCode:200,isVuln:false,desc:`<strong>${sess.user.username}</strong> is an admin. Access to <code>${endpoint}</code> is authorized.`,http:{method:ep?.method||"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"Admin role verified — access granted"}});
      } else {
        // Regular user accessing admin endpoints — VERTICAL IDOR!
        let resBody = {};
        if (endpoint.includes("/users")) resBody = { total_users: DB.users.length, users: DB.users.map(u=>({id:u.id,username:u.username,email:u.email,ssn:u.ssn,salary:u.salary,role:u.role})) };
        else if (endpoint.includes("/audit")) resBody = { entries:[ {ts:"2024-11-20 09:00",user:"alice",action:"login",ip:"192.168.1.101"}, {ts:"2024-11-20 09:05",user:"bob",action:"view_profile",ip:"10.0.0.55"}, {ts:"2024-11-20 09:10",user:"admin",action:"update_config",ip:"172.16.0.1"} ]};
        else if (endpoint.includes("/system-config")) resBody = { db_host:"prod-db.internal",db_pass:"Sup3rS3cr3t!",aws_key:"AKIAIOSFODNN7EXAMPLE",jwt_secret:"ultra-s3cr3t-jwt-key-2024",redis_url:"redis://cache.internal:6379" };
        else if (endpoint.includes("/revenue")) resBody = { q4_revenue:"$4,200,000",profit_margin:"23.4%",yoy_growth:"+18%",operating_costs:"$3,216,000",employee_count:847 };
        else if (endpoint.includes("/reset-password")) resBody = { success:true,message:"Password for user 1002 has been reset",new_temp_password:"TempP@ss123!",token:"rst_eyJhbGciOiJIUzI1NiJ9.abc123" };

        const severity = endpoint.includes("/system-config") || endpoint.includes("/reset-password") ? "🚨 CRITICAL" : "⚠️ HIGH";
        renderResult("lab2Result",{title:`${severity} — Vertical IDOR! ${sess.user.role} accessed ADMIN endpoint`,statusCode:200,isVuln:true,desc:`<strong>${sess.user.username}</strong> (role: <strong>${sess.user.role}</strong>) accessed admin-only endpoint <code>${endpoint}</code>.<br><br><span style="color:var(--bad)">The server checked authentication (valid session) but <strong>never verified the user's role is "admin"</strong>. A regular employee just accessed ${ep?.description || "admin functionality"}!</span>`,http:{method:ep?.method||"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:endpoint.includes("/system-config")?["db_pass","aws_key","jwt_secret"]:endpoint.includes("/reset-password")?["new_temp_password","token"]:endpoint.includes("/users")?["ssn","salary"]:[],explanation:`${sess.user.username} (${sess.user.role}) accessed admin-only data — vertical privilege escalation`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 3 — Order IDOR (was Lab 2)
  ═══════════════════════════════════════ */
  function initLab3() {
    const form = qs("lab3Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab3Login").value);
      const oid = parseInt(qs("lab3Order").value, 10);
      if (!sess) return;
      const order = DB.orders.find(o => o.id === oid);
      if (!order) { renderResult("lab3Result",{title:"404 Not Found",statusCode:404,isVuln:null,desc:`No order ${oid}.`,http:null}); return; }
      const owner = DB.users.find(u => u.id === order.user_id);
      const isOwn = sess.user.id === order.user_id;
      const url = `/api/v1/orders/${oid}`;
      const resBody = { ...order, owner_username: owner?.username };
      if (isOwn) {
        renderResult("lab3Result",{title:"Your Own Order — Normal Access",statusCode:200,isVuln:false,desc:`Order #${oid} belongs to you.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"Accessing own order"}});
      } else {
        renderResult("lab3Result",{title:`IDOR — Reading ${owner?.username}'s Order`,statusCode:200,isVuln:true,desc:`Logged in as <strong>${sess.user.username}</strong> but accessed <strong>${owner?.name}</strong>'s order. Leaked: product, amount ($${order.amount}), shipping address, card last-4, tracking.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:["address","card_last4","tracking","amount"],explanation:`${sess.user.username} read ${owner?.username}'s order data`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 4 — Message IDOR (was Lab 3)
  ═══════════════════════════════════════ */
  function initLab4() {
    const form = qs("lab4Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab4Login").value);
      const mid = parseInt(qs("lab4Msg").value, 10);
      if (!sess) return;
      const msg = DB.messages.find(m => m.id === mid);
      if (!msg) { renderResult("lab4Result",{title:"404",statusCode:404,isVuln:null,desc:`No message ${mid}.`,http:null}); return; }
      const s = DB.users.find(u => u.id === msg.from), r = DB.users.find(u => u.id === msg.to);
      const inv = sess.user.id === msg.from || sess.user.id === msg.to;
      const url = `/api/v1/messages/${mid}`;
      const resBody = { id:msg.id, from:s?.username, to:r?.username, subject:msg.subject, body:msg.body, timestamp:msg.ts };
      if (inv) {
        renderResult("lab4Result",{title:"Your Message — Normal Access",statusCode:200,isVuln:false,desc:"You are a participant.",http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"User is a participant"}});
      } else {
        renderResult("lab4Result",{title:`IDOR — Reading PRIVATE Message (${s?.username} ↔ ${r?.username})`,statusCode:200,isVuln:true,desc:`<strong>${sess.user.username}</strong> read a private message between <strong>${s?.username}</strong> and <strong>${r?.username}</strong>.<br>Subject: "<em>${msg.subject}</em>"<br><span style="color:var(--bad)">Try messages 3, 4, or 6 for extremely sensitive content!</span>`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:["body","subject"],explanation:`${sess.user.username} intercepted a private message`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 5 — Document IDOR (was Lab 4)
  ═══════════════════════════════════════ */
  function initLab5() {
    const form = qs("lab5Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab5Login").value);
      const did = parseInt(qs("lab5Doc").value, 10);
      if (!sess) return;
      const doc = DB.documents.find(d => d.id === did);
      if (!doc) { renderResult("lab5Result",{title:"404",statusCode:404,isVuln:null,desc:`No document ${did}.`,http:null}); return; }
      const owner = DB.users.find(u => u.id === doc.user_id);
      const isOwn = sess.user.id === doc.user_id;
      const url = `/api/v1/documents/${did}`;
      const resBody = { id:doc.id, filename:doc.name, type:doc.type, classification:doc.classification, size:doc.size, owner:owner?.username, download_url:`/files/${doc.name}`, content_preview:doc.content_preview };
      if (isOwn) {
        renderResult("lab5Result",{title:"Your Document — Normal Access",statusCode:200,isVuln:false,desc:`${doc.name} belongs to you.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"Own document"}});
      } else {
        const sev = doc.classification==="Top Secret"||doc.classification==="Restricted"?"🚨 CRITICAL":"⚠️ HIGH";
        renderResult("lab5Result",{title:`IDOR ${sev} — ${owner?.username}'s ${doc.classification} Document`,statusCode:200,isVuln:true,desc:`<strong>${sess.user.username}</strong> accessed <strong>${owner?.name}</strong>'s <span style="color:var(--bad)">${doc.classification}</span> doc: <strong>${doc.name}</strong><br>Preview: "<em>${doc.content_preview}</em>"`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:["content_preview","download_url","classification"],explanation:`${sess.user.username} downloaded ${doc.classification} document`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 6 — Write IDOR / Priv Esc (was Lab 5)
  ═══════════════════════════════════════ */
  function initLab6() {
    const form = qs("lab6Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab6Login").value);
      const tid = parseInt(qs("lab6Target").value, 10);
      const newRole = qs("lab6Role").value;
      const newEmail = qs("lab6Email").value.trim();
      if (!sess) return;
      const target = DB.users.find(u => u.id === tid);
      if (!target) { renderResult("lab6Result",{title:"404",statusCode:404,isVuln:null,desc:"User not found.",http:null}); return; }
      const isOwn = sess.user.id === tid;
      const url = `/api/v1/users/${tid}/profile`;
      const reqBody = {};
      if (newRole) reqBody.role = newRole;
      if (newEmail) reqBody.email = newEmail;
      const modified = { ...target, ...reqBody };
      const resBody = { id:modified.id, username:modified.username, email:modified.email, role:modified.role, updated:true };

      if (isOwn && newRole === target.role) {
        renderResult("lab6Result",{title:"Normal Update — No Role Change",statusCode:200,isVuln:false,desc:"Updated without privilege escalation.",http:{method:"PUT",url,headers:{"Authorization":`Bearer ${sess.token}`},reqBody,statusCode:200,resBody,isVuln:false,explanation:"No privilege change"}});
      } else if (isOwn && newRole !== target.role) {
        renderResult("lab6Result",{title:`PRIVILEGE ESCALATION! ${target.role} → ${newRole}`,statusCode:200,isVuln:true,desc:`<strong>${sess.user.username}</strong> changed own role from <strong>${target.role}</strong> to <strong>${newRole}</strong>. <span style="color:var(--bad)">Vertical IDOR — self-promotion!</span>`,http:{method:"PUT",url,headers:{"Authorization":`Bearer ${sess.token}`},reqBody,statusCode:200,resBody,isVuln:true,vulnFields:["role"],explanation:`Self-promoted from ${target.role} to ${newRole}`}});
      } else {
        renderResult("lab6Result",{title:`IDOR — Modifying ${target.username}'s Account`,statusCode:200,isVuln:true,desc:`<strong>${sess.user.username}</strong> modified <strong>${target.name}</strong>'s account. <span style="color:var(--bad)">Horizontal + Vertical IDOR → Account Takeover risk!</span>`,http:{method:"PUT",url,headers:{"Authorization":`Bearer ${sess.token}`},reqBody,statusCode:200,resBody,isVuln:true,vulnFields:["role","email"],explanation:`Modified another user's account without authorization`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 7 — Secure vs Insecure (was Lab 6)
  ═══════════════════════════════════════ */
  function initLab7() {
    const form = qs("lab7Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab7Login").value);
      const tid = parseInt(qs("lab7Target").value, 10);
      const mode = $("input[name='lab7mode']:checked")?.value || "insecure";
      if (!sess) return;
      const target = DB.users.find(u => u.id === tid);
      if (!target) { renderResult("lab7Result",{title:"404",statusCode:404,isVuln:null,desc:"Not found.",http:null}); return; }
      const isOwn = sess.user.id === tid;
      const url = `/api/v1/users/${tid}/profile`;

      if (mode === "insecure") {
        const resBody = {id:target.id,username:target.username,name:target.name,email:target.email,ssn:target.ssn,salary:target.salary,role:target.role,phone:target.phone};
        if (isOwn) renderResult("lab7Result",{title:"200 OK — Own Profile (Insecure Mode)",statusCode:200,isVuln:false,desc:"Own data returned. Code is still vulnerable though!",http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:false,explanation:"Own profile — but code is vulnerable!"}});
        else renderResult("lab7Result",{title:"🔴 IDOR — Insecure Mode (No AuthZ)",statusCode:200,isVuln:true,desc:`<strong>Vulnerable code</strong> returns ${target.username}'s sensitive data to ${sess.user.username}.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody,isVuln:true,vulnFields:["ssn","salary","phone"],explanation:"No authorization check"}});
      } else {
        if (isOwn || sess.user.role === "admin") {
          const safeBody = {id:target.id,username:target.username,name:target.name,email:target.email,dept:target.dept};
          renderResult("lab7Result",{title:"🟢 200 OK — Secure Mode (Authorized)",statusCode:200,isVuln:false,desc:`Access granted. ${isOwn?"Own profile.":"Admin access."} Sensitive fields removed.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:200,resBody:safeBody,isVuln:false,explanation:"Ownership verified — safe fields only"}});
        } else {
          renderResult("lab7Result",{title:"🟢 403 Forbidden — Secure Mode (Blocked)",statusCode:403,isVuln:false,desc:`<strong>Secure code</strong> detected: session.user_id (${sess.user.id}) ≠ requested_id (${tid}). Blocked.`,http:{method:"GET",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:403,resBody:{error:"Forbidden",message:"You do not have permission to access this resource."},isVuln:false,explanation:"Authorization check passed — blocked correctly"}});
        }
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 8 — Mass Enumeration (was Lab 7)
  ═══════════════════════════════════════ */
  function initLab8() {
    const runBtn = qs("lab8Run"), stopBtn = qs("lab8Stop");
    if (!runBtn) return;
    let running = false;
    on(runBtn, "click", async () => {
      if (running) return;
      const sess = dbLogin(qs("lab8Login").value);
      const resource = qs("lab8Resource").value;
      const startId = parseInt(qs("lab8Start").value,10);
      const endId = parseInt(qs("lab8End").value,10);
      const delay = parseInt(qs("lab8Delay").value,10)||80;
      const output = qs("lab8Output"), summary = qs("lab8Summary"), prog = qs("lab8Prog");
      if (!sess) return;
      output.innerHTML = "";
      summary.textContent = "";
      running = true;
      runBtn.disabled = true;
      stopBtn?.classList.remove("hidden");
      let found = 0, own = 0, total = endId - startId + 1;
      output.appendChild(create("div","enum-line",`<span style="color:var(--brand2);font-weight:800">[SCAN START]</span> as <strong>${sess.user.username}</strong> | ${resource} IDs ${startId}–${endId}`));
      for (let id = startId; id <= endId; id++) {
        if (!running) break;
        await sleep(delay);
        if (prog) prog.style.width = `${Math.round(((id-startId+1)/total)*100)}%`;
        let item=null,display={},isOwn=false;
        if (resource==="users") { item=DB.users.find(u=>u.id===id); if(item){isOwn=item.id===sess.user.id;display={id:item.id,username:item.username,email:item.email,ssn:item.ssn,salary:`$${item.salary.toLocaleString()}`,role:item.role};} }
        else if (resource==="orders") { item=DB.orders.find(o=>o.id===id); if(item){const ow=DB.users.find(u=>u.id===item.user_id);isOwn=item.user_id===sess.user.id;display={id:item.id,owner:ow?.username,product:item.product,amount:`$${item.amount}`,address:item.address};} }
        else if (resource==="messages") { item=DB.messages.find(m=>m.id===id); if(item){const s=DB.users.find(u=>u.id===item.from),r=DB.users.find(u=>u.id===item.to);isOwn=item.from===sess.user.id||item.to===sess.user.id;display={id:item.id,from:s?.username,to:r?.username,subject:item.subject,body:item.body.slice(0,55)+"..."};} }
        else if (resource==="documents") { item=DB.documents.find(d=>d.id===id); if(item){const ow=DB.users.find(u=>u.id===item.user_id);isOwn=item.user_id===sess.user.id;display={id:item.id,owner:ow?.username,filename:item.name,classification:item.classification};} }
        const line = create("div","enum-line","");
        if (item) {
          found++; if(isOwn) own++;
          line.classList.add(isOwn?"own":"found");
          line.innerHTML = `<span style="color:${isOwn?"var(--good)":"var(--bad)"};font-weight:900">${isOwn?"[OWN ]":"[IDOR]"}</span> GET /api/v1/${resource}/${id} → <span style="color:var(--warn)">200</span> | ${JSON.stringify(display)}`;
        } else {
          line.classList.add("empty");
          line.innerHTML = `<span style="color:var(--dim)">[----]</span> GET /api/v1/${resource}/${id} → <span style="color:var(--dim)">404</span>`;
        }
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
      }
      const idor_count = found - own;
      output.appendChild(create("div","enum-line",`<span style="color:var(--brand2);font-weight:800">[DONE]</span> Found: <span style="color:var(--warn)">${found}</span> | Own: <span style="color:var(--good)">${own}</span> | <span style="color:var(--bad)">IDOR: ${idor_count}</span>`));
      if (prog) prog.style.width = "100%";
      if (summary) summary.innerHTML = `<span class="tag ${idor_count>0?'bad':'good'}">${idor_count>0?`🔴 ${idor_count} IDOR records`:'🟢 No unauthorized access'}</span>`;
      running = false; runBtn.disabled = false; stopBtn?.classList.add("hidden");
    });
    on(stopBtn, "click", () => { running = false; runBtn.disabled = false; stopBtn?.classList.add("hidden"); });
  }

  /* ═══════════════════════════════════════
     LAB 9 — Delete IDOR (was Lab 8)
  ═══════════════════════════════════════ */
  function initLab9() {
    const form = qs("lab9Form");
    if (!form) return;
    on(form, "submit", e => {
      e.preventDefault();
      const sess = dbLogin(qs("lab9Login").value);
      const mid = parseInt(qs("lab9Msg").value, 10);
      if (!sess) return;
      const msg = DB.messages.find(m => m.id === mid);
      if (!msg) { renderResult("lab9Result",{title:"404",statusCode:404,isVuln:null,desc:`Message ${mid} not found.`,http:null}); return; }
      const s = DB.users.find(u => u.id === msg.from), r = DB.users.find(u => u.id === msg.to);
      const isOwn = sess.user.id === msg.from || sess.user.id === msg.to;
      const url = `/api/v1/messages/${mid}`;
      if (isOwn) {
        renderResult("lab9Result",{title:"204 — Your Message Deleted",statusCode:204,isVuln:false,desc:"Own message deleted. Normal.",http:{method:"DELETE",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:204,resBody:null,isVuln:false,explanation:"Own message — authorized"}});
      } else {
        renderResult("lab9Result",{title:`IDOR — Deleted ${s?.username}'s Private Message!`,statusCode:204,isVuln:true,desc:`<strong>${sess.user.username}</strong> deleted a private message between <strong>${s?.username}</strong> and <strong>${r?.username}</strong>.<br>Subject: "<em>${msg.subject}</em>"<br><span style="color:var(--bad)">Delete-based IDOR — destroys evidence, causes DoS!</span>`,http:{method:"DELETE",url,headers:{"Authorization":`Bearer ${sess.token}`},statusCode:204,resBody:{deleted:true,message_id:mid,deleted_at:"2024-11-20T12:00:00Z"},isVuln:true,vulnFields:[],explanation:`Deleted someone else's private conversation`}});
      }
    });
  }

  /* ═══════════════════════════════════════
     LAB 10 — ATO Chain (was Lab 9)
  ═══════════════════════════════════════ */
  function initLab10() {
    const btns = $$(".lab10-step-btn");
    if (!btns.length) return;
    const results = [
      { title:"Step 1: Read Victim Email via Profile IDOR",statusCode:200,isVuln:true,desc:`<strong>alice</strong> discovers bob's email: <strong>bob@techcorp.com</strong>`,http:{method:"GET",url:"/api/v1/users/1002/profile",headers:{"Authorization":"Bearer sess_alice_xyz"},statusCode:200,resBody:{id:1002,username:"bob",email:"bob@techcorp.com",phone:"+1-555-0102"},isVuln:true,vulnFields:["email","phone"],explanation:"Leaked victim email — chain step 1"}},
      { title:"Step 2: Trigger Password Reset",statusCode:200,isVuln:false,desc:"Reset triggered for bob@techcorp.com. Token generated server-side.",http:{method:"POST",url:"/api/v1/auth/forgot-password",headers:{"Content-Type":"application/json"},reqBody:{email:"bob@techcorp.com"},statusCode:200,resBody:{message:"Reset link sent",expires_in:"15 minutes"},isVuln:false,explanation:"Normal reset flow — token generated"}},
      { title:"Step 3: Steal Reset Token via IDOR",statusCode:200,isVuln:true,desc:`<strong>alice</strong> reads bob's reset token directly from the API.`,http:{method:"GET",url:"/api/v1/users/1002/reset-token",headers:{"Authorization":"Bearer sess_alice_xyz"},statusCode:200,resBody:{user_id:1002,reset_token:"eyJhbGciOiJIUzI1NiJ9.abc123.xyz",expires:"2024-11-20T12:15:00Z"},isVuln:true,vulnFields:["reset_token"],explanation:"Reset token stolen via IDOR — step 3"}},
      { title:"Step 4: Reset Bob's Password",statusCode:200,isVuln:true,desc:"Attacker uses stolen token to set new password.",http:{method:"POST",url:"/api/v1/auth/reset-password",headers:{"Content-Type":"application/json"},reqBody:{token:"eyJhbGciOiJIUzI1NiJ9.abc123.xyz",new_password:"H4cked!123"},statusCode:200,resBody:{success:true,message:"Password updated for user 1002"},isVuln:true,vulnFields:["new_password"],explanation:"Password reset with stolen token — step 4"}},
      { title:"Step 5: FULL ACCOUNT TAKEOVER!",statusCode:200,isVuln:true,desc:`<span style="color:var(--bad);font-weight:900">CRITICAL:</span> Attacker logs in as bob. Complete takeover! CVSS 9.8`,http:{method:"POST",url:"/api/v1/auth/login",headers:{"Content-Type":"application/json"},reqBody:{username:"bob",password:"H4cked!123"},statusCode:200,resBody:{token:"sess_bob_ATTACKER",user_id:1002,username:"bob",role:"employee",message:"Login successful"},isVuln:true,vulnFields:["token","user_id"],explanation:"FULL ACCOUNT TAKEOVER — 5-step IDOR chain"}}
    ];
    function showStep(i, noScroll) {
      renderResult("lab10Result", { ...results[i], noScroll: !!noScroll });
      btns.forEach((b, idx) => { b.classList.toggle("btn-brand", idx === i); b.disabled = false; });
    }
    btns.forEach((b, i) => on(b, "click", () => showStep(i)));
    showStep(0, true);
  }

  /* ═══════════════════════════════════════
     BOOT
  ═══════════════════════════════════════ */
  function boot() {
    initTheme();
    initSidebar();
    initProgress();
    initScrollSpy();
    initSearch();
    initCopy();
    initAccordions();
    initCounters();
    initTables();
    initLab1();
    initLab2();   // NEW — Vertical IDOR
    initLab3();
    initLab4();
    initLab5();
    initLab6();
    initLab7();
    initLab8();
    initLab9();
    initLab10();
    requestAnimationFrame(initScrollAnims);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
