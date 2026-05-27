function whatseposFormFixNorm(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u');
}

function whatseposFormFixDisplayLemma(item) {
  const lemma = String(item?.lemma || item?.forma || '');
  const norm = whatseposFormFixNorm(lemma);

  if (norm.startsWith('lauini')) return 'Lauini' + norm.slice('lauini'.length);
  if (norm.startsWith('itali')) return 'Itali' + norm.slice('itali'.length);

  return lemma;
}

function whatseposFormFixOpen(item) {
  if (item?.lexeme_id) {
    window.location.href = `lemma.html?lexeme_id=${encodeURIComponent(item.lexeme_id)}`;
    return;
  }

  if (item?.lemma) {
    window.location.href = `lemma.html?lemma=${encodeURIComponent(item.lemma)}`;
  }
}

function whatseposFormFixButtons() {
  const suggestiones = document.getElementById('vocabulariumSuggestiones');
  return Array.from(suggestiones?.querySelectorAll('.vocabularium-suggestio') || []);
}

function whatseposFormFixRender(resultata) {
  const suggestiones = document.getElementById('vocabulariumSuggestiones');
  if (!suggestiones) return;

  suggestiones.innerHTML = '';

  const visa = new Set();
  resultata.forEach(item => {
    const clavis = item.lexeme_id || item.lemma;
    if (!clavis || visa.has(clavis)) return;
    visa.add(clavis);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vocabularium-suggestio';
    b.dataset.lemma = item.lemma || '';
    b.dataset.lexemeId = item.lexeme_id || '';
    b.setAttribute('role', 'option');
    b.style.cssText = 'display:block;width:100%;text-align:left;padding:14px 18px;border:none;background:white;cursor:pointer;border-bottom:1px solid #eee';

    const strong = document.createElement('strong');
    strong.textContent = whatseposFormFixDisplayLemma(item);

    const span = document.createElement('span');
    span.style.color = '#6b7280';
    span.textContent = ` ${item.pars_orationis || ''}`;

    b.appendChild(strong);
    b.appendChild(span);
    b.addEventListener('mousedown', e => {
      e.preventDefault();
      whatseposFormFixOpen(item);
    });

    suggestiones.appendChild(b);
  });

  if (suggestiones.children.length > 0) {
    suggestiones.style.display = 'block';
    const first = whatseposFormFixButtons()[0];
    if (first) {
      first.classList.add('is-selected');
      first.setAttribute('aria-selected', 'true');
    }
  }
}

async function whatseposFormFixSearch() {
  const input = document.getElementById('vocabulariumQuaere');
  if (!input || !window.whatseposSupabase) return;

  const qOriginal = input.value.trim();
  const q = whatseposFormFixNorm(qOriginal);
  if (q.length < 2) return;

  const buttons = whatseposFormFixButtons();
  const ersterText = buttons[0]?.textContent || '';
  const zeigtNurAdde = buttons.length === 1 && /adde ut nouum headword/i.test(ersterText);

  const { data, error } = await window.whatseposSupabase
    .from('formae')
    .select('forma, lemma, pars_orationis, lexeme_id')
    .ilike('forma', `${q}%`)
    .limit(20);

  if (error || !data || !data.length) return;

  const exaktOderPrefix = data.filter(item =>
    whatseposFormFixNorm(item.forma).startsWith(q)
  );

  if (zeigtNurAdde || exaktOderPrefix.length) {
    whatseposFormFixRender(exaktOderPrefix.length ? exaktOderPrefix : data);
  }
}

function starteVocabulariumFormSuggestionesFix() {
  const input = document.getElementById('vocabulariumQuaere');
  if (!input || input.dataset.formSuggestionesFix === 'true') return;

  input.dataset.formSuggestionesFix = 'true';
  let timer = null;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(whatseposFormFixSearch, 230);
  });
}

window.addEventListener('DOMContentLoaded', starteVocabulariumFormSuggestionesFix);
setTimeout(starteVocabulariumFormSuggestionesFix, 250);
setTimeout(starteVocabulariumFormSuggestionesFix, 1000);
