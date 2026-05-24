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

if (input && vocabulariumTab) {
  const row = document.createElement('div');
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

  if (scriptoriumTitulus) {
    scriptoriumTitulus.textContent = tabName === 'vocabularium' ? 'Uocabularium' : 'Scriptorium';
  }
};

function normalisiere(textus) {
  return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

function leereSuggestiones() {
  suggestiones.innerHTML = '';
  suggestiones.style.display = 'none';
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
    .select('lemma, pars_orationis')
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
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.textAlign = 'left';
    button.style.padding = '14px 18px';
    button.style.border = 'none';
    button.style.background = 'white';
    button.style.cursor = 'pointer';
    button.style.borderBottom = '1px solid #eee';

    button.innerHTML = `<strong>${item.lemma}</strong> <span style="color:#6b7280">${item.pars_orationis || ''}</span>`;

    button.addEventListener('mousedown', function(event) {
      event.preventDefault();
      aperiLemma(item.lemma);
    });

    suggestiones.appendChild(button);
  });

  if (suggestiones.children.length > 0) {
    suggestiones.style.display = 'block';
  }
}

if (input) {
  let timer = null;

  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(quaereSuggestiones, 150);
  });

  input.addEventListener('blur', function() {
    setTimeout(leereSuggestiones, 120);
  });
}
