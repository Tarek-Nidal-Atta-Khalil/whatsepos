function istFormaHexameterCompatibilis(sigla) {
  const s = String(sigla || '').toUpperCase().replace(/[^LB]/g, '');

  if (!s) return false;

  // Dieselbe Grundlogik wie in der Scriptorium-Vorschau:
  // drei Kürzen hintereinander und L-B-L sind lokal metrisch problematisch.
  if (s.includes('BBB')) return false;
  if (s.includes('LBL')) return false;

  return true;
}

function liesLongaeSigla(card) {
  const meta = card.querySelector('.forma-meta');
  const textus = meta?.textContent || '';
  const match = textus.match(/longae:\s*([LB()]+)/i);
  return match ? match[1] : '';
}

function siglaOhneElidierteUltima(sigla) {
  return String(sigla || '')
    .toUpperCase()
    .replace(/\(([LB])\)\s*$/, '')
    .replace(/[^LB]/g, '');
}

function istElidierbaresWort(textus) {
  const s = String(textus || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/͞/g, '');

  return /[aeiouy]m?$/.test(s);
}

function siglaMitElidierterUltima(sigla, textus) {
  const s = String(sigla || '').toUpperCase().replace(/[^LB]/g, '');
  if (!s || s.length < 2 || !istElidierbaresWort(textus)) return s;
  return `${s.slice(0, -1)}(${s.slice(-1)})`;
}

function entferneGlobaleCompatibilitasMetrica() {
  document.querySelectorAll('.lemma-section').forEach(section => {
    const titulus = section.querySelector('h2')?.textContent?.trim().toLowerCase();
    if (titulus === 'compatibilitas metrica') {
      section.remove();
    }
  });
}

function aktualisiereMetaMitElision(card, siglaElidenda) {
  const meta = card.querySelector('.forma-meta');
  if (!meta || !siglaElidenda) return;

  meta.textContent = meta.textContent.replace(/longae:\s*[LB()]+/i, `longae: ${siglaElidenda}`);
}

function markiereFormaeMetricae() {
  document.querySelectorAll('.forma-card').forEach(card => {
    const sigla = liesLongaeSigla(card);
    const textus = card.querySelector('.forma-prima')?.textContent || '';
    const siglaElidenda = siglaMitElidierterUltima(sigla, textus);
    const basisSigla = siglaOhneElidierteUltima(siglaElidenda);
    const compatibilis = istFormaHexameterCompatibilis(basisSigla);

    aktualisiereMetaMitElision(card, siglaElidenda);
    card.classList.toggle('forma-metrice-bona', compatibilis);
    card.classList.toggle('forma-metrice-dubia', !compatibilis);
  });
}

function initFormaeMetricaeFix() {
  entferneGlobaleCompatibilitasMetrica();
  markiereFormaeMetricae();
}

const style = document.createElement('style');
style.textContent = `
.forma-card.forma-metrice-bona {
  border: 2px solid #22c55e !important;
  box-shadow: 0 4px 18px rgba(34, 197, 94, .12) !important;
}

.forma-card.forma-metrice-dubia {
  border: 2px solid #f59e0b !important;
  box-shadow: 0 4px 18px rgba(245, 158, 11, .12) !important;
}
`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', initFormaeMetricaeFix);
setTimeout(initFormaeMetricaeFix, 250);
setTimeout(initFormaeMetricaeFix, 750);
setTimeout(initFormaeMetricaeFix, 1500);
