function normalisiereVocabulariumEnter(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function oeffneLemmaVocabulariumEnter(lemma) {
  if (lemma) {
    window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
  }
}

async function sucheUndOeffneVocabulariumLemma(input) {
  const qOriginal = input.value.trim();
  const q = normalisiereVocabulariumEnter(qOriginal);

  if (!q || q.length < 2 || !window.whatseposSupabase) return;

  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('lemma')
    .ilike('lemma', `${q}%`)
    .limit(10);

  if (error) return;

  const lemmata = Array.from(new Set((data || []).map(item => item.lemma).filter(Boolean)));
  const exakt = lemmata.find(lemma => normalisiereVocabulariumEnter(lemma) === q);
  const lemma = exakt || lemmata[0];

  if (lemma) {
    oeffneLemmaVocabulariumEnter(lemma);
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
