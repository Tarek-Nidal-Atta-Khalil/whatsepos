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
    .select('lemma, pars_orationis')
    .or(`forma.ilike.${q},lemma.ilike.${q}`)
    .limit(20);

  if (error) {
    status.textContent = error.message;
    return;
  }

  const visa = new Set();

  for (const item of data || []) {
    const clavis = `${item.lemma || ''}|${item.pars_orationis || ''}`;
    if (visa.has(clavis)) continue;
    visa.add(clavis);

    const div = document.createElement('div');
    div.textContent = item.pars_orationis
      ? `${item.lemma} (${item.pars_orationis})`
      : item.lemma;

    eventus.appendChild(div);
  }

  status.textContent = visa.size === 0 ? 'Nullum lemma inventum est.' : '';
}

if (input) {
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      quaere();
    }
  });
}
