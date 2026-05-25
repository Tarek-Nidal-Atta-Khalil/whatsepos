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
<button id="novumVerbumKnopf" type="button" class="vox-button">adde nouum</button>
`;

let row = null;
let suggestioSelectaIndex = -1;

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
}

const zeigeTabOriginal = window.zeigeTab;
const scriptoriumTitulus = document.querySelector('.container > h1');

window.zeigeTab = async function(tabName) {
  if (typeof zeigeTabOriginal === 'function') {
    await zeigeTabOriginal(tabName);
  }

  if (row) {
    row.style.display = tabName === 'vocabularium' ? 'flex' : 'none';
  }

  if (scriptoriumTitulus) {
    scriptoriumTitulus.textContent = tabName === 'vocabularium' ? 'Uocabularium' : 'Scriptorium';
  }
};

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

function oeffneSuggestioSelecta() {
  const button = suggestioButtons()[suggestioSelectaIndex];
  const lemma = button?.dataset?.lemma;
  if (lemma) aperiLemma(lemma);
}

function leereSuggestiones() {
  suggestiones.innerHTML = '';
  suggestiones.style.display = 'none';
  suggestioSelectaIndex = -1;
}

function aperiLemma(lemma) {
  if (!lemma) return;
  window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
}

async function quaereSuggestiones() {
  if (!window.whatseposSupabase || !input) return;

  const q = normalisiere(input.value);
  leereSuggestiones();

  if (q.length < 2) return;

  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('forma, lemma, pars_orationis, syllabae, longae')
    .ilike('lemma', `${q}%`)
    .limit(10);

  if (error || !data || !data.length) return;

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

    if (event.key === 'Enter' && buttons.length > 0) {
      event.preventDefault();
      if (suggestioSelectaIndex < 0) setzeSuggestioSelecta(0);
      oeffneSuggestioSelecta();
    }
  });

  input.addEventListener('blur', function() {
    setTimeout(leereSuggestiones, 120);
  });
}
