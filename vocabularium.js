const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');

const suggestiones = document.createElement('div');
suggestiones.id = 'vocabulariumSuggestiones';
suggestiones.style.display = 'none';
if (input && input.parentNode) {
  input.insertAdjacentElement('afterend', suggestiones);
}

const zeigeTabOriginal = window.zeigeTab;

window.zeigeTab = async function (tabName) {
  const vocabularium = document.getElementById('vocabularium');
  if (vocabularium) vocabularium.style.display = 'none';

  if (typeof zeigeTabOriginal === 'function') {
    await zeigeTabOriginal(tabName);
  }

  if (tabName === 'vocabularium' && vocabularium) {
    vocabularium.style.display = 'block';
    if (input) input.focus();
  }
};

function normalisiere(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function zelle(textus) {
  const td = document.createElement('td');
  td.textContent = textus || '';
  return td;
}

function leereSuggestiones() {
  suggestiones.innerHTML = '';
  suggestiones.style.display = 'none';
}

function zeigeTabelle(items) {
  const table = document.createElement('table');
  table.className = 'vocabularium-tabelle';

  const thead = document.createElement('thead');
  const kopfZeile = document.createElement('tr');

  ['Lemma', 'Stammform', 'Wortart'].forEach(function (titel) {
    const th = document.createElement('th');
    th.textContent = titel;
    kopfZeile.appendChild(th);
  });

  thead.appendChild(kopfZeile);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (const item of items) {
    const tr = document.createElement('tr');
    tr.appendChild(zelle(item.lemma));
    tr.appendChild(zelle(item.forma));
    tr.appendChild(zelle(item.pars_orationis));
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  eventus.appendChild(table);
}

async function quaere() {
  if (!input || !window.whatseposSupabase) return;

  const q = normalisiere(input.value);
  eventus.innerHTML = '';
  status.textContent = '';
  leereSuggestiones();

  if (!q) return;

  status.textContent = 'Quaero…';

  const supabase = window.whatseposSupabase;

  const { data, error } = await supabase
    .from('formae')
    .select('lemma, forma, pars_orationis')
    .or(`forma.ilike.${q},lemma.ilike.${q}`)
    .limit(50);

  if (error) {
    status.textContent = error.message;
    return;
  }

  const visa = new Set();
  const items = [];

  for (const item of data || []) {
    const clavis = `${item.lemma || ''}|${item.forma || ''}|${item.pars_orationis || ''}`;
    if (visa.has(clavis)) continue;
    visa.add(clavis);
    items.push(item);
  }

  if (items.length === 0) {
    status.textContent = 'Nullum lemma inventum est.';
    return;
  }

  status.textContent = '';
  zeigeTabelle(items);
}

let suggestioTimer = null;
let suggestioNumerus = 0;

async function quaereSuggestiones() {
  if (!input || !window.whatseposSupabase) return;

  const q = normalisiere(input.value);
  eventus.innerHTML = '';
  status.textContent = '';
  leereSuggestiones();

  if (q.length < 2) return;

  const hicNumerus = ++suggestioNumerus;
  const supabase = window.whatseposSupabase;

  const { data, error } = await supabase
    .from('formae')
    .select('lemma, forma, pars_orationis')
    .or(`forma.ilike.${q}%,lemma.ilike.${q}%`)
    .order('lemma', { ascending: true })
    .limit(12);

  if (hicNumerus !== suggestioNumerus) return;
  if (error || !data || data.length === 0) return;

  const visa = new Set();

  for (const item of data) {
    const textus = item.lemma || item.forma;
    const clavis = `${textus || ''}|${item.pars_orationis || ''}`;
    if (!textus || visa.has(clavis)) continue;
    visa.add(clavis);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vocabularium-suggestio';

    const lemma = document.createElement('strong');
    lemma.textContent = textus;

    const meta = document.createElement('span');
    meta.textContent = item.pars_orationis ? ` ${item.pars_orationis}` : '';

    button.appendChild(lemma);
    button.appendChild(meta);

    button.addEventListener('mousedown', function (event) {
      event.preventDefault();
      input.value = textus;
      quaere();
    });

    suggestiones.appendChild(button);
  }

  suggestiones.style.display = suggestiones.children.length > 0 ? 'block' : 'none';
}

if (input) {
  input.addEventListener('input', function () {
    clearTimeout(suggestioTimer);
    suggestioTimer = setTimeout(quaereSuggestiones, 180);
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      quaere();
    }

    if (event.key === 'Escape') {
      leereSuggestiones();
    }
  });

  input.addEventListener('blur', function () {
    setTimeout(leereSuggestiones, 150);
  });
}
