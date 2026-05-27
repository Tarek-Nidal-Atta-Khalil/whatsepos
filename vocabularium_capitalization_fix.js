function whatseposNorm(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function whatseposDisplayLemma(textus) {
  const roh = String(textus || '');
  const norm = whatseposNorm(roh);

  if (norm.startsWith('lauini')) {
    return 'Lauini' + norm.slice('lauini'.length);
  }

  return roh;
}

function repariereVocabulariumSuggestionesGrossschreibung() {
  const suggestiones = document.getElementById('vocabulariumSuggestiones');
  if (!suggestiones) return;

  suggestiones.querySelectorAll('.vocabularium-suggestio strong').forEach(strong => {
    const korrigiert = whatseposDisplayLemma(strong.textContent);

    if (strong.textContent !== korrigiert) {
      strong.textContent = korrigiert;
    }
  });
}

function starteVocabulariumGrossschreibungFix() {
  const suggestiones = document.getElementById('vocabulariumSuggestiones');
  if (!suggestiones || suggestiones.dataset.capitalizationFix === 'true') return;

  suggestiones.dataset.capitalizationFix = 'true';

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(repariereVocabulariumSuggestionesGrossschreibung);
  });

  observer.observe(suggestiones, { childList: true, subtree: true });
  repariereVocabulariumSuggestionesGrossschreibung();
}

window.addEventListener('DOMContentLoaded', starteVocabulariumGrossschreibungFix);
setTimeout(starteVocabulariumGrossschreibungFix, 250);
setTimeout(starteVocabulariumGrossschreibungFix, 1000);
