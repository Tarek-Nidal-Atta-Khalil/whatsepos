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

function oeffneTabAusUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');

  if (tab === 'vocabularium' && typeof window.zeigeTab === 'function') {
    window.zeigeTab('vocabularium');
  }
}

window.addEventListener('load', function () {
  setTimeout(oeffneTabAusUrl, 250);
});

function normalisiere(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function aperiLemma(lemma) {
  if (!lemma) return;
  const url = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
  window.location.href = url;
}

const macrones = {
  a: 'ā', e: 'ē', i: 'ī', o: 'ō', u: 'ū', y: 'ȳ',
  A: 'Ā', E: 'Ē', I: 'Ī', O: 'Ō', U: 'Ū', Y: 'Ȳ'
};

function istVokal(zeichen) {
  return /[aeiouyAEIOUY]/.test(zeichen);
}

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
    if (longae.every(function (x) { return typeof x === 'boolean'; })) {
      return longae
        .map(function (wert, index) { return wert ? index : -1; })
        .filter(function (index) { return index >= 0 && index < vokalAnzahl; });
    }

    const zahlen = longae
      .map(function (x) { return Number(x); })
      .filter(function (x) { return Number.isInteger(x); });

    if (zahlen.length === 0) return [];
    const einbasiert = !zahlen.includes(0) && Math.max.apply(null, zahlen) <= vokalAnzahl;
    return zahlen
      .map(function (x) { return einbasiert ? x - 1 : x; })
      .filter(function (x) { return x >= 0 && x < vokalAnzahl; });
  }

  const text = String(longae).trim();

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return longaeZuIndizes(parsed, vokalAnzahl);
  } catch (_error) {}

  const zahlen = text.match(/\d+/g);
  if (zahlen && zahlen.length > 0) {
    return longaeZuIndizes(zahlen.map(Number), vokalAnzahl);
  }

  const kompakt = text.replace(/[\s.,;|/-]/g, '');
  if (kompakt.length === vokalAnzahl) {
    const langeZeichen = new Set(['L', 'l', '1', '—', '–', 'X', 'x']);
    return kompakt
      .split('')
      .map(function (zeichen, index) { return langeZeichen.has(zeichen) ? index : -1; })
      .filter(function (index) { return index >= 0; });
  }

  return [];
}

function cumMacronibus(textus, longae) {
  const basis = String(textus || '');
  const vokalAnzahl = (basis.match(/[aeiouyAEIOUY]/g) || []).length;
  if (vokalAnzahl === 0) return basis;

  const indizes = longaeZuIndizes(longae, vokalAnzahl);
  let resultatum = basis;

  indizes
    .sort(function (a, b) { return b - a; })
    .forEach(function (index) {
      resultatum = markiereVokal(resultatum, index);
    });

  return resultatum;
}

function lemmaDisplay(item) {
  if (!item) return '';
  if (item.lemma && normalisiere(item.lemma) === normalisiere(item.forma)) {
    return cumMacronibus(item.lemma, item.longae);
  }
  return item.lemma || '';
}

function formaDisplay(item) {
  return cumMacronibus(item.forma || '', item.longae);
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

    tr.addEventListener('click', function () {
      aperiLemma(lemmaDisplay(item) || item.lemma || item.forma);
    });

    tr.appendChild(zelle(lemmaDisplay(item)));
    tr.appendChild(zelle(formaDisplay(item)));
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
    .select('lemma, forma, longae, pars_orationis')
    .or(`forma.ilike.${q},lemma.ilike.${q}`)
    .limit(50);

  if (error) {
    status.textContent = error.message;
    return;
  }

  const visa = new Set();
  const items = [];

  for (const item of data || []) {
    const clavis = `${item.lemma || ''}|${item.forma || ''}|${item.pars_orationis || ''}|${item.longae || ''}`;
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
    .select('lemma, forma, longae, pars_orationis')
    .or(`forma.ilike.${q}%,lemma.ilike.${q}%`)
    .order('lemma', { ascending: true })
    .limit(12);

  if (hicNumerus !== suggestioNumerus) return;
  if (error || !data || data.length === 0) return;

  const visa = new Set();

  for (const item of data) {
    const textus = lemmaDisplay(item) || formaDisplay(item);
    const lemmaRoh = item.lemma || item.forma;
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
      aperiLemma(textus || lemmaRoh);
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
