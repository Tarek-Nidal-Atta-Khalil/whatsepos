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

  /*
   * 1. Zuerst nach einem exakt passenden Lemma suchen.
   * Dadurch führt beispielsweise "is" sicher zum Lemma is
   * und nicht zu einem bloßen Präfixtreffer wie iste.
   */
  const lemmaExactum = await window.whatseposSupabase
    .from('formae')
    .select(basis)
    .eq('lemma', q)
    .limit(1);

  if (
    !lemmaExactum.error &&
    lemmaExactum.data &&
    lemmaExactum.data[0]
  ) {
    oeffneLemmaVocabulariumEnter(lemmaExactum.data[0]);
    return;
  }

  /*
   * 2. Danach eine exakt passende flektierte Form suchen.
   * So kann etwa auch nach hunc oder illorum gesucht werden.
   */
  const formaExacta = await window.whatseposSupabase
    .from('formae')
    .select(basis)
    .eq('forma', q)
    .limit(1);

  if (
    !formaExacta.error &&
    formaExacta.data &&
    formaExacta.data[0]
  ) {
    oeffneLemmaVocabulariumEnter(formaExacta.data[0]);
    return;
  }

  /*
   * 3. Ohne exakten Treffer wird kein zufälliger Präfixtreffer
   * geöffnet. Stattdessen bleibt die gefilterte Lemmaliste sichtbar.
   */
  input.dispatchEvent(
    new Event('input', { bubbles: true })
  );
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
