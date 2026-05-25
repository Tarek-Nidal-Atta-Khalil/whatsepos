import { formaSupabaseSignata } from './hexameter_active.js?v=20260525-macra-1';

const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-search-row {
  display:flex;
  align-items:flex-start;
  justify-content:center;
  gap:16px;
  width:min(100%, 980px);
  margin:0 auto;
}

.vocabularium-search-column {
  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
}

.vocabularium-search-column #vocabulariumQuaere {
  width:100%;
  margin:0;
}

.vocabularium-admin {
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0;
  flex-shrink:0;
}

.vocabularium-suggestio.is-selected {
  background:#eef2ff !important;
}

.vox-button {
  height:62px;
  padding:0 24px;
  border:none;
  border-radius:18px;
  background:#1faa4b;
  color:white;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:1rem;
  letter-spacing:0.01em;
  box-shadow:0 10px 24px rgba(0,0,0,0.16);
  transition:all 0.18s ease;
  white-space:nowrap;
}

.vox-button:hover {
  transform:translateY(-1px);
  box-shadow:0 14px 30px rgba(0,0,0,0.22);
}

.adde-uerbum-panel {
  width:min(100%, 980px);
  margin:0 auto 40px;
  padding:28px;
  background:white;
  border:1px solid #e5e7eb;
  border-radius:28px;
  box-shadow:0 14px 34px rgba(0,0,0,.08);
  text-align:left;
}

.adde-uerbum-panel[hidden] { display:none; }
.adde-uerbum-panel h2 { margin:0 0 18px; font-size:34px; }

.adde-uerbum-grid {
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:16px;
}

.adde-uerbum-verbum {
  display:grid;
  grid-template-columns:repeat(4, minmax(0, 1fr));
  gap:16px;
  margin-top:18px;
  padding-top:18px;
  border-top:1px solid #e5e7eb;
}

.adde-uerbum-verbum[hidden] { display:none; }

.adde-uerbum-field label {
  display:block;
  margin-bottom:6px;
  font-weight:700;
  color:#374151;
}

.adde-uerbum-field input,
.adde-uerbum-field select {
  width:100%;
  max-width:none;
  margin:0;
  border:2px solid #d1d5db;
  border-radius:16px;
  background:white;
}

.adde-uerbum-actions {
  display:flex;
  gap:12px;
  justify-content:flex-end;
  margin-top:20px;
}

.adde-uerbum-actions button {
  border-radius:16px;
}

.adde-uerbum-primary {
  border:none;
  background:#111827;
  color:white;
}

.adde-uerbum-secondary {
  border:2px solid #d1d5db;
  background:white;
  color:#374151;
}

.adde-uerbum-status {
  min-height:1.4em;
  margin-top:14px;
  color:#374151;
}

@media (max-width:900px) {
  .vocabularium-search-row { flex-direction:column; }
  .vocabularium-admin { width:100%; }
  .vox-button { width:100%; }
  .adde-uerbum-grid,
  .adde-uerbum-verbum { grid-template-columns:1fr; }
}
`;
document.head.appendChild(style);

const suggestiones = document.createElement('div');
suggestiones.id = 'vocabulariumSuggestiones';
suggestiones.style.display = 'none';
suggestiones.style.width = '100%';
suggestiones.style.margin = '8px 0 0';

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `
<button id="novumVerbumKnopf" type="button" class="vox-button">adde uerbum</button>
`;

const addePanel = document.createElement('section');
addePanel.id = 'addeUerbumPanel';
addePanel.className = 'adde-uerbum-panel';
addePanel.hidden = true;
addePanel.innerHTML = `
  <h2>Adde uerbum</h2>
  <div class="adde-uerbum-grid">
    <div class="adde-uerbum-field">
      <label for="addeForma">Forma</label>
      <input id="addeForma" type="text" placeholder="canō">
    </div>
    <div class="adde-uerbum-field">
      <label for="addeLemma">Lemma / Headword</label>
      <input id="addeLemma" type="text" placeholder="canō">
    </div>
    <div class="adde-uerbum-field">
      <label for="addePars">Pars orationis</label>
      <select id="addePars">
        <option value="substantivum">substantivum</option>
        <option value="adiectivum">adiectivum</option>
        <option value="verbum">verbum</option>
        <option value="adverbium">adverbium</option>
        <option value="nomen proprium">nomen proprium</option>
      </select>
    </div>
    <div class="adde-uerbum-field">
      <label for="addeSyllabae">Syllabae</label>
      <input id="addeSyllabae" type="text" placeholder="ca.no">
    </div>
    <div class="adde-uerbum-field">
      <label for="addeLongae">Longae</label>
      <input id="addeLongae" type="text" placeholder="1">
    </div>
  </div>

  <div id="addeLeitformen" class="adde-uerbum-verbum" hidden>
    <div class="adde-uerbum-field">
      <label for="addePraesens">Praesens</label>
      <input id="addePraesens" type="text" placeholder="canō">
    </div>
    <div class="adde-uerbum-field">
      <label for="addeInfinitivus">Infinitivus</label>
      <input id="addeInfinitivus" type="text" placeholder="canere">
    </div>
    <div class="adde-uerbum-field">
      <label for="addePerfectum">Perfectum</label>
      <input id="addePerfectum" type="text" placeholder="cecinī">
    </div>
    <div class="adde-uerbum-field">
      <label for="addeSupinum">Supinum</label>
      <input id="addeSupinum" type="text" placeholder="cantum">
    </div>
  </div>

  <div class="adde-uerbum-actions">
    <button id="addeCancel" type="button" class="adde-uerbum-secondary">revertere</button>
    <button id="addeSave" type="button" class="adde-uerbum-primary">servare</button>
  </div>
  <p id="addeStatus" class="adde-uerbum-status"></p>
`;

let row = null;
let suggestioSelectaIndex = -1;
let nullusEventusLemma = '';

if (input && vocabulariumTab) {
  row = document.createElement('div');
  row.className = 'vocabularium-search-row';

  const column = document.createElement('div');
  column.className = 'vocabularium-search-column';

  input.parentNode.insertBefore(row, input);
  row.appendChild(column);
  column.appendChild(input);
  column.appendChild(suggestiones);
  row.appendChild(adminBox);
  vocabulariumTab.appendChild(addePanel);
}

function normalisiere(textus) {
  return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

function suggestioButtons() {
  return Array.from(suggestiones.querySelectorAll('.vocabularium-suggestio'));
}

function setzeSuggestioSelecta(index) {
  const buttons = suggestioButtons();

  if (buttons.length === 0) {
    suggestioSelectaIndex = -1;
    return;
  }

  suggestioSelectaIndex = Math.max(0, Math.min(index, buttons.length - 1));

  buttons.forEach(function(button, i) {
    button.classList.toggle('is-selected', i === suggestioSelectaIndex);
    button.setAttribute('aria-selected', i === suggestioSelectaIndex ? 'true' : 'false');
  });

  buttons[suggestioSelectaIndex].scrollIntoView({ block: 'nearest' });
}

function leereSuggestiones() {
  suggestiones.innerHTML = '';
  suggestiones.style.display = 'none';
  suggestioSelectaIndex = -1;
  nullusEventusLemma = '';
}

function aperiLemma(lemma) {
  if (!lemma) return;
  window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
}

function statusAdde(textus) {
  const p = document.getElementById('addeStatus');
  if (p) p.textContent = textus || '';
}

function mutaLeitformen() {
  const pars = document.getElementById('addePars')?.value;
  const leitformen = document.getElementById('addeLeitformen');
  if (leitformen) leitformen.hidden = pars !== 'verbum';
}

function aperiAddeUerbum(lemmaPraeplenum = '') {
  leereSuggestiones();
  if (row) row.style.display = 'none';
  if (eventus) eventus.style.display = 'none';
  if (status) status.style.display = 'none';
  addePanel.hidden = false;

  const lemmaInput = document.getElementById('addeLemma');
  const formaInput = document.getElementById('addeForma');
  const parsInput = document.getElementById('addePars');

  if (lemmaPraeplenum) {
    lemmaInput.value = lemmaPraeplenum;
    formaInput.value = lemmaPraeplenum;
  }

  parsInput.value = 'verbum';
  mutaLeitformen();
  statusAdde('');
  lemmaInput.focus();
}

function schliesseAddeUerbum() {
  addePanel.hidden = true;
  if (row) row.style.display = 'flex';
  if (eventus) eventus.style.display = '';
  if (status) status.style.display = '';
  input?.focus();
}

function erzeugeAddeSuggestio(lemmaNeu) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'vocabularium-suggestio is-selected';
  button.dataset.action = 'adde';
  button.dataset.lemma = lemmaNeu;
  button.style.display = 'block';
  button.style.width = '100%';
  button.style.textAlign = 'left';
  button.style.padding = '14px 18px';
  button.style.border = 'none';
  button.style.background = 'white';
  button.style.cursor = 'pointer';
  button.style.borderBottom = '1px solid #eee';
  button.innerHTML = `<strong>${lemmaNeu}</strong> <span style="color:#6b7280">adde ut nouum headword</span>`;
  button.addEventListener('mousedown', function(event) {
    event.preventDefault();
    aperiAddeUerbum(lemmaNeu);
  });
  suggestiones.appendChild(button);
  suggestiones.style.display = 'block';
  suggestioSelectaIndex = 0;
}

function oeffneSuggestioSelecta() {
  const button = suggestioButtons()[suggestioSelectaIndex];
  const lemma = button?.dataset?.lemma;
  if (!lemma) return;
  if (button.dataset.action === 'adde') aperiAddeUerbum(lemma);
  else aperiLemma(lemma);
}

async function quaereSuggestiones() {
  if (!window.whatseposSupabase || !input) return;

  const qOriginal = input.value.trim();
  const q = normalisiere(qOriginal);
  leereSuggestiones();

  if (q.length < 2) return;

  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('forma, lemma, pars_orationis, syllabae, longae')
    .ilike('lemma', `${q}%`)
    .limit(10);

  if (error) return;

  if (!data || !data.length) {
    nullusEventusLemma = qOriginal;
    erzeugeAddeSuggestio(qOriginal);
    return;
  }

  const visa = new Set();

  data.forEach(item => {
    if (!item.lemma || visa.has(item.lemma)) return;
    visa.add(item.lemma);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vocabularium-suggestio';
    button.dataset.lemma = item.lemma;
    button.setAttribute('role', 'option');
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.textAlign = 'left';
    button.style.padding = '14px 18px';
    button.style.border = 'none';
    button.style.background = 'white';
    button.style.cursor = 'pointer';
    button.style.borderBottom = '1px solid #eee';

    const lemmaSignatum = formaSupabaseSignata({ ...item, forma: item.lemma });
    const lemmaStrong = document.createElement('strong');
    lemmaStrong.textContent = lemmaSignatum || item.lemma;

    const parsSpan = document.createElement('span');
    parsSpan.style.color = '#6b7280';
    parsSpan.textContent = ` ${item.pars_orationis || ''}`;

    button.appendChild(lemmaStrong);
    button.appendChild(parsSpan);

    button.addEventListener('mouseenter', function() {
      const index = suggestioButtons().indexOf(button);
      if (index >= 0) setzeSuggestioSelecta(index);
    });

    button.addEventListener('mousedown', function(event) {
      event.preventDefault();
      aperiLemma(item.lemma);
    });

    suggestiones.appendChild(button);
  });

  if (suggestiones.children.length > 0) {
    suggestiones.style.display = 'block';
    setzeSuggestioSelecta(0);
  }
}

async function speichereAddeFormular() {
  if (!window.whatseposSupabase) return;
  const forma = document.getElementById('addeForma')?.value.trim();
  const lemma = document.getElementById('addeLemma')?.value.trim();
  const pars = document.getElementById('addePars')?.value;
  const syllabae = document.getElementById('addeSyllabae')?.value.trim() || null;
  const longae = document.getElementById('addeLongae')?.value.trim() || null;

  if (!forma || !lemma || !pars) {
    statusAdde('Forma, lemma et pars orationis necessaria sunt.');
    return;
  }

  const { error } = await window.whatseposSupabase
    .from('formae')
    .insert([{ forma, lemma, pars_orationis: pars, syllabae, longae }]);

  if (error) {
    statusAdde(error.message);
    return;
  }

  statusAdde('Servatum est.');
}

const zeigeTabOriginal = window.zeigeTab;
const scriptoriumTitulus = document.querySelector('.container > h1');

window.zeigeTab = async function(tabName) {
  if (typeof zeigeTabOriginal === 'function') {
    await zeigeTabOriginal(tabName);
  }

  if (tabName === 'vocabularium') {
    if (row && addePanel.hidden) row.style.display = 'flex';
    if (scriptoriumTitulus) scriptoriumTitulus.textContent = 'Uocabularium';
  } else {
    if (row) row.style.display = 'none';
    addePanel.hidden = true;
    if (scriptoriumTitulus) scriptoriumTitulus.textContent = 'Scriptorium';
  }
};

if (input) {
  let timer = null;

  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(quaereSuggestiones, 150);
  });

  input.addEventListener('keydown', function(event) {
    const buttons = suggestioButtons();

    if (event.key === 'ArrowDown' && buttons.length > 0) {
      event.preventDefault();
      setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? 0 : suggestioSelectaIndex + 1);
      return;
    }

    if (event.key === 'ArrowUp' && buttons.length > 0) {
      event.preventDefault();
      setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? buttons.length - 1 : suggestioSelectaIndex - 1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (buttons.length > 0) {
        if (suggestioSelectaIndex < 0) setzeSuggestioSelecta(0);
        oeffneSuggestioSelecta();
      } else if (input.value.trim()) {
        aperiAddeUerbum(input.value.trim());
      }
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(function() {
      if (addePanel.hidden) leereSuggestiones();
    }, 120);
  });
}

document.getElementById('novumVerbumKnopf')?.addEventListener('click', function() {
  aperiAddeUerbum(nullusEventusLemma || input?.value.trim() || '');
});

document.getElementById('addePars')?.addEventListener('change', mutaLeitformen);
document.getElementById('addeCancel')?.addEventListener('click', schliesseAddeUerbum);
document.getElementById('addeSave')?.addEventListener('click', speichereAddeFormular);
