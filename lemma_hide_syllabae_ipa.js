function hideLemmaSectionByTitle(titulusQuaerendus) {
  document.querySelectorAll('h2').forEach(h2 => {
    const titulus = h2.textContent?.trim().toLowerCase();
    if (titulus !== titulusQuaerendus.toLowerCase()) return;

    let node = h2;
    while (node && !node.classList?.contains('lemma-section')) {
      node = node.parentElement;
    }

    if (node) {
      node.style.display = 'none';
    }
  });
}

function initLemmaHideSyllabaeIpa() {
  hideLemmaSectionByTitle('Syllabae');
  hideLemmaSectionByTitle('IPA');
}

window.addEventListener('DOMContentLoaded', initLemmaHideSyllabaeIpa);
setTimeout(initLemmaHideSyllabaeIpa, 250);
setTimeout(initLemmaHideSyllabaeIpa, 1000);
