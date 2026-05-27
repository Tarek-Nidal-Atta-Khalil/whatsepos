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
  const match = textus.match(/longae:\s*([LB]+)/i);
  return match ? match[1] : '';
}

function entferneGlobaleCompatibilitasMetrica() {
  document.querySelectorAll('.lemma-section').forEach(section => {
    const titulus = section.querySelector('h2')?.textContent?.trim().toLowerCase();
    if (titulus === 'compatibilitas metrica') {
      section.remove();
    }
  });
}

function markiereFormaeMetricae() {
  document.querySelectorAll('.forma-card').forEach(card => {
    const sigla = liesLongaeSigla(card);
    const compatibilis = istFormaHexameterCompatibilis(sigla);

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
