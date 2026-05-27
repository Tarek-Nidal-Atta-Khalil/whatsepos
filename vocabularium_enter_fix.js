function normalisiereVocabulariumEnter(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function oeffneLemmaVocabulariumEnter(item) {
  if (item && item.lexeme_id) {
    window.location.href = `lemma.html?lexeme_id=${encodeURIComponent(item.lexeme_id)}`;
    return;
  }

  if (item && item.lemma) {
    window.location.href = `lemma.html?lemma=${encodeURIComponent(item.lemma)}`;
  }
}

async function sucheUndOeffneVocabulariumLemma(input) {
  const qOriginal = input.value.trim();
  const q = normalisiereVocabulariumEnter(qOriginal);

  if (!q || q.length < 2 || !window.whatseposSupabase) return;

  const basis = 'forma, lemma, pars_orationis, lexeme_id';

  const formaeResult = await window.whatseposSupabase
    .from('formae')
    .select(basis)
    .ilike('forma', `${q}%`)
    .limit(20);

  if (formaeResult.error) return;

  let resultata = formaeResult.data || [];

  if (!resultata.length) {
    const lemmaResult = await window.whatseposSupabase
      .from('formae')
      .select(basis)
      .ilike('lemma', `${q}%`)
      .limit(20);

    if (lemmaResult.error) return;
    resultata = lemmaResult.data || [];
  }

  const exakt = resultata.find(item =>
    normalisiereVocabulariumEnter(item.forma) === q ||
    normalisiereVocabulariumEnter(item.lemma) === q
  );
  const item = exakt || resultata[0];

  if (item && (item.lemma || item.lexeme_id)) {
    oeffneLemmaVocabulariumEnter(item);
    return;
  }

  document.getElementById('novumVerbumKnopf')?.click();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('vocabulariumQuaere');
  if (!input) return;

  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    event.stopImmediatePropagation();

    sucheUndOeffneVocabulariumLemma(input);
  }, true);
});
