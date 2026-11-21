/* Nadia Live Chat Widget — Kantor Ai - Bebas Kreasi (Works on HP & Desktop) */
(function () {
  const REPO = 'Taufiqhippy/hollowframe-autoposter';
  const BRANCH = 'main';
  const TOKEN_KEY = 'kantor_ai_bos_token';

  const style = document.createElement('style');
  style.textContent = `
    #nadia-fab {
      position: fixed; right: 16px; bottom: 72px; z-index: 60;
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff;
      border: none; border-radius: 999px; padding: 11px 16px;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 0.82rem; font-weight: 800; cursor: pointer;
      box-shadow: 0 10px 28px rgba(14, 165, 233, 0.42);
      transition: transform 0.18s;
    }
    #nadia-fab:hover { transform: translateY(-2px); }
    #nadia-drawer {
      position: fixed; right: 16px; bottom: 72px; z-index: 65;
      width: 360px; max-width: calc(100vw - 24px);
      height: 500px; max-height: calc(100vh - 110px);
      background: #ffffff; color: #0f172a;
      border: 1px solid rgba(15, 23, 42, 0.14); border-radius: 18px;
      box-shadow: 0 18px 46px rgba(15, 23, 42, 0.24);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    #nadia-drawer.open { display: flex; }
    .nc-head {
      background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff;
      padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;
    }
    .nc-head-left { display: flex; align-items: center; gap: 10px; }
    .nc-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.22); display: grid; place-items: center; font-size: 18px;
    }
    .nc-head h4 { font-size: 0.9rem; font-weight: 800; margin: 0; }
    .nc-head span { font-size: 0.7rem; opacity: 0.9; display: block; }
    .nc-head-btns { display: flex; gap: 6px; }
    .nc-icon-btn {
      background: rgba(255,255,255,0.2); border: none; color: #fff;
      border-radius: 8px; padding: 5px 8px; cursor: pointer; font-size: 0.75rem; font-weight: 700;
    }
    .nc-key-box {
      display: none; background: #f0f9ff; border-bottom: 1px solid #bae6fd;
      padding: 10px 12px; font-size: 0.74rem; color: #0c4a6e;
    }
    .nc-key-box.show { display: block; }
    .nc-key-row { display: flex; gap: 6px; margin-top: 6px; }
    .nc-key-row input {
      flex: 1; padding: 6px 8px; border-radius: 8px; border: 1px solid #7dd3fc;
      font-size: 0.75rem; font-family: inherit;
    }
    .nc-key-row button {
      background: #0284c7; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-size: 0.74rem; font-weight: 700; cursor: pointer;
    }
    .nc-msgs {
      flex: 1; overflow-y: auto; padding: 12px; background: #f8fafc;
      display: flex; flex-direction: column; gap: 9px;
    }
    .nc-msg {
      max-width: 84%; padding: 9px 12px; border-radius: 14px;
      font-size: 0.8rem; line-height: 1.45; white-space: pre-wrap; word-break: break-word;
    }
    .nc-msg.nadia {
      align-self: flex-start; background: #ffffff; color: #0f172a;
      border: 1px solid #e2e8f0; border-bottom-left-radius: 4px;
    }
    .nc-msg.bos {
      align-self: flex-end; background: #0ea5e9; color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .nc-meta { font-size: 0.65rem; opacity: 0.72; margin-top: 4px; display: block; text-align: right; }
    .nc-input-wrap {
      padding: 10px; background: #ffffff; border-top: 1px solid #e2e8f0;
      display: flex; gap: 8px; align-items: center;
    }
    .nc-input-wrap input {
      flex: 1; border: 1px solid #cbd5e1; border-radius: 10px; padding: 9px 11px;
      font-size: 0.8rem; font-family: inherit; outline: none;
    }
    .nc-input-wrap input:focus { border-color: #0ea5e9; }
    .nc-send {
      background: #0ea5e9; color: #fff; border: none; border-radius: 10px;
      padding: 9px 14px; font-weight: 800; font-size: 0.8rem; cursor: pointer;
    }
    .nc-send:disabled { opacity: 0.55; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.id = 'nadia-fab';
  fab.innerHTML = '💬 Chat Nadia (Asisten)';
  document.body.appendChild(fab);

  const drawer = document.createElement('div');
  drawer.id = 'nadia-drawer';
  drawer.innerHTML = `
    <div class="nc-head">
      <div class="nc-head-left">
        <div class="nc-avatar">👩‍💼</div>
        <div>
          <h4>Nadia — Asisten AI</h4>
          <span id="ncConnStatus">Memeriksa koneksi...</span>
        </div>
      </div>
      <div class="nc-head-btns">
        <button class="nc-icon-btn" id="ncKeyBtn" title="Atur Kunci Bos">🔑</button>
        <button class="nc-icon-btn" id="ncCloseBtn">✕</button>
      </div>
    </div>
    <div class="nc-key-box" id="ncKeyBox">
      <strong>🔑 Kunci Akses Bos (1x saja di HP/Laptop ini)</strong>
      <div>Tempel token GitHub Anda agar perintah dari perangkat ini langsung dieksekusi PC kantor (tersimpan lokal &amp; aman di perangkat ini saja).</div>
      <div class="nc-key-row">
        <input type="password" id="ncTokenInput" placeholder="github_pat_..." />
        <button id="ncSaveToken">Simpan</button>
      </div>
    </div>
    <div class="nc-msgs" id="ncMsgs"></div>
    <div class="nc-input-wrap">
      <input type="text" id="ncInput" placeholder="Tulis perintah untuk Nadia..." />
      <button class="nc-send" id="ncSend">Kirim</button>
    </div>
  `;
  document.body.appendChild(drawer);

  const keyBox = document.getElementById('ncKeyBox');
  const tokenInput = document.getElementById('ncTokenInput');
  const msgsEl = document.getElementById('ncMsgs');
  const inputEl = document.getElementById('ncInput');
  const sendBtn = document.getElementById('ncSend');
  const connStatus = document.getElementById('ncConnStatus');

  function getToken() { return (localStorage.getItem(TOKEN_KEY) || '').trim(); }
  function updateConnUI() {
    if (getToken()) {
      connStatus.textContent = '● Terhubung Real-Time ke PC Kantor';
    } else {
      connStatus.textContent = 'Mode Baca • Klik 🔑 untuk kirim perintah';
    }
  }

  let latestData = null;
  let latestSha = null;

  function renderMsgs(data) {
    latestData = data;
    const list = data.messages || [];
    msgsEl.innerHTML = list.map(m => {
      const cls = m.sender === 'bos' ? 'bos' : 'nadia';
      const st = m.sender === 'bos' ? (m.status === 'pending' ? ' • ⏳ Antre ke PC' : ' • ✅ Dieksekusi') : '';
      const safeText = String(m.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="nc-msg ${cls}">${safeText}<span class="nc-meta">${m.time || ''}${st}</span></div>`;
    }).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  async function loadChat() {
    const tok = getToken();
    try {
      if (tok) {
        const res = await fetch(`https://api.github.com/repos/${REPO}/contents/nadia-chat.json?ref=${BRANCH}&t=${Date.now()}`, {
          headers: { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json' }
        });
        if (res.ok) {
          const j = await res.json();
          latestSha = j.sha;
          const bytes = Uint8Array.from(atob(j.content.replace(/\n/g, '')), c => c.charCodeAt(0));
          const txt = new TextDecoder('utf-8').decode(bytes);
          renderMsgs(JSON.parse(txt));
          return;
        }
      }
      const r2 = await fetch('nadia-chat.json?t=' + Date.now());
      if (r2.ok) renderMsgs(await r2.json());
    } catch (e) {
      console.warn('Nadia chat load:', e);
    }
  }

  async function sendOrder() {
    const text = inputEl.value.trim();
    if (!text) return;
    const tok = getToken();
    if (!tok) {
      keyBox.classList.add('show');
      alert('Masukkan Kunci Bos (token GitHub) 1x terlebih dahulu di kotak atas agar perintah Anda bisa langsung dieksekusi PC kantor.');
      return;
    }
    sendBtn.disabled = true;
    sendBtn.textContent = '...';
    try {
      await loadChat();
      const data = latestData || { assistant: 'Nadia-Asisten AI', messages: [] };
      const now = new Date();
      const wita = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
      const hhmm = String(wita.getHours()).padStart(2, '0') + ':' + String(wita.getMinutes()).padStart(2, '0') + ' WITA';
      data.messages.push({
        id: 'bos_' + Date.now(),
        sender: 'bos',
        time: hhmm,
        text,
        status: 'pending'
      });
      data.messages = data.messages.slice(-60);
      data.updated_at = hhmm;

      const utf8Bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
      let bin = '';
      utf8Bytes.forEach(b => (bin += String.fromCharCode(b)));
      const b64 = btoa(bin);

      const body = {
        message: 'chat(bos): order to Nadia via Live Chat',
        content: b64,
        branch: BRANCH
      };
      if (latestSha) body.sha = latestSha;

      const put = await fetch(`https://api.github.com/repos/${REPO}/contents/nadia-chat.json`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + tok,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!put.ok) {
        const err = await put.text();
        alert('Gagal mengirim (cek Kunci Bos): ' + err.slice(0, 120));
      } else {
        inputEl.value = '';
        await loadChat();
      }
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Kirim';
    }
  }

  fab.onclick = () => {
    drawer.classList.add('open');
    fab.style.display = 'none';
    updateConnUI();
    loadChat();
  };
  document.getElementById('ncCloseBtn').onclick = () => {
    drawer.classList.remove('open');
    fab.style.display = 'inline-flex';
  };
  document.getElementById('ncKeyBtn').onclick = () => {
    keyBox.classList.toggle('show');
    tokenInput.value = getToken();
  };
  document.getElementById('ncSaveToken').onclick = () => {
    const val = tokenInput.value.trim();
    if (val) localStorage.setItem(TOKEN_KEY, val);
    else localStorage.removeItem(TOKEN_KEY);
    keyBox.classList.remove('show');
    updateConnUI();
    loadChat();
  };
  sendBtn.onclick = sendOrder;
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendOrder(); });

  updateConnUI();
  setInterval(() => { if (drawer.classList.contains('open')) loadChat(); }, 10000);
})();
