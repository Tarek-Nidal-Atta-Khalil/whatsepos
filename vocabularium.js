const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');

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

if (input) {
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      quaere();
    }
  });
}
