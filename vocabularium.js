const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-admin {
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:1.3rem;
  margin-bottom:1.7rem;
  gap:1rem;
}

.vox-button {
  width:88px;
  height:88px;
  border:none;
  border-radius:30px;
  background:#1faa4b;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 10px 24px rgba(0,0,0,0.16);
  transition:all 0.18s ease;
}

.vox-button:hover {
  transform:scale(1.06);
  box-shadow:0 14px 30px rgba(0,0,0,0.22);
}

.vox-inner {
  width:56px;
  height:56px;
  border-radius:999px;
  background:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  color:#1faa4b;
  font-size:1.15rem;
  letter-spacing:0.03em;
  font-family:sans-serif;
}

.novum-verbum-form {
  width:min(100%,760px);
  margin:0 auto 2rem;
  padding:34px 38px;
  box-sizing:border-box;
  border-radius:28px;
  background:white;
  box-shadow:0 12px 34px rgba(0,0,0,0.08);
  text-align:left;
}

.novum-verbum-form h2 {
  margin:0 0 26px;
  font-size:30px;
}

.form-feld {
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-bottom:22px;
}

.form-feld label {
  font-size:17px;
  font-weight:700;
  color:#374151;
}

.form-feld input,
.form-feld select {
  width:100%;
  max-width:none;
  margin:0;
  padding:14px 16px;
  border:1px solid #d1d5db;
  border-radius:14px;
  font-size:20px;
  background:white;
}

.form-feld input:focus,
.form-feld select:focus {
  outline:none;
  border-color:#93c5fd;
  box-shadow:0 0 0 4px rgba(147,197,253,0.25);
}

.form-gruppe {
  display:none;
}

.form-aktionen {
  display:flex;
  justify-content:flex-end;
  gap:12px;
  margin-top:28px;
}

.form-aktionen button {
  border:none;
  border-radius:14px;
  padding:12px 18px;
  font-weight:700;
  cursor:pointer;
}

.form-aktionen .secundarius {
  background:#f3f4f6;
  color:#374151;
}

.form-aktionen .primarius {
  background:#1faa4b;
  color:white;
}
`;
document.head.appendChild(style);

const suggestiones = document.createElement('div');
suggestiones.id = 'vocabulariumSuggestiones';
suggestiones.style.display = 'none';
if (input && input.parentNode) {
  input.insertAdjacentElement('afterend', suggestiones);
}

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `
  <button id="novumVerbumKnopf" type="button" class="vox-button" aria-label="Novum verbum addere">
    <span class="vox-inner">VOX</span>
  </button>
`;

const formularBox = document.createElement('form');
formularBox.id = 'novumVerbumForm';
formularBox.className = 'novum-verbum-form';
formularBox.style.display = 'none';
formularBox.innerHTML = `
  <h2>Novum verbum</h2>

  <div class="form-feld">
    <label for="novumLemma">Vokabel</label>
    <input id="novumLemma" type="text" placeholder="z. B. puella, Troia, bonus, servus">
  </div>

  <div class="form-feld">
    <label for="novumPars">Wortart</label>
    <select id="novumPars">
      <option value="substantivum">Substantivum</option>
      <option value="adiectivum">Adiectivum</option>
      <option value="verbum">Verbum</option>
    </select>
  </div>

  <div id="gruppeSubstantivum" class="form-gruppe">
    <div class="form-feld">
      <label for="novumSubstantivumDeclinatio">Deklination</label>
      <select id="novumSubstantivumDeclinatio">
        <option value="a_declinatio_substantivum">a-Deklination</option>
        <option value="o_declinatio_substantivum">o-Deklination</option>
      </select>
    </div>

    <div class="form-feld">
      <label for="novumGenus">Genus</label>
      <select id="novumGenus">
        <option value="">automatisch</option>
        <option value="m">masculinum</option>
        <option value="f">femininum</option>
        <option value="n">neutrum</option>
      </select>
    </div>
  </div>

  <div id="gruppeAdiectivum" class="form-gruppe">
    <div class="form-feld">
      <label for="novumAdiectivumDeclinatio">Deklination</label>
      <select id="novumAdiectivumDeclinatio">
        <option value="ao_adiectivum">a/o-Adjektiv</option>
      </select>
    </div>
  </div>

  <div id="gruppeVerbum" class="form-gruppe">
    <div class="form-feld">
      <label for="novumConiugatio">Konjugation</label>
      <select id="novumConiugatio">
        <option value="a_coniugatio">ā-Konjugation</option>
        <option value="e_coniugatio">ē-Konjugation</option>
        <option value="consonantica">konsonantische Konjugation</option>
        <option value="i_coniugatio">ī-Konjugation</option>
        <option value="mixta">gemischte Konjugation</option>
        <option value="irregularis">unregelmäßig</option>
      </select>
    </div>

    <div class="form-feld">
      <label for="novumPraesens">Leitform Präsens</label>
      <input id="novumPraesens" type="text" placeholder="z. B. amo">
    </div>

    <div class="form-feld">
      <label for="novumPerfectum">Leitform Perfekt</label>
      <input id="novumPerfectum" type="text" placeholder="z. B. amavi">
    </div>

    <div class="form-feld">
      <label for="novumSupinum">Leitform Supin</label>
      <input id="novumSupinum" type="text" placeholder="z. B. amatum">
    </div>
  </div>

  <p id="novumVerbumStatus" class="status"></p>

  <div class="form-aktionen">
    <button type="button" id="novumAbbrechen" class="secundarius">Abbrechen</button>
    <button type="submit" class="primarius">Servare</button>
  </div>
`;

if (input && vocabulariumTab) {
  input.insertAdjacentElement('afterend', adminBox);
  vocabulariumTab.insertBefore(formularBox, input);
}

const zeigeTabOriginal = window.zeigeTab;
const scriptoriumTitulus = document.querySelector('.container > h1');

window.zeigeTab = async function (tabName) {
  const vocabularium = document.getElementById('vocabularium');
  if (vocabularium) vocabularium.style.display = 'none';

  if (typeof zeigeTabOriginal === 'function') {
    await zeigeTabOriginal(tabName);
  }

  if (scriptoriumTitulus) {
    scriptoriumTitulus.textContent = tabName === 'vocabularium' ? 'Uocabularium' : 'Scriptorium';
  }

  if (tabName === 'vocabularium' && vocabularium) {
    vocabularium.style.display = 'block';
    if (input) input.focus();
  }
};

function normalisiere(textus) {
  return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

function bereinigeEingabe(textus) {
  return String(textus || '').trim().replace(/j/g, 'i').replace(/v/g, 'u');
}

function aperiLemma(lemma) {
  if (!lemma) return;
  window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
}

function setzeFormularSichtbar(sichtbar) {
  formularBox.style.display = sichtbar ? 'block' : 'none';
  if (input) input.style.display = sichtbar ? 'none' : '';
  if (eventus) eventus.style.display = sichtbar ? 'none' : '';
  if (status) status.style.display = sichtbar ? 'none' : '';
  if (suggestiones) suggestiones.style.display = 'none';
  adminBox.style.display = sichtbar ? 'none' : 'flex';
  if (sichtbar) document.getElementById('novumLemma').focus();
}

function aktualisiereFormularGruppen() {
  const pars = document.getElementById('novumPars').value;
  document.getElementById('gruppeSubstantivum').style.display = pars === 'substantivum' ? 'block' : 'none';
  document.getElementById('gruppeAdiectivum').style.display = pars === 'adiectivum' ? 'block' : 'none';
  document.getElementById('gruppeVerbum').style.display = pars === 'verbum' ? 'block' : 'none';
}

const macrones = { a:'ā', e:'ē', i:'ī', o:'ō', u:'ū', y:'ȳ', A:'Ā', E:'Ē', I:'Ī', O:'Ō', U:'Ū', Y:'Ȳ' };
function istVokal(zeichen) { return /[aeiouyAEIOUY]/.test(zeichen); }
function markiereVokal(textus, vokalIndex) {
  let zaehler = -1;
  return String(textus || '').split('').map(function (zeichen) {
    if (!istVokal(zeichen)) return zeichen;
    zaehler += 1;
    return zaehler === vokalIndex ? (macrones[zeichen] || zeichen) : zeichen;
  }).join('');
}
function longaeZuIndizes(longae, vokalAnzahl) {
  if (longae === null || longae === undefined || longae === '') return [];
  if (Array.isArray(longae)) {
    const zahlen = longae.map(Number).filter(Number.isInteger);
    if (!zahlen.length) return [];
    const einbasiert = !zahlen.includes(0) && Math.max.apply(null, zahlen) <= vokalAnzahl;
    return zahlen.map(function (x) { return einbasiert ? x - 1 : x; }).filter(function (x) { return x >= 0 && x < vokalAnzahl; });
  }
  const text = String(longae).trim();
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return longaeZuIndizes(parsed, vokalAnzahl);
  } catch (_error) {}
  const zahlen = text.match(/\d+/g);
  if (zahlen && zahlen.length > 0) return longaeZuIndizes(zahlen.map(Number), vokalAnzahl);
  return [];
}
function cumMacronibus(textus, longae) {
  const basis = String(textus || '');
  const vokalAnzahl = (basis.match(/[aeiouyAEIOUY]/g) || []).length;
  const indizes = longaeZuIndizes(longae, vokalAnzahl);
  let resultatum = basis;
  indizes.sort(function (a, b) { return b - a; }).forEach(function (index) { resultatum = markiereVokal(resultatum, index); });
  return resultatum;
}
function lemmaDisplay(item) {
  if (!item) return '';
  if (item.lemma && normalisiere(item.lemma) === normalisiere(item.forma)) return cumMacronibus(item.lemma, item.longae);
  return item.lemma || '';
}
function formaDisplay(item) { return cumMacronibus(item.forma || '', item.longae); }
function zelle(textus) {
  const td = document.createElement('td');
  td.textContent = textus || '';
  return td;
}
function leereSuggestiones() { suggestiones.innerHTML = ''; suggestiones.style.display = 'none'; }

function zeigeTabelle(items) {
  const table = document.createElement('table');
  table.className = 'vocabularium-tabelle';
  const thead = document.createElement('thead');
  const kopfZeile = document.createElement('tr');
  ['Lemma', 'Stammform', 'Wortart'].forEach(function (titel) {
    const th = document.createElement('th'); th.textContent = titel; kopfZeile.appendChild(th);
  });
  thead.appendChild(kopfZeile); table.appendChild(thead);
  const tbody = document.createElement('tbody');
  for (const item of items) {
    const tr = document.createElement('tr');
    tr.addEventListener('click', function () { aperiLemma(item.lemma || item.forma); });
    tr.appendChild(zelle(lemmaDisplay(item)));
    tr.appendChild(zelle(formaDisplay(item)));
    tr.appendChild(zelle(item.pars_orationis));
    tbody.appendChild(tr);
  }
  table.appendChild(tbody); eventus.appendChild(table);
}

async function quaere() {
  if (!input || !window.whatseposSupabase) return;
  const q = normalisiere(input.value);
  eventus.innerHTML = ''; status.textContent = ''; leereSuggestiones();
  if (!q) return;
  status.textContent = 'Quaero…';
  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('lemma, forma, longae, pars_orationis')
    .or(`forma.ilike.%${q}%,lemma.ilike.%${q}%`)
    .limit(50);
  if (error) { status.textContent = error.message; return; }
  const visa = new Set();
  const items = [];
  for (const item of data || []) {
    const clavis = `${item.lemma || ''}|${item.forma || ''}|${item.pars_orationis || ''}|${item.longae || ''}`;
    if (!visa.has(clavis)) { visa.add(clavis); items.push(item); }
  }
  if (!items.length) { status.textContent = 'Nullum lemma inventum est.'; return; }
  status.textContent = ''; zeigeTabelle(items);
}

async function salvaNovumVerbum(event) {
  event.preventDefault();
  const novumStatus = document.getElementById('novumVerbumStatus');
  const lemma = bereinigeEingabe(document.getElementById('novumLemma').value);
  const pars = document.getElementById('novumPars').value;
  if (!lemma) { novumStatus.textContent = 'Lemma deest.'; return; }
  if (!window.whatseposSupabase || !window.whatseposFlexio) { novumStatus.textContent = 'Supabase aut flexio nondum parata est.'; return; }
  novumStatus.textContent = 'Servo…';
  try {
    if (pars === 'adiectivum') {
      await window.whatseposFlexio.salvaFormasAO(window.whatseposSupabase, { lemma });
    }
    if (pars === 'substantivum') {
      const declinatio = document.getElementById('novumSubstantivumDeclinatio').value;
      const genus = document.getElementById('novumGenus').value;
      if (declinatio === 'a_declinatio_substantivum') await window.whatseposFlexio.salvaFormasADeclinatio(window.whatseposSupabase, { lemma, genus: genus || 'f' });
      if (declinatio === 'o_declinatio_substantivum') await window.whatseposFlexio.salvaFormasODeclinatio(window.whatseposSupabase, { lemma, genus: genus || null });
    }
    if (pars === 'verbum') {
      const coniugatio = document.getElementById('novumConiugatio').value;
      const praesens = bereinigeEingabe(document.getElementById('novumPraesens').value) || lemma;
      const perfectum = bereinigeEingabe(document.getElementById('novumPerfectum').value);
      const supinum = bereinigeEingabe(document.getElementById('novumSupinum').value);
      const formae = [
        { forma: praesens, tempus: 'praesens' },
        { forma: perfectum, tempus: 'perfectum' },
        { forma: supinum, tempus: 'supinum' }
      ].filter(function (x) { return x.forma; }).map(function (x) {
        return { forma: x.forma, lemma, pars_orationis: 'verbum', tempus: x.tempus, flexio_classis: coniugatio, generata: false, irregularis: coniugatio === 'irregularis' };
      });
      await window.whatseposSupabase.from('formae').insert(formae);
    }
    novumStatus.textContent = `${lemma} servatum est.`;
    input.value = lemma;
    setTimeout(function () { setzeFormularSichtbar(false); quaere(); }, 450);
  } catch (error) { novumStatus.textContent = error.message; }
}

const novumVerbumKnopf = document.getElementById('novumVerbumKnopf');
const novumAbbrechen = document.getElementById('novumAbbrechen');
const novumPars = document.getElementById('novumPars');
if (novumVerbumKnopf) novumVerbumKnopf.addEventListener('click', function () { setzeFormularSichtbar(true); aktualisiereFormularGruppen(); });
if (novumAbbrechen) novumAbbrechen.addEventListener('click', function () { setzeFormularSichtbar(false); });
if (novumPars) novumPars.addEventListener('change', aktualisiereFormularGruppen);
if (formularBox) formularBox.addEventListener('submit', salvaNovumVerbum);
aktualisiereFormularGruppen();

let suggestioTimer = null;
let suggestioNumerus = 0;
async function quaereSuggestiones() {
  if (!input || !window.whatseposSupabase) return;
  const q = normalisiere(input.value);
  eventus.innerHTML = ''; status.textContent = ''; leereSuggestiones();
  if (q.length < 2) return;
  const hicNumerus = ++suggestioNumerus;
  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('lemma, forma, longae, pars_orationis')
    .or(`forma.ilike.${q}%,lemma.ilike.${q}%`)
    .order('lemma', { ascending: true })
    .limit(12);
  if (hicNumerus !== suggestioNumerus || error || !data || !data.length) return;
  const visa = new Set();
  for (const item of data) {
    const textus = lemmaDisplay(item) || formaDisplay(item);
    const clavis = `${textus || ''}|${item.pars_orationis || ''}`;
    if (!textus || visa.has(clavis)) continue;
    visa.add(clavis);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'vocabularium-suggestio';
    const lemmaEl = document.createElement('strong'); lemmaEl.textContent = textus;
    const meta = document.createElement('span'); meta.textContent = item.pars_orationis ? ` ${item.pars_orationis}` : '';
    button.appendChild(lemmaEl); button.appendChild(meta);
    button.addEventListener('mousedown', function (event) { event.preventDefault(); aperiLemma(item.lemma || item.forma); });
    suggestiones.appendChild(button);
  }
  suggestiones.style.display = suggestiones.children.length > 0 ? 'block' : 'none';
}

if (input) {
  input.addEventListener('input', function () { clearTimeout(suggestioTimer); suggestioTimer = setTimeout(quaereSuggestiones, 180); });
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { event.preventDefault(); quaere(); }
    if (event.key === 'Escape') leereSuggestiones();
  });
  input.addEventListener('blur', function () { setTimeout(leereSuggestiones, 150); });
}

window.addEventListener('load', function () {
  setTimeout(function () {
    const tab = new URLSearchParams(window.location.search).get('tab');
    const q = new URLSearchParams(window.location.search).get('q');
    if (tab === 'vocabularium' && typeof window.zeigeTab === 'function') window.zeigeTab('vocabularium');
    if (q && input) { input.value = q; quaere(); }
  }, 250);
});
