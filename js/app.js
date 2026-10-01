/* ============ DATI INIZIALI ============ */
const DATA_INIZIALE = {
  categorie: [
    {
      id: 'saldatura',
      nome: 'Saldatura',
      icona: '🔥',
      regole: [
        'Controlla sempre il diametro del filo prima di dare la punta.',
        "Chiedi sempre l'attacco della pistola (6 o 8).",
        'Le punte di rame si consumano, non sono difettose.'
      ],
      articoli: [
        {
          id: 'punta-guida-filo',
          nome: 'Punta Guida Filo',
          foto: [],
          descrizione: 'Serve per guidare il filo e passare la corrente.',
          comeSiSceglie: ['Attacco: <b>6</b> o <b>8</b>', 'Lunghezza: <b>25</b>, <b>28</b>, <b>30</b>'],
          errori: ['Dare la punta sbagliata rispetto al filo del cliente.'],
          audioDurata: '0:00'
        }
      ]
    },
    { id: 'idraulica', nome: 'Idraulica', icona: '🔧', regole: ['Regola in arrivo...'], articoli: [] },
    { id: 'utensili', nome: 'Utensili', icona: '🪚', regole: ['Regola in arrivo...'], articoli: [] },
    { id: 'bulloneria', nome: 'Bulloneria', icona: '🔩', regole: ['Regola in arrivo...'], articoli: [] },
    { id: 'vinicoltura', nome: 'Vinicoltura', icona: '🍇', regole: ['Regola in arrivo...'], articoli: [] },
    { id: 'stufe', nome: 'Stufe', icona: '🏠', regole: ['Regola in arrivo...'], articoli: [] },
    { id: 'pompe', nome: 'Pompe', icona: '💧', regole: ['Regola in arrivo...'], articoli: [] }
  ]
};

let DATA = JSON.parse(localStorage.getItem('rattazzi_data_v2'));
if (!DATA) {
  DATA = JSON.parse(JSON.stringify(DATA_INIZIALE));
  salvaDati();
}

function salvaDati() {
  try { localStorage.setItem('rattazzi_data_v2', JSON.stringify(DATA)); }
  catch(e) { toast('⚠️ Memoria piena! Esporta e libera spazio.'); }
}

const state = { screen: 'home', categoriaId: null, articoloId: null, history: [] };

function navHome() {
  state.screen = 'home'; state.categoriaId = null; state.articoloId = null; state.history = []; render();
}
function apriCategoria(id) {
  if (state.screen !== 'home') state.history.push({ screen: state.screen, categoriaId: state.categoriaId, articoloId: state.articoloId });
  state.screen = 'categoria'; state.categoriaId = id; state.articoloId = null; render();
}
function apriArticolo(catId, artId) {
  state.history.push({ screen: state.screen, categoriaId: state.categoriaId, articoloId: state.articoloId });
  state.screen = 'articolo'; state.categoriaId = catId; state.articoloId = artId; render();
}
function goBack() {
  if (state.history.length > 0) {
    const prev = state.history.pop();
    state.screen = prev.screen; state.categoriaId = prev.categoriaId; state.articoloId = prev.articoloId; render();
  } else navHome();
}

function render() {
  const main = document.getElementById('main');
  const title = document.getElementById('header-title');
  const logo = document.getElementById('header-logo');
  const btnBack = document.getElementById('btn-back');
  const btnSearch = document.getElementById('btn-search');

  if (state.screen === 'home') {
    logo.style.display = 'block'; title.style.display = 'none';
    btnBack.style.display = 'none'; btnSearch.style.display = 'block';
    main.innerHTML = renderHome();
  } else if (state.screen === 'categoria') {
    const cat = DATA.categorie.find(c => c.id === state.categoriaId);
    logo.style.display = 'none'; title.style.display = 'flex';
    title.innerHTML = cat.icona + ' ' + cat.nome;
    btnBack.style.display = 'block'; btnSearch.style.display = 'none';
    main.innerHTML = renderCategoria(cat);
  } else if (state.screen === 'articolo') {
    const cat = DATA.categorie.find(c => c.id === state.categoriaId);
    const art = cat.articoli.find(a => a.id === state.articoloId);
    logo.style.display = 'none'; title.style.display = 'flex';
    title.textContent = art.nome;
    btnBack.style.display = 'block'; btnSearch.style.display = 'none';
    main.innerHTML = renderArticolo(cat, art);
  }

  document.querySelectorAll('nav.bottom button').forEach(b => b.classList.remove('active'));
  if (state.screen === 'home') document.querySelector('nav.bottom button[data-nav="home"]')?.classList.add('active');
  main.scrollTop = 0;
}

function renderHome() {
  let html = '<div class="screen">';
  html += '<div class="section-title"><span>📂 Categorie</span><button class="btn-add" data-action="add-categoria">➕</button></div>';
  html += '<div class="list">';
  DATA.categorie.forEach(cat => {
    html += `<button class="list-item" data-action="open-cat" data-id="${cat.id}">
      <span class="emoji">${cat.icona}</span><span class="label">${cat.nome}</span><span class="arrow">›</span>
    </button>`;
  });
  html += '</div>';
  html += '<p style="text-align:center;color:var(--text-soft);font-size:13px;margin-top:20px;font-style:italic;">💡 Tieni premuto su una categoria per modificarla</p>';
  html += '</div>';
  return html;
}

function renderCategoria(cat) {
  let html = '<div class="screen">';
  html += `<div class="card" data-action="edit-regole">
    <h3>📜 Regole della categoria <span class="edit-hint">✏️</span></h3>
    <ul>${cat.regole.map(r => `<li>${r}</li>`).join('')}</ul>
  </div>`;
  html += '<div class="section-title"><span>📦 Articoli</span><button class="btn-add" data-action="add-articolo">➕</button></div>';
  if (cat.articoli.length === 0) {
    html += '<div class="empty">Nessun articolo ancora.<br>Clicca ➕ per aggiungerne uno!</div>';
  } else {
    html += '<div class="list">';
    cat.articoli.forEach(art => {
      html += `<button class="list-item" data-action="open-art" data-cat="${cat.id}" data-id="${art.id}">
        <span class="emoji">🔹</span><span class="label">${art.nome}</span><span class="arrow">›</span>
      </button>`;
    });
    html += '</div>';
  }
  html += '<p style="text-align:center;color:var(--text-soft);font-size:13px;margin-top:20px;font-style:italic;">💡 Tieni premuto per modificare</p>';
  html += '</div>';
  return html;
}

function renderArticolo(cat, art) {
  let html = '<div class="screen">';

  html += '<div class="section-title"><span>📸 Foto</span></div>';
  html += '<div class="carousel">';
  art.foto.forEach((f, index) => {
    html += `<div class="photo" data-action="photo-menu" data-index="${index}">
      <img src="${f.url}" alt=""><span class="ph-label">${f.label || 'Foto ' + (index+1)}</span>
    </div>`;
  });
  html += `<div class="photo photo-add" data-action="add-foto">
    <span class="ph-emoji">📷</span><span class="ph-label">Aggiungi foto</span>
  </div>`;
  html += '</div>';

  html += '<div class="section-title"><span>🎙️ Ascolta la spiegazione</span></div>';
  html += `<div class="audio-player" data-action="audio-menu">
    <button class="play-btn" id="play-btn">▶️</button>
    <div class="audio-info">
      <div class="audio-title">Spiegazione di ${art.nome}</div>
      <div class="audio-time">${art.audioDurata || '0:00'}</div>
      <div class="progress-bar"><div class="fill"></div></div>
    </div>
  </div>`;

  html += `<button class="btn-paste" data-action="paste-info">
    📋 Incolla info (Descrizione, Come si sceglie, Errori)
  </button>`;

  html += `<div class="card" data-action="edit-descrizione">
    <h3>📝 Descrizione <span class="edit-hint">✏️</span></h3>
    <p>${art.descrizione}</p>
  </div>`;

  html += `<div class="card" data-action="edit-come">
    <h3>🎯 Come si sceglie <span class="edit-hint">✏️</span></h3>
    <ul>${art.comeSiSceglie.map(c => `<li>${c}</li>`).join('')}</ul>
  </div>`;

  html += `<div class="card" data-action="edit-errori" style="border-left-color:var(--danger);">
    <h3 style="color:var(--danger);">⚠️ Errori comuni <span class="edit-hint">✏️</span></h3>
    <ul>${art.errori.map(e => `<li>${e}</li>`).join('')}</ul>
  </div>`;

  html += '<p style="text-align:center;color:var(--text-soft);font-size:13px;margin-top:4px;font-style:italic;">💡 Tieni premuto su un elemento per modificarlo</p>';
  html += '</div>';
  return html;
}

/* ============ LONG PRESS ============ */
let pressTimer = null;
let longPressTriggered = false;
let longPressJustHappened = false;
const LONG_PRESS_MS = 550;

function handlePressStart(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  longPressTriggered = false;
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    longPressTriggered = true;
    if (navigator.vibrate) navigator.vibrate(30);
    openContextMenu(target);
  }, LONG_PRESS_MS);
}
function handlePressEnd() {
  clearTimeout(pressTimer);
  if (longPressTriggered) {
    longPressJustHappened = true;
    setTimeout(() => { longPressJustHappened = false; }, 450);
    longPressTriggered = false;
  }
}

const mainEl = document.getElementById('main');
mainEl.addEventListener('touchstart', handlePressStart, { passive: true });
mainEl.addEventListener('touchend', handlePressEnd);
mainEl.addEventListener('touchcancel', handlePressEnd);
mainEl.addEventListener('touchmove', handlePressEnd);
mainEl.addEventListener('mousedown', handlePressStart);
mainEl.addEventListener('mouseup', handlePressEnd);
mainEl.addEventListener('mouseleave', handlePressEnd);
document.addEventListener('contextmenu', e => { if (e.target.closest('[data-action]')) e.preventDefault(); });

mainEl.addEventListener('click', (e) => {
  if (longPressJustHappened) { e.preventDefault(); e.stopPropagation(); return; }
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const d = target.dataset;
  switch(action) {
    case 'open-cat': apriCategoria(d.id); break;
    case 'open-art': apriArticolo(d.cat, d.id); break;
    case 'add-categoria': aggiungiCategoria(); break;
    case 'add-articolo': aggiungiArticolo(); break;
    case 'add-foto': attivaInputFoto(); break;
    case 'audio-menu': toggleAudio(); break;
    case 'paste-info': apriPasteInfo(); break;
  }
});

/* ============ CONTEXT MENU ============ */
function openContextMenu(target) {
  const action = target.dataset.action;
  const d = target.dataset;

  if (action === 'edit-regole') { editRegole(); return; }
  if (action === 'edit-descrizione') { editDescrizione(); return; }
  if (action === 'edit-come') { editCome(); return; }
  if (action === 'edit-errori') { editErrori(); return; }

  if (action === 'open-cat') {
    const cat = DATA.categorie.find(c => c.id === d.id);
    const index = DATA.categorie.indexOf(cat);
    const vuota = cat.articoli.length === 0;
    const options = [
      { icon: '✏️', label: 'Rinomina categoria', cb: () => editCategoria(cat) },
      { icon: '⬆️', label: 'Sposta su', cb: () => spostaCategoria(index, -1), disabled: index === 0 },
      { icon: '⬇️', label: 'Sposta giù', cb: () => spostaCategoria(index, 1), disabled: index === DATA.categorie.length - 1 },
    ];
    if (vuota) options.push({ icon: '🗑️', label: 'Elimina categoria', danger: true, cb: () => eliminaCategoria(cat) });
    openSheet(cat.icona + ' ' + cat.nome, options);
    return;
  }

  if (action === 'open-art') {
    const cat = DATA.categorie.find(c => c.id === d.cat);
    const art = cat.articoli.find(a => a.id === d.id);
    const vuoto = art.foto.length === 0
      && art.descrizione === 'Descrizione in arrivo...'
      && art.comeSiSceglie.join('') === 'Dettaglio in arrivo...'
      && art.errori.join('') === 'Errore in arrivo...';
    openSheet(art.nome, [
      { icon: '✏️', label: 'Rinomina articolo', cb: () => editArticoloNome(cat, art) },
      { icon: '🗑️', label: vuoto ? 'Elimina articolo (vuoto)' : 'Elimina articolo', danger: true, cb: () => eliminaArticolo(cat, art, vuoto) }
    ]);
    return;
  }

  if (action === 'photo-menu') {
    const cat = DATA.categorie.find(c => c.id === state.categoriaId);
    const art = cat.articoli.find(a => a.id === state.articoloId);
    const index = parseInt(d.index);
    openSheet('📸 Foto ' + (index+1), [
      { icon: '🗑️', label: 'Elimina questa foto', danger: true, cb: () => eliminaFoto(art, index) }
    ]);
    return;
  }

  if (action === 'audio-menu') {
    const cat = DATA.categorie.find(c => c.id === state.categoriaId);
    const art = cat.articoli.find(a => a.id === state.articoloId);
    openSheet('🎙️ Audio', [
      { icon: '🗑️', label: 'Elimina audio', danger: true, cb: () => eliminaAudio(art) }
    ]);
    return;
  }
}

function openSheet(title, options) {
  document.getElementById('sheet-title').textContent = title || '';
  const container = document.getElementById('sheet-options');
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'sheet-option' + (opt.danger ? ' danger' : '');
    btn.innerHTML = `<span class="opt-icon">${opt.icon}</span><span>${opt.label}</span>`;
    if (!opt.disabled) btn.onclick = () => { closeSheet(); setTimeout(() => opt.cb(), 100); };
    else { btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none'; }
    container.appendChild(btn);
  });
  document.getElementById('sheet-overlay').classList.add('show');
}
function closeSheet(e) {
  if (e && e.target !== document.getElementById('sheet-overlay')) return;
  document.getElementById('sheet-overlay').classList.remove('show');
}

/* ============ MODAL ============ */
let modalSaveCallback = null;

function openModal({ title, desc, fields, onSave, confirmText, danger }) {
  document.getElementById('modal-title').textContent = title;
  const descEl = document.getElementById('modal-desc');
  if (desc) { descEl.innerHTML = desc; descEl.style.display = 'block'; }
  else descEl.style.display = 'none';

  const body = document.getElementById('modal-body');
  body.innerHTML = '';
  const inputs = {};

  fields.forEach(f => {
    const label = document.createElement('label');
    label.textContent = f.label;
    body.appendChild(label);
    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.value = f.value || '';
      if (f.big) input.classList.add('big');
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.value = f.value || '';
      if (f.maxlength) input.maxLength = f.maxlength;
    }
    input.dataset.key = f.key;
    body.appendChild(input);
    inputs[f.key] = input;
  });

  const confirmBtn = document.getElementById('modal-confirm');
  confirmBtn.textContent = confirmText || 'Salva';
  confirmBtn.style.background = danger ? 'var(--danger)' : 'var(--accent)';
  confirmBtn.style.color = danger ? '#fff' : '#1a1a1a';

  modalSaveCallback = () => {
    const values = {};
    Object.keys(inputs).forEach(k => values[k] = inputs[k].value);
    onSave(values);
  };

  document.getElementById('modal-overlay').classList.add('show');
  setTimeout(() => {
    const first = body.querySelector('textarea, input');
    if (first) first.focus();
  }, 300);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
  modalSaveCallback = null;
}

document.getElementById('modal-confirm').onclick = () => {
  if (modalSaveCallback) modalSaveCallback();
};
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

/* ============ CRUD ============ */
function aggiungiCategoria() {
  openModal({
    title: '➕ Nuova categoria',
    fields: [
      { key: 'icona', label: 'Emoji', value: '🔧', maxlength: 4 },
      { key: 'nome', label: 'Nome categoria', value: '' }
    ],
    onSave: (v) => {
      if (!v.nome.trim()) { toast('⚠️ Inserisci un nome'); return; }
      const id = v.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      DATA.categorie.push({ id, nome: v.nome.trim(), icona: v.icona || '📦', regole: ['Regola in arrivo...'], articoli: [] });
      salvaDati(); render(); closeModal(); toast('✅ Categoria aggiunta!');
    }
  });
}

function editCategoria(cat) {
  openModal({
    title: '✏️ Modifica categoria',
    fields: [
      { key: 'icona', label: 'Emoji', value: cat.icona, maxlength: 4 },
      { key: 'nome', label: 'Nome categoria', value: cat.nome }
    ],
    onSave: (v) => {
      if (!v.nome.trim()) { toast('⚠️ Inserisci un nome'); return; }
      cat.icona = v.icona || '📦'; cat.nome = v.nome.trim();
      salvaDati(); render(); closeModal(); toast('✅ Modificata!');
    }
  });
}

function spostaCategoria(index, dir) {
  const nuovo = index + dir;
  if (nuovo < 0 || nuovo >= DATA.categorie.length) return;
  const temp = DATA.categorie[index];
  DATA.categorie[index] = DATA.categorie[nuovo];
  DATA.categorie[nuovo] = temp;
  salvaDati(); render(); toast(dir < 0 ? '⬆️ Spostata su' : '⬇️ Spostata giù');
}

function eliminaCategoria(cat) {
  openModal({
    title: '🗑️ Elimina categoria',
    desc: 'Vuoi davvero eliminare <b style="color:var(--danger)">' + cat.nome + '</b>?',
    fields: [],
    confirmText: 'Elimina', danger: true,
    onSave: () => {
      DATA.categorie = DATA.categorie.filter(c => c.id !== cat.id);
      salvaDati(); render(); closeModal(); toast('🗑️ Eliminata');
    }
  });
}

function editRegole() {
  const cat = DATA.categorie.find(c => c.id === state.categoriaId);
  openModal({
    title: '📜 Regole categoria',
    desc: 'Una regola per riga.',
    fields: [{ key: 'regole', label: 'Regole', type: 'textarea', value: cat.regole.join('\n') }],
    onSave: (v) => {
      cat.regole = v.regole.split('\n').map(s => s.trim()).filter(Boolean);
      if (cat.regole.length === 0) cat.regole = ['Regola in arrivo...'];
      salvaDati(); render(); closeModal(); toast('✅ Regole salvate');
    }
  });
}

function aggiungiArticolo() {
  openModal({
    title: '➕ Nuovo articolo',
    fields: [{ key: 'nome', label: 'Nome articolo', value: '' }],
    onSave: (v) => {
      if (!v.nome.trim()) { toast('⚠️ Inserisci un nome'); return; }
      const cat = DATA.categorie.find(c => c.id === state.categoriaId);
      const id = v.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      cat.articoli.push({
        id, nome: v.nome.trim(), foto: [],
        descrizione: 'Descrizione in arrivo...',
        comeSiSceglie: ['Dettaglio in arrivo...'],
        errori: ['Errore in arrivo...'],
        audioDurata: '0:00'
      });
      salvaDati(); render(); closeModal(); toast('✅ Articolo aggiunto!');
    }
  });
}

function editArticoloNome(cat, art) {
  openModal({
    title: '✏️ Rinomina articolo',
    fields: [{ key: 'nome', label: 'Nome articolo', value: art.nome }],
    onSave: (v) => {
      if (!v.nome.trim()) { toast('⚠️ Inserisci un nome'); return; }
      art.nome = v.nome.trim();
      salvaDati(); render(); closeModal(); toast('✅ Rinominato');
    }
  });
}

function eliminaArticolo(cat, art, vuoto) {
  openModal({
    title: '🗑️ Elimina articolo',
    desc: vuoto ? 'Eliminare questo articolo vuoto?' : '⚠️ Questo articolo contiene dati. Eliminarlo comunque?',
    fields: [],
    confirmText: 'Elimina', danger: true,
    onSave: () => {
      cat.articoli = cat.articoli.filter(a => a.id !== art.id);
      if (state.screen === 'articolo') state.screen = 'categoria';
      salvaDati(); render(); closeModal(); toast('🗑️ Eliminato');
    }
  });
}

function editDescrizione() {
  const cat = DATA.categorie.find(c => c.id === state.categoriaId);
  const art = cat.articoli.find(a => a.id === state.articoloId);
  openModal({
    title: '📝 Descrizione',
    fields: [{ key: 'desc', label: 'Testo', type: 'textarea', value: art.descrizione }],
    onSave: (v) => {
      art.descrizione = v.desc.trim() || 'Descrizione in arrivo...';
      salvaDati(); render(); closeModal(); toast('✅ Salvato');
    }
  });
}

function editCome() {
  const cat = DATA.categorie.find(c => c.id === state.categoriaId);
  const art = cat.articoli.find(a => a.id === state.articoloId);
  openModal({
    title: '🎯 Come si sceglie',
    desc: 'Una voce per riga.',
    fields: [{ key: 'come', label: 'Voci', type: 'textarea', value: art.comeSiSceglie.join('\n') }],
    onSave: (v) => {
      art.comeSiSceglie = v.come.split('\n').map(s => s.trim()).filter(Boolean);
      if (art.comeSiSceglie.length === 0) art.comeSiSceglie = ['Dettaglio in arrivo...'];
      salvaDati(); render(); closeModal(); toast('✅ Salvato');
    }
  });
}

function editErrori() {
  const cat = DATA.categorie.find(c => c.id === state.categoriaId);
  const art = cat.articoli.find(a => a.id === state.articoloId);
  openModal({
    title: '⚠️ Errori comuni',
    desc: 'Un errore per riga.',
    fields: [{ key: 'errori', label: 'Errori', type: 'textarea', value: art.errori.join('\n') }],
    onSave: (v) => {
      art.errori = v.errori.split('\n').map(s => s.trim()).filter(Boolean);
      if (art.errori.length === 0) art.errori = ['Errore in arrivo...'];
      salvaDati(); render(); closeModal(); toast('✅ Salvato');
    }
  });
}

/* ============ INCOLLA INFO ============ */
function apriPasteInfo() {
  const esempio = `📝 DESCRIZIONE
Testo della descrizione.

🎯 COME SI SCEGLIE
- voce 1
- voce 2

⚠️ ERRORI
- errore 1
- errore 2`;

  openModal({
    title: '📋 Incolla info',
    desc: 'Incolla qui il testo con <b style="color:var(--accent-orange)">DESCRIZIONE</b>, <b style="color:var(--accent-orange)">COME SI SCEGLIE</b> e <b style="color:var(--accent-orange)">ERRORI</b>. Le sezioni mancanti non verranno toccate.',
    fields: [{ key: 'testo', label: 'Testo da incollare', type: 'textarea', value: esempio, big: true }],
    confirmText: 'Distribuisci',
    onSave: (v) => {
      const result = parseInfo(v.testo);
      if (!result.ok) { toast('⚠️ ' + result.msg); return; }
      const cat = DATA.categorie.find(c => c.id === state.categoriaId);
      const art = cat.articoli.find(a => a.id === state.articoloId);
      if (result.descrizione) art.descrizione = result.descrizione;
      if (result.comeSiSceglie) art.comeSiSceglie = result.comeSiSceglie;
      if (result.errori) art.errori = result.errori;
      salvaDati(); render(); closeModal();
      toast('✅ Info distribuite!');
    }
  });
}

function parseInfo(text) {
  if (!text || !text.trim()) return { ok: false, msg: 'Testo vuoto' };

  const lines = text.split('\n');
  let section = null;
  const out = { descrizione: [], comeSiSceglie: [], errori: [] };

  const reDesc = /^(?:[^\w]*)?DESCRIZIONE\s*:?\s*$/i;
  const reCome = /^(?:[^\w]*)?COME\s+SI\s+SCEGLIE\s*:?\s*$/i;
  const reErr  = /^(?:[^\w]*)?ERRORI(?:\s+COMUNI)?\s*:?\s*$/i;

  for (let raw of lines) {
    const line = raw.replace(/\s+$/,'');
    const trimmed = line.trim();
    if (reDesc.test(trimmed)) { section = 'descrizione'; continue; }
    if (reCome.test(trimmed)) { section = 'comeSiSceglie'; continue; }
    if (reErr.test(trimmed))  { section = 'errori'; continue; }
    if (!section) continue;
    if (trimmed === '') {
      if (section === 'descrizione') out.descrizione.push('');
      continue;
    }
    if (section === 'descrizione') {
      out.descrizione.push(trimmed);
    } else {
      out[section].push(trimmed.replace(/^[-•*·]\s*/, ''));
    }
  }

  const result = { ok: true };
  const descText = out.descrizione.join('\n').trim();
  if (descText) result.descrizione = descText;
  if (out.comeSiSceglie.length) result.comeSiSceglie = out.comeSiSceglie;
  if (out.errori.length) result.errori = out.errori;

  if (!result.descrizione && !result.comeSiSceglie && !result.errori) {
    return { ok: false, msg: 'Nessuna sezione riconosciuta. Usa DESCRIZIONE / COME SI SCEGLIE / ERRORI.' };
  }
  return result;
}

/* ============ FOTO / AUDIO ============ */
const CLOUDINARY_CLOUD_NAME = 'c8i3qkht';
const CLOUDINARY_UPLOAD_PRESET = 'rattazzi';

function attivaInputFoto() { document.getElementById('file-input').click(); }

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  toast('⏳ Caricamento foto in corso...');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    // Invia la foto a Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    // Se Cloudinary ci restituisce il link della foto
    if (data.secure_url) {
      const cat = DATA.categorie.find(c => c.id === state.categoriaId);
      const art = cat.articoli.find(a => a.id === state.articoloId);
      
      // Salviamo il LINK della foto, non la foto intera!
      art.foto.push({ 
        url: data.secure_url, 
        label: 'La mia foto' 
      });
      
      salvaDati(); // Salva in localStorage
      render(); // Aggiorna l'interfaccia
      toast('📸 Foto caricata!');
    } else {
      throw new Error(data.error?.message || 'Errore sconosciuto');
    }
  } catch (error) {
    console.error(error);
    toast('❌ Errore: ' + error.message);
  }
  
  event.target.value = ''; // Pulisce l'input
}

/* ============ EXPORT ============ */
function esportaDati() {
  const json = JSON.stringify(DATA, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(json).then(() => toast('✅ Dati copiati! Incollali in chat.')).catch(() => showExportModal(json));
  } else showExportModal(json);
}

function showExportModal(json) {
  const main = document.getElementById('main');
  const safe = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  main.innerHTML = `<div class="screen">
    <div class="section-title"><span>📥 Esporta dati</span></div>
    <div class="card" style="cursor:default;">
      <h3>✅ Copia questi dati</h3>
      <p>Tieni premuto e seleziona tutto, poi copia.</p>
      <textarea style="width:100%;height:300px;font-family:monospace;font-size:13px;padding:10px;border-radius:8px;border:1px solid #444;background:#1a1a1a;color:#ffe600;" readonly>${safe}</textarea>
    </div>
    <button class="list-item" onclick="render()" style="justify-content:center;">
      <span class="label" style="text-align:center;">⬅️ Torna indietro</span>
    </button>
  </div>`;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============ CLOUD (FIRESTORE) ============ */
async function salvaSuCloud() {
  if (!window.firebaseDb) {
    toast('⚠️ Firebase non ancora pronto.');
    return;
  }
  try {
    toast('⏳ Salvataggio in corso...');
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    // Usiamo un ID fisso per il documento, così è sempre lo stesso
    await setDoc(doc(window.firebaseDb, "memoriale", "dati_rattazzi"), DATA);
    toast('☁️ Salvato sul cloud!');
  } catch (e) {
    console.error(e);
    toast('❌ Errore: ' + e.message);
  }
}

async function caricaDaCloud() {
  if (!window.firebaseDb) {
    toast('⚠️ Firebase non ancora pronto.');
    return;
  }
  try {
    toast('⏳ Caricamento in corso...');
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
    const docRef = doc(window.firebaseDb, "memoriale", "dati_rattazzi");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      DATA = docSnap.data();
      salvaDati(); // Salva anche in locale
      render(); // Aggiorna l'interfaccia
      toast('📥 Dati caricati dal cloud!');
    } else {
      toast('⚠️ Nessun dato trovato sul cloud.');
    }
  } catch (e) {
    console.error(e);
    toast('❌ Errore: ' + e.message);
  }
}

render();
setTimeout(() => toast('💡 Tieni premuto per modificare!'), 800);