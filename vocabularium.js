import { formaSupabaseSignata } from './hexameter_active.js?v=20260525-macra-1';

const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-search-row{display:flex;align-items:flex-start;justify-content:center;gap:16px;width:min(100%,980px);margin:0 auto}.vocabularium-search-column{flex:1;min-width:0;display:flex;flex-direction:column}.vocabularium-search-column #vocabulariumQuaere{width:100%;margin:0}.vocabularium-admin{display:flex;align-items:center;justify-content:center;margin:0;flex-shrink:0}.vocabularium-suggestio.is-selected{background:#eef2ff!important}.vox-button{height:62px;padding:0 24px;border:none;border-radius:18px;background:#1faa4b;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;letter-spacing:.01em;box-shadow:0 10px 24px rgba(0,0,0,.16);transition:all .18s ease;white-space:nowrap}.vox-button:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(0,0,0,.22)}
.adde-uerbum-panel{width:min(100%,760px);margin:0 auto 48px;padding:0;background:#f8fafc;text-align:left;border-radius:28px}.adde-uerbum-panel[hidden]{display:none}.adde-form-head{background:white;border-top:10px solid #673ab7;border-radius:14px;padding:28px 32px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}.adde-form-head h2{margin:0 0 8px;font-size:34px}.adde-form-head p{margin:0;color:#6b7280}.adde-form-card{background:white;border-radius:14px;padding:24px 32px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}.adde-form-card[hidden]{display:none}.adde-uerbum-field label{display:block;margin-bottom:10px;font-weight:700;color:#202124}.adde-uerbum-field input,.adde-uerbum-field select{width:100%;max-width:none;margin:0;border:none;border-bottom:2px solid #dadce0;border-radius:0;background:white;padding:10px 0;font-size:22px}.adde-uerbum-field input:focus,.adde-uerbum-field select:focus{outline:none;border-bottom-color:#673ab7;box-shadow:none}.adde-card-help{margin-top:8px;color:#6b7280;font-size:.95rem}.adde-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.adde-detail-grid[hidden]{display:none}.adde-uerbum-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}.adde-uerbum-actions button{border-radius:16px}.adde-uerbum-primary{border:none;background:#673ab7;color:white}.adde-uerbum-secondary{border:1px solid #dadce0;background:white;color:#3c4043}.adde-uerbum-status{min-height:1.4em;margin-top:14px;color:#374151}.adde-uerbum-primary:disabled{opacity:.45;cursor:not-allowed}
@media(max-width:900px){.vocabularium-search-row{flex-direction:column}.vocabularium-admin{width:100%}.vox-button{width:100%}.adde-detail-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const suggestiones = document.createElement('div');
suggestiones.id = 'vocabulariumSuggestiones';
suggestiones.style.display = 'none';
suggestiones.style.width = '100%';
suggestiones.style.margin = '8px 0 0';

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `<button id="novumVerbumKnopf" type="button" class="vox-button">adde uerbum</button>`;

const addePanel = document.createElement('section');
addePanel.id = 'addeUerbumPanel';
addePanel.className = 'adde-uerbum-panel';
addePanel.hidden = true;
addePanel.innerHTML = `
  <div class="adde-form-head">
    <h2>Adde uerbum</h2>
    <p>Longas vocales nota duplici puncto: <strong>Ro:ma</strong> → Rōma.</p>
  </div>

  <div class="adde-form-card">
    <div class="adde-uerbum-field">
      <label for="addeLemma">Lemma / Headword</label>
      <input id="addeLemma" type="text" placeholder="Ro:ma">
      <div class="adde-card-help">Primum lemma insere.</div>
    </div>
  </div>

  <div class="adde-form-card" id="addeParsCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addePars">Pars orationis</label>
      <select id="addePars">
        <option value="">elige...</option>
        <option value="substantivum">substantivum</option>
        <option value="adiectivum">adiectivum</option>
        <option value="verbum">verbum</option>
        <option value="adverbium">adverbium</option>
        <option value="nomen proprium">nomen proprium</option>
      </select>
      <div class="adde-card-help">Deinde genus uerbi elige; tum tantum reliqua campa aperientur.</div>
    </div>
  </div>

  <div class="adde-form-card" id="addeSubstantivumCard" hidden>
    <div class="adde-detail-grid">
      <div class="adde-uerbum-field"><label for="addeDeclinatio">Declinatio substantivi</label><select id="addeDeclinatio"><option value="a">a-Deklination</option><option value="o">o-Deklination</option><option value="consonantica">konsonantische Deklination</option><option value="i">i-Deklination</option><option value="mixta">gemischte Deklination</option><option value="u">u-Deklination</option><option value="e">e-Deklination</option><option value="indeclinabile">indeclinabile</option><option value="irregularis">irregulär</option><option value="graeca">graeca</option></select></div>
      <div class="adde-uerbum-field"><label for="addeGenus">Genus</label><select id="addeGenus"><option value="m">masculinum</option><option value="f">femininum</option><option value="n">neutrum</option></select></div>
      <div class="adde-uerbum-field"><label for="addeNumerusTyp">Numerus</label><select id="addeNumerusTyp"><option value="sg_pl">Singular + Plural</option><option value="singulare_tantum">singulare tantum</option><option value="plurale_tantum">plurale tantum</option></select></div>
    </div>
  </div>

  <div class="adde-form-card" id="addeAdiectivumCard" hidden>
    <div class="adde-uerbum-field"><label for="addeAdiectivumDeclinatio">Declinatio adiectivi</label><select id="addeAdiectivumDeclinatio"><option value="a_o">a-/o-Deklination</option><option value="consonantica">konsonantische Deklination</option><option value="i">i-Deklination</option><option value="indeclinabile">indeclinabile</option></select></div>
  </div>

  <div class="adde-form-card" id="addeLeitformen" hidden>
    <div class="adde-detail-grid">
      <div class="adde-uerbum-field"><label for="addePraesens">Praesens</label><input id="addePraesens" type="text" placeholder="cano:"></div>
      <div class="adde-uerbum-field"><label for="addeInfinitivus">Infinitivus</label><input id="addeInfinitivus" type="text" placeholder="canere"></div>
      <div class="adde-uerbum-field"><label for="addePerfectum">Perfectum</label><input id="addePerfectum" type="text" placeholder="cecini:"></div>
      <div class="adde-uerbum-field"><label for="addeSupinum">Supinum</label><input id="addeSupinum" type="text" placeholder="cantum"></div>
    </div>
  </div>

  <div class="adde-uerbum-actions">
    <button id="addeCancel" type="button" class="adde-uerbum-secondary">revertere</button>
    <button id="addeSave" type="button" class="adde-uerbum-primary" disabled>servare</button>
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

function normalisiere(textus) { return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u'); }
function sineMacris(textus) { return String(textus || '').replace(/[āăáàâä]/g,'a').replace(/[ēĕéèêë]/g,'e').replace(/[īĭíìîï]/g,'i').replace(/[ōŏóòôö]/g,'o').replace(/[ūŭúùûü]/g,'u').replace(/[ȳýỳŷÿ]/g,'y').replace(/[ĀĂÁÀÂÄ]/g,'A').replace(/[ĒĔÉÈÊË]/g,'E').replace(/[ĪĬÍÌÎÏ]/g,'I').replace(/[ŌŎÓÒÔÖ]/g,'O').replace(/[ŪŬÚÙÛÜ]/g,'U').replace(/[ȲÝỲŶŸ]/g,'Y'); }
function suggestioButtons() { return Array.from(suggestiones.querySelectorAll('.vocabularium-suggestio')); }

function setzeSuggestioSelecta(index) {
  const buttons = suggestioButtons();
  if (buttons.length === 0) { suggestioSelectaIndex = -1; return; }
  suggestioSelectaIndex = Math.max(0, Math.min(index, buttons.length - 1));
  buttons.forEach((button, i) => { button.classList.toggle('is-selected', i === suggestioSelectaIndex); button.setAttribute('aria-selected', i === suggestioSelectaIndex ? 'true' : 'false'); });
  buttons[suggestioSelectaIndex].scrollIntoView({ block: 'nearest' });
}
function leereSuggestiones() { suggestiones.innerHTML = ''; suggestiones.style.display = 'none'; suggestioSelectaIndex = -1; nullusEventusLemma = ''; }
function aperiLemma(lemma) { if (lemma) window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`; }
function statusAdde(textus) { const p = document.getElementById('addeStatus'); if (p) p.textContent = textus || ''; }

function syncAddeForm() {
  const lemma = document.getElementById('addeLemma')?.value.trim() || '';
  const pars = document.getElementById('addePars')?.value || '';
  const parsCard = document.getElementById('addeParsCard');
  const subCard = document.getElementById('addeSubstantivumCard');
  const adjCard = document.getElementById('addeAdiectivumCard');
  const verbCard = document.getElementById('addeLeitformen');
  const save = document.getElementById('addeSave');

  if (parsCard) parsCard.hidden = lemma.length === 0;
  if (subCard) subCard.hidden = pars !== 'substantivum' && pars !== 'nomen proprium';
  if (adjCard) adjCard.hidden = pars !== 'adiectivum';
  if (verbCard) verbCard.hidden = pars !== 'verbum';
  if (save) save.disabled = !lemma || !pars;
}

function aperiAddeUerbum(lemmaPraeplenum = '') {
  leereSuggestiones();
  if (row) row.style.display = 'none';
  if (eventus) eventus.style.display = 'none';
  if (status) status.style.display = 'none';
  addePanel.hidden = false;
  const lemmaInput = document.getElementById('addeLemma');
  const parsInput = document.getElementById('addePars');
  if (lemmaInput) lemmaInput.value = lemmaPraeplenum || '';
  if (parsInput) parsInput.value = '';
  syncAddeForm();
  statusAdde('');
  lemmaInput?.focus();
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
  button.style.cssText = 'display:block;width:100%;text-align:left;padding:14px 18px;border:none;background:white;cursor:pointer;border-bottom:1px solid #eee';
  button.innerHTML = `<strong>${lemmaNeu}</strong> <span style="color:#6b7280">adde ut nouum headword</span>`;
  button.addEventListener('mousedown', event => { event.preventDefault(); aperiAddeUerbum(lemmaNeu); });
  suggestiones.appendChild(button);
  suggestiones.style.display = 'block';
  suggestioSelectaIndex = 0;
}
function oeffneSuggestioSelecta() { const button = suggestioButtons()[suggestioSelectaIndex]; const lemma = button?.dataset?.lemma; if (!lemma) return; if (button.dataset.action === 'adde') aperiAddeUerbum(lemma); else aperiLemma(lemma); }

async function quaereSuggestiones() {
  if (!window.whatseposSupabase || !input) return;
  const qOriginal = input.value.trim();
  const q = normalisiere(qOriginal);
  leereSuggestiones();
  if (q.length < 2) return;
  const { data, error } = await window.whatseposSupabase.from('formae').select('forma, lemma, pars_orationis, syllabae, longae').ilike('lemma', `${q}%`).limit(10);
  if (error) return;
  if (!data || !data.length) { nullusEventusLemma = qOriginal; erzeugeAddeSuggestio(qOriginal); return; }
  const visa = new Set();
  data.forEach(item => {
    if (!item.lemma || visa.has(item.lemma)) return;
    visa.add(item.lemma);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'vocabularium-suggestio'; button.dataset.lemma = item.lemma; button.setAttribute('role', 'option');
    button.style.cssText = 'display:block;width:100%;text-align:left;padding:14px 18px;border:none;background:white;cursor:pointer;border-bottom:1px solid #eee';
    const lemmaStrong = document.createElement('strong'); lemmaStrong.textContent = formaSupabaseSignata({ ...item, forma: item.lemma }) || item.lemma;
    const parsSpan = document.createElement('span'); parsSpan.style.color = '#6b7280'; parsSpan.textContent = ` ${item.pars_orationis || ''}`;
    button.appendChild(lemmaStrong); button.appendChild(parsSpan);
    button.addEventListener('mouseenter', () => { const index = suggestioButtons().indexOf(button); if (index >= 0) setzeSuggestioSelecta(index); });
    button.addEventListener('mousedown', event => { event.preventDefault(); aperiLemma(item.lemma); });
    suggestiones.appendChild(button);
  });
  if (suggestiones.children.length > 0) { suggestiones.style.display = 'block'; setzeSuggestioSelecta(0); }
}

async function speichereAddeFormular() {
  if (!window.whatseposSupabase) return;
  const lemma = document.getElementById('addeLemma')?.value.trim();
  const pars = document.getElementById('addePars')?.value;
  if (!lemma || !pars) { statusAdde('Lemma et pars orationis necessaria sunt.'); return; }
  if (pars === 'verbum') { statusAdde('Leitformen sind erfasst. Automatische Paradigmenspeicherung folgt als nächster Schritt.'); return; }
  const forma = sineMacris(lemma).toLowerCase();
  const lemmaNudum = sineMacris(lemma).toLowerCase();
  const { error } = await window.whatseposSupabase.from('formae').insert([{ forma, lemma: lemmaNudum, pars_orationis: pars, syllabae: null, longae: null }]);
  if (error) { statusAdde(error.message); return; }
  statusAdde('Servatum est.');
}

const zeigeTabOriginal = window.zeigeTab;
const scriptoriumTitulus = document.querySelector('.container > h1');
window.zeigeTab = async function(tabName) {
  if (typeof zeigeTabOriginal === 'function') await zeigeTabOriginal(tabName);
  if (tabName === 'vocabularium') { if (row && addePanel.hidden) row.style.display = 'flex'; if (scriptoriumTitulus) scriptoriumTitulus.textContent = 'Uocabularium'; }
  else { if (row) row.style.display = 'none'; addePanel.hidden = true; if (scriptoriumTitulus) scriptoriumTitulus.textContent = 'Scriptorium'; }
};

if (input) {
  let timer = null;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(quaereSuggestiones, 150); });
  input.addEventListener('keydown', event => {
    const buttons = suggestioButtons();
    if (event.key === 'ArrowDown' && buttons.length > 0) { event.preventDefault(); setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? 0 : suggestioSelectaIndex + 1); return; }
    if (event.key === 'ArrowUp' && buttons.length > 0) { event.preventDefault(); setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? buttons.length - 1 : suggestioSelectaIndex - 1); return; }
    if (event.key === 'Enter') { event.preventDefault(); if (buttons.length > 0) { if (suggestioSelectaIndex < 0) setzeSuggestioSelecta(0); oeffneSuggestioSelecta(); } else if (input.value.trim()) aperiAddeUerbum(input.value.trim()); }
  });
  input.addEventListener('blur', () => setTimeout(() => { if (addePanel.hidden) leereSuggestiones(); }, 120));
}

document.getElementById('novumVerbumKnopf')?.addEventListener('click', () => aperiAddeUerbum(nullusEventusLemma || input?.value.trim() || ''));
document.getElementById('addeLemma')?.addEventListener('input', syncAddeForm);
document.getElementById('addePars')?.addEventListener('change', syncAddeForm);
document.getElementById('addeCancel')?.addEventListener('click', schliesseAddeUerbum);
document.getElementById('addeSave')?.addEventListener('click', speichereAddeFormular);
