import {
  estDiphthongusCommunis
} from './hexameter.js?v=20260531-u-intervocalicum-1';

const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-search-row{display:flex;align-items:flex-start;justify-content:center;gap:16px;width:min(100%,980px);margin:0 auto}
.vocabularium-search-column{flex:1;min-width:0;display:flex;flex-direction:column}
.vocabularium-search-column #vocabulariumQuaere{width:100%;margin:0}
.vocabularium-admin{display:flex;align-items:center;justify-content:center;margin:0;flex-shrink:0}
.vox-button{height:62px;padding:0 24px;border:none;border-radius:18px;background:#1faa4b;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;letter-spacing:.01em;box-shadow:0 10px 24px rgba(0,0,0,.16);transition:all .18s ease;white-space:nowrap}
.vox-button:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(0,0,0,.22)}
.adde-uerbum-panel{width:min(100%,760px);margin:0 auto 48px;padding:0;background:#f8fafc;text-align:left;border-radius:28px}
.adde-uerbum-panel[hidden]{display:none}
.adde-form-head{background:white;border-top:10px solid #673ab7;border-radius:14px;padding:28px 32px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.adde-form-head h2{margin:0 0 8px;font-size:34px}
.adde-form-head p{margin:0;color:#6b7280}
.adde-form-card{background:white;border-radius:14px;padding:24px 32px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.adde-form-card[hidden]{display:none}
.adde-uerbum-field label{display:block;margin-bottom:10px;font-weight:700;color:#202124}
.adde-uerbum-field input,
.adde-uerbum-field select{width:100%;max-width:none;margin:0;border:none;border-bottom:2px solid #dadce0;border-radius:0;background:white;padding:10px 0;font-size:22px}
.adde-uerbum-field input:focus,
.adde-uerbum-field select:focus{outline:none;border-bottom-color:#673ab7;box-shadow:none}
.adde-card-help{margin-top:8px;color:#6b7280;font-size:.95rem}
.adde-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.adde-uerbum-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}
.adde-uerbum-actions button{border-radius:16px}
.adde-uerbum-primary{border:none;background:#673ab7;color:white}
.adde-uerbum-secondary{border:1px solid #dadce0;background:white;color:#3c4043}
.adde-uerbum-status{min-height:1.4em;margin-top:14px;color:#374151}
.adde-uerbum-primary:disabled{opacity:.45;cursor:not-allowed}

.vocabularium-lemma-lista-rahmen{
  width:min(100%,980px);
  margin:18px auto 0;
  overflow:hidden;
  border:1px solid #e5e7eb;
  border-radius:18px;
  background:white;
  text-align:left
}

.vocabularium-lemma-lista-kopf{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 18px;
  border-bottom:1px solid #e5e7eb;
  background:#f8fafc;
  color:#6b7280;
  font-size:.95rem;
  font-weight:700
}

.vocabularium-lemma-lista{
  max-height:min(58vh,560px);
  overflow-y:auto;
  overscroll-behavior:contain
}

.vocabularium-lemma-item{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  width:100%;
  padding:13px 18px;
  border:none;
  border-bottom:1px solid #eef2f7;
  background:white;
  text-align:left;
  cursor:pointer;
  font-size:19px
}

.vocabularium-lemma-item:last-child{
  border-bottom:none
}

.vocabularium-lemma-item:hover,
.vocabularium-lemma-item:focus{
  outline:none;
  background:#eef2ff
}

.vocabularium-lemma-pars{
  color:#6b7280;
  font-size:.88rem;
  white-space:nowrap
}

.vocabularium-lemma-vacua{
  padding:18px;
  color:#6b7280
}

@media(max-width:900px){.vocabularium-search-row{flex-direction:column}.vocabularium-admin{width:100%}.vox-button{width:100%}.adde-detail-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `<button id="novumVerbumKnopf" type="button" class="vox-button">adde uerbum</button>`;

const lemmaListaRahmen = document.createElement('section');
lemmaListaRahmen.className = 'vocabularium-lemma-lista-rahmen';

lemmaListaRahmen.innerHTML = `
  <div class="vocabularium-lemma-lista-kopf">
    <span>Lemmata</span>
    <span id="vocabulariumLemmaNumerus"></span>
  </div>
  <div
    id="vocabulariumLemmaLista"
    class="vocabularium-lemma-lista"
    role="listbox"
    aria-label="Lemmata"
  ></div>
`;

const lemmaLista =
  lemmaListaRahmen.querySelector('#vocabulariumLemmaLista');

const lemmaNumerus =
  lemmaListaRahmen.querySelector('#vocabulariumLemmaNumerus');

let lemmataOmnia = [];
let lemmataPromissum = null;

const addePanel = document.createElement('section');
addePanel.id = 'addeUerbumPanel';
addePanel.className = 'adde-uerbum-panel';
addePanel.hidden = true;
addePanel.innerHTML = `
  <div class="adde-form-head">
    <h2>Adde uerbum</h2>
    <p>Longas vocales nota duplici puncto: <strong>o:ra</strong> → ōra.</p>
  </div>
  <div class="adde-form-card">
    <div class="adde-uerbum-field">
      <label for="addeLemma">Lemma / Headword</label>
      <input id="addeLemma" type="text" placeholder="o:ra">
      <div class="adde-card-help">Primum lemma insere.</div>
    </div>
  </div>
  <div class="adde-form-card" id="addeParsCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addePars">Pars orationis</label>
      <select id="addePars">
        <option value="">elige...</option>
        <option value="substantivum">substantivum</option>
        <option value="adiectivum">adiectivum</option>
        <option value="verbum">verbum</option>
        <option value="adverbium">adverbium</option>
      </select>
      <div class="adde-card-help">Deinde genus uerbi elige; tum tantum reliqua campa aperientur.</div>
    </div>
  </div>
  <div class="adde-form-card" id="addeGenusCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeGenus">Genus</label>
      <select id="addeGenus">
        <option value="">elige...</option>
        <option value="m">masculinum</option>
        <option value="f">femininum</option>
        <option value="n">neutrum</option>
      </select>
      <div class="adde-card-help">Erst danach werden die passenden Deklinationen angeboten.</div>
    </div>
  </div>
  <div class="adde-form-card" id="addeDeclinatioCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeDeclinatio">Declinatio substantivi</label>
      <select id="addeDeclinatio">
        <option value="">elige...</option>
        <option value="a">a-Deklination</option>
        <option value="o">o-Deklination</option>
        <option value="consonantica">konsonantische Deklination</option>
        <option value="i">i-Deklination</option>
        <option value="mixta">gemischte Deklination</option>
        <option value="u">u-Deklination</option>
        <option value="e">e-Deklination</option>
        <option value="indeclinabile">indeclinabile</option>
        <option value="irregularis">irregulär</option>
        <option value="graeca">graeca</option>
      </select>
    </div>
  </div>
  <div class="adde-form-card" id="addeGenitivCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeGenitivus">Genitivus singularis / Stammform</label>
      <input id="addeGenitivus" type="text" placeholder="regis, corporis, maris">
      <div class="adde-card-help">
        Nötig vor allem für die 3. Deklination und unklare Stämme.
      </div>
    </div>
  </div>
  <div class="adde-form-card" id="addeNumerusTypCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeNumerusTyp">Numerus</label>
      <select id="addeNumerusTyp">
        <option value="">elige...</option>
        <option value="sg_pl">Singular + Plural</option>
        <option value="singulare_tantum">singulare tantum</option>
        <option value="plurale_tantum">plurale tantum</option>
      </select>
    </div>
  </div>
  <div class="adde-form-card" id="addeAdiectivumCard" hidden>
    <div class="adde-uerbum-field"><label for="addeAdiectivumDeclinatio">Declinatio adiectivi</label><select id="addeAdiectivumDeclinatio"><option value="a_o">a-/o-Deklination</option><option value="consonantica">konsonantische Deklination</option><option value="i">i-Deklination</option><option value="indeclinabile">indeclinabile</option></select></div>
  </div>
    <div class="adde-form-card" id="addeConiugatioCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeConiugatio">Coniugatio</label>
      <select id="addeConiugatio">
        <option value="">elige...</option>
        <option value="a">a-Konjugation</option>
        <option value="e">e-Konjugation</option>
        <option value="i">i-Konjugation</option>
        <option value="consonantica">konsonantische Konjugation</option>
        <option value="mixta">gemischte Konjugation</option>
        <option value="irregularis">unregelmäßige Konjugation</option>
      </select>
      <div class="adde-card-help">Primum coniugationem elige.</div>
    </div>
  </div>

  <div class="adde-form-card" id="addeVerbumTypusCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeVerbumTypus">Typus verbi</label>
      <select id="addeVerbumTypus">
        <option value="">elige...</option>
        <option value="normale">normale</option>
        <option value="deponens">deponens</option>
        <option value="semideponens">semideponens</option>
        <option value="impersonale">impersonale</option>
      </select>
      <div class="adde-card-help">Deinde typum uerbi elige.</div>
    </div>
  </div>

  <div class="adde-form-card" id="addeVoxTypusCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeVoxTypus">Usus vocis</label>
      <select id="addeVoxTypus">
        <option value="">elige...</option>
        <option value="utraque">activum et passivum</option>
        <option value="activum_tantum">activum tantum</option>
        <option value="passivum_tantum">passivum tantum</option>
      </select>
      <div class="adde-card-help">
        Elige utrum formae actiuae, passiuae an utraeque generandae sint.
      </div>
    </div>
  </div>

  <div class="adde-form-card" id="addeInfinitivusCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeInfinitivus">Infinitivus praesentis</label>
      <input id="addeInfinitivus" type="text" placeholder="lauda:re">
    </div>
  </div>

  <div class="adde-form-card" id="addePerfectumCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addePerfectum">Perfectum 1. Sg.</label>
      <input id="addePerfectum" type="text" placeholder="lauda:ui:">
    </div>
  </div>

  <div class="adde-form-card" id="addeSupinumCard" hidden>
    <div class="adde-uerbum-field">
      <label for="addeSupinum">Supinum</label>
      <input id="addeSupinum" type="text" placeholder="lauda:tum">
    </div>
  </div>
  
  <div class="adde-uerbum-actions">
    <button id="addeCancel" type="button" class="adde-uerbum-secondary">revertere</button>
    <button id="addeSave" type="button" class="adde-uerbum-primary" disabled>servare</button>
  </div>
  <p id="addeStatus" class="adde-uerbum-status"></p>
`;

let row = null;

if (input && vocabulariumTab) {
  row = document.createElement('div');
  row.className = 'vocabularium-search-row';

  const column = document.createElement('div');
  column.className = 'vocabularium-search-column';

  input.parentNode.insertBefore(row, input);

  row.appendChild(column);
  column.appendChild(input);
  row.appendChild(adminBox);

  row.insertAdjacentElement('afterend', lemmaListaRahmen);

  vocabulariumTab.appendChild(addePanel);
}

const MACRA = { a:'ā', e:'ē', i:'ī', o:'ō', u:'ū', y:'ȳ', A:'Ā', E:'Ē', I:'Ī', O:'Ō', U:'Ū', Y:'Ȳ' };
const VOCALES = 'aeiouyāēīōūȳAEIOUYĀĒĪŌŪȲ';
const DIPHTHONGI = ['ae','au','oe','eu'];

function normalisiere(textus) {
  return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u'); 
}

function sineMacris(textus) {
  return String(textus || '').replace(/[āăáàâä]/g,'a').replace(/[ēĕéèêë]/g,'e').replace(/[īĭíìîï]/g,'i').replace(/[ōŏóòôö]/g,'o').replace(/[ūŭúùûü]/g,'u').replace(/[ȳýỳŷÿ]/g,'y').replace(/[ĀĂÁÀÂÄ]/g,'A').replace(/[ĒĔÉÈÊË]/g,'E').replace(/[ĪĬÍÌÎÏ]/g,'I').replace(/[ŌŎÓÒÔÖ]/g,'O').replace(/[ŪŬÚÙÛÜ]/g,'U').replace(/[ȲÝỲŶŸ]/g,'Y');
}

function exColonibusMacra(textus) {
  return String(textus || '').replace(/([aeiouyAEIOUY]):/g, (_, v) => MACRA[v] || v);
}

function clavisQuaestionis(textus) {
  return normalisiere(sineMacris(textus));
}

function clavisLemmae(item) {
  const lemma = clavisQuaestionis(item?.lemma || '');
  const lexemeId = String(item?.lexeme_id || '');

  return lexemeId
    ? `lexeme:${lexemeId}`
    : `lemma:${lemma}|pars:${normalisiere(item?.pars_orationis || '')}`;
}

function comparaLemmata(a, b) {
  return String(a?.lemma || '').localeCompare(
    String(b?.lemma || ''),
    'la',
    { sensitivity: 'base' }
  );
}

function reddeLemmaListam() {
  if (!lemmaLista) return;

  const q = clavisQuaestionis(input?.value || '');

  const visibilia = lemmataOmnia.filter(item =>
    clavisQuaestionis(item?.lemma || '').includes(q)
  );

  lemmaLista.innerHTML = '';

  if (lemmaNumerus) {
    lemmaNumerus.textContent =
      visibilia.length === lemmataOmnia.length
        ? String(visibilia.length)
        : `${visibilia.length} / ${lemmataOmnia.length}`;
  }

  if (!visibilia.length) {
    const div = document.createElement('div');
    div.className = 'vocabularium-lemma-vacua';
    div.textContent = 'Nulla lemmata inventa sunt.';
    lemmaLista.appendChild(div);
    return;
  }

  visibilia.forEach(item => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'vocabularium-lemma-item';
    button.dataset.lemma = item.lemma || '';
    button.dataset.lexemeId = item.lexeme_id || '';
    button.setAttribute('role', 'option');

    const strong = document.createElement('strong');
    strong.textContent = item.lemma || '—';

    const span = document.createElement('span');
    span.className = 'vocabularium-lemma-pars';
    span.textContent = item.pars_orationis || '';

    button.appendChild(strong);
    button.appendChild(span);

    button.addEventListener('click', () => {
      aperiLemma(item.lemma, item.lexeme_id || '');
    });

    lemmaLista.appendChild(button);
  });
}

async function exspectaSupabaseLemmaListae() {
  if (window.whatseposSupabase) {
    return window.whatseposSupabase;
  }

  return new Promise(resolve => {
    let tentamina = 0;

    const timer = setInterval(() => {
      tentamina += 1;

      if (window.whatseposSupabase || tentamina >= 60) {
        clearInterval(timer);
        resolve(window.whatseposSupabase || null);
      }
    }, 50);
  });
}

async function ladeLemmataOmnia() {
  if (!lemmaLista) return;
  if (lemmataPromissum) return lemmataPromissum;

  const supabase = await exspectaSupabaseLemmaListae();

  if (!supabase) {
    lemmaLista.innerHTML =
      `<div class="vocabularium-lemma-vacua">Lemmata nondum legi possunt.</div>`;

    return;
  }

  lemmataPromissum = (async function () {
    const resultata = [];
    const amplitudo = 1000;

    let initium = 0;

    while (true) {
      const { data, error } =
        await supabase
          .from('formae')
          .select('lemma, lexeme_id, pars_orationis')
          .not('lemma', 'is', null)
          .order('lemma', { ascending: true })
          .range(initium, initium + amplitudo - 1);

      if (error) {
        lemmaLista.innerHTML =
          `<div class="vocabularium-lemma-vacua">Lemmata nondum legi possunt.</div>`;

        return;
      }

      const pagina = data || [];

      resultata.push(...pagina);

      if (pagina.length < amplitudo) break;

      initium += amplitudo;
    }

    const visa = new Set();

    lemmataOmnia = resultata
      .filter(item => {
        if (!item?.lemma) return false;

        const clavis = clavisLemmae(item);

        if (visa.has(clavis)) return false;

        visa.add(clavis);
        return true;
      })
      .sort(comparaLemmata);

    reddeLemmaListam();
  })();

  try {
    await lemmataPromissum;
  } finally {
    lemmataPromissum = null;
  }
}

function estVocalis(c) { return VOCALES.includes(c || ''); }
function estLongaChar(c) { return /[āēīōūȳĀĒĪŌŪȲ]/.test(c || ''); }
function estDiphthongus(textus, i) {
  return estDiphthongusCommunis(textus, i, DIPHTHONGI);
}

function consonantificaAdSyllabas(textus) {
  const litterae = [...String(textus || '')];

  return litterae
    .map((littera, index) => {
      const simplex = sineMacris(littera).toLowerCase();
      const praecedens = litterae[index - 1] || '';
      const sequens = litterae[index + 1] || '';

      const praecedensEstVocalis = estVocalis(praecedens);
      const sequensEstVocalis = estVocalis(sequens);

      // u am Wortanfang oder zwischen zwei Vokalen ist konsonantisch:
      // u → v nur für die interne Analyse.
      if (
        simplex === 'u'
        && sequensEstVocalis
        && (index === 0 || praecedensEstVocalis)
      ) {
        return 'v';
      }

      // i am Wortanfang oder zwischen zwei Vokalen ist konsonantisch:
      // i → j nur für die interne Analyse.
      if (
        simplex === 'i'
        && sequensEstVocalis
        && (index === 0 || praecedensEstVocalis)
      ) {
        return 'j';
      }

      return littera;
    })
    .join('');
}

function nucleiVocalici(textus) {
  const s = String(textus || '');

  // Die Länge bleibt identisch, damit die Indizes weiterhin
  // auf die sichtbare Schreibweise mit u und i passen.
  const analysis = consonantificaAdSyllabas(s);

  const nuclei = [];

  for (let i = 0; i < analysis.length; i += 1) {
    if (!estVocalis(analysis[i])) continue;

    if (
      sineMacris(analysis[i]).toLowerCase() === 'u'
      && i > 0
      && sineMacris(analysis[i - 1]).toLowerCase() === 'q'
    ) {
      continue;
    }

    if (
      i < analysis.length - 1
      && estVocalis(analysis[i + 1])
      && estDiphthongus(analysis, i)
    ) {
      nuclei.push({ start: i, end: i + 1 });
      i += 1;
    } else {
      nuclei.push({ start: i, end: i });
    }
  }

  return nuclei;
}

function trenneSilben(textus) {
  const s = String(textus || '');
  const nuclei = nucleiVocalici(s);
  if (nuclei.length <= 1) return s ? [s] : [];
  const limites = [0];
  for (let i = 0; i < nuclei.length - 1; i += 1) {
    const links = nuclei[i];
    const rechts = nuclei[i + 1];
    const zwischenStart = links.end + 1;
    const zwischenEnd = rechts.start - 1;
    const zwischen = s.slice(zwischenStart, zwischenEnd + 1);
    limites.push(
      zwischen.length <= 1
        ? zwischenStart
        : zwischenStart + 1
    );
  }
  return limites.map((start, i) => s.slice(start, i + 1 < limites.length ? limites[i + 1] : s.length)).filter(Boolean);
}

function estSyllabaLongaNatura(syllaba) {
  return [...String(syllaba || '')].some(estLongaChar)
    || nucleiVocalici(syllaba).some(nucleus => nucleus.end > nucleus.start);
}

function indicesLongarum(syllabaeMacris) {
  return syllabaeMacris
    .map((syllaba, index) =>
      estSyllabaLongaNatura(syllaba) ? index : null
    )
    .filter(index => index !== null);
}

function recordumFormae({ formaMacris, lemmaNudum, pars, genus, numerus, casus }) {
  const syllabaeMacris = trenneSilben(formaMacris);

  return {
    forma: sineMacris(formaMacris).toLowerCase(),
    lemma: lemmaNudum,
    pars_orationis: pars,
    genus,
    numerus,
    casus,
    syllabae: syllabaeMacris
      .map(s => sineMacris(s).toLowerCase())
      .join('.'),
    longae: indicesLongarum(syllabaeMacris)
  };
}

function generaSubstantivumA({ lemmaInput, genus, numerusTyp }) {
  const lemmaMacris = exColonibusMacra(lemmaInput).trim();
  const lemmaNudum = sineMacris(lemmaMacris).toLowerCase();
  const stemma = lemmaMacris.replace(/a$/i, '');
  const formae = [];
  const add = (casus, numerus, exitus) => formae.push(recordumFormae({ formaMacris: stemma + exitus, lemmaNudum, pars:'substantivum', genus, numerus, casus }));
  if (numerusTyp !== 'plurale_tantum') { add('nom','sg','a'); add('gen','sg','ae'); add('dat','sg','ae'); add('acc','sg','am'); add('abl','sg','ā'); add('voc','sg','a'); }
  if (numerusTyp !== 'singulare_tantum') { add('nom','pl','ae'); add('gen','pl','ārum'); add('dat','pl','īs'); add('acc','pl','ās'); add('abl','pl','īs'); add('voc','pl','ae'); }
  return { lemmaNudum, formae };
}

function recordumVerbi({
  formaMacris,
  lemmaNudum,
  lexemeId,
  pars = 'verbum',
  numerus = null,
  persona = null,
  tempus = null,
  modus = null,
  vox = null
}) {
  const forma = String(formaMacris || '').trim();

  if (forma.includes(' ')) {
  const verba = forma
    .split(/\s+/)
    .filter(Boolean);

  const syllabaeMacris = [];

  verba.forEach((verbum, index) => {
    const syllabaeVerbi = trenneSilben(verbum);

    if (
      index < verba.length - 1 &&
      syllabaeVerbi.length > 0
    ) {
      syllabaeVerbi[syllabaeVerbi.length - 1] += ' ';
    }

    syllabaeMacris.push(...syllabaeVerbi);
  });

  return {
    forma: sineMacris(forma).toLowerCase(),
    lemma: lemmaNudum,
    lexeme_id: lexemeId,
    pars_orationis: pars,
    genus: null,
    numerus,
    casus: null,
    persona,
    tempus,
    modus,
    vox,
    syllabae: syllabaeMacris
      .map(s => sineMacris(s).toLowerCase())
      .join('.'),
    longae: indicesLongarum(syllabaeMacris)
  };
}

    return {
    ...recordumFormae({
      formaMacris: forma,
      lemmaNudum,
      pars,
      genus: null,
      numerus,
      casus: null
    }),
    lexeme_id: lexemeId,
    persona,
    tempus,
    modus,
    vox
  };
}

function generaVerbumA({
  lemmaInput,
  infinitivusInput,
  perfectumInput,
  supinumInput,
  uoces
}) {
  const lemmaMacris = exColonibusMacra(lemmaInput).trim();
  const lemmaNudum = sineMacris(lemmaMacris).toLowerCase();
  const lexemeId = crypto.randomUUID();

  const infinitivus = exColonibusMacra(infinitivusInput).trim();
  const perfectum = exColonibusMacra(perfectumInput).trim();
  const supinum = exColonibusMacra(supinumInput).trim();

  if (!/(āre|ārī)$/i.test(infinitivus)) {
    throw new Error('Infinitivus a-coniugationis in -a:re aut -a:ri: desinere debet.');
  }

  if (!/ī$/i.test(perfectum)) {
    throw new Error('Perfectum in -i: desinere debet.');
  }

  if (!/um$/i.test(supinum)) {
    throw new Error('Supinum in -um desinere debet.');
  }

  const stemmaPraesentis = infinitivus.replace(/(āre|ārī)$/i, 'ā');
  const radixPraesentis = stemmaPraesentis.slice(0, -1);
  const stemmaPerfecti = perfectum.replace(/ī$/i, '');
  const stemmaSupini = supinum.replace(/um$/i, '');

  const infinitivusActiuus = radixPraesentis + 'āre';
  const infinitivusPassiuus = radixPraesentis + 'ārī';
  const infinitivusActiuusLongoE =
    infinitivusActiuus.replace(/e$/i, 'ē');

  const formae = [];

  const personae = [
    ['1', 'sg'],
    ['2', 'sg'],
    ['3', 'sg'],
    ['1', 'pl'],
    ['2', 'pl'],
    ['3', 'pl']
  ];

  const add = ({
    formaMacris,
    pars = 'verbum',
    persona = null,
    numerus = null,
    tempus = null,
    modus = null,
    vox = null
  }) => {
      formae.push(recordumVerbi({
      formaMacris,
      lemmaNudum,
      lexemeId,
      pars,
      persona,
      numerus,
      tempus,
      modus,
      vox
    }));
  };

  const addSeries = (series, tempus, modus, vox) => {
    series.forEach((formaMacris, index) => {
      if (!formaMacris) return;

      add({
        formaMacris,
        persona: personae[index][0],
        numerus: personae[index][1],
        tempus,
        modus,
        vox
      });
    });
  };

  const habetActiuum =
    uoces === 'utraque' ||
    uoces === 'activum_tantum';

  const habetPassiuum =
    uoces === 'utraque' ||
    uoces === 'passivum_tantum';

  if (habetActiuum) {
    addSeries([
      radixPraesentis + 'ō',
      stemmaPraesentis + 's',
      radixPraesentis + 'at',
      stemmaPraesentis + 'mus',
      stemmaPraesentis + 'tis',
      radixPraesentis + 'ant'
    ], 'praes', 'ind', 'act');

    addSeries([
      stemmaPraesentis + 'bam',
      stemmaPraesentis + 'bās',
      stemmaPraesentis + 'bat',
      stemmaPraesentis + 'bāmus',
      stemmaPraesentis + 'bātis',
      stemmaPraesentis + 'bant'
    ], 'imperf', 'ind', 'act');

    addSeries([
      stemmaPraesentis + 'bō',
      stemmaPraesentis + 'bis',
      stemmaPraesentis + 'bit',
      stemmaPraesentis + 'bimus',
      stemmaPraesentis + 'bitis',
      stemmaPraesentis + 'bunt'
    ], 'fut', 'ind', 'act');

    addSeries([
      perfectum,
      stemmaPerfecti + 'istī',
      stemmaPerfecti + 'it',
      stemmaPerfecti + 'imus',
      stemmaPerfecti + 'istis',
      stemmaPerfecti + 'ērunt'
    ], 'perf', 'ind', 'act');

    addSeries([
      stemmaPerfecti + 'eram',
      stemmaPerfecti + 'erās',
      stemmaPerfecti + 'erat',
      stemmaPerfecti + 'erāmus',
      stemmaPerfecti + 'erātis',
      stemmaPerfecti + 'erant'
    ], 'plqpf', 'ind', 'act');

    addSeries([
      stemmaPerfecti + 'erō',
      stemmaPerfecti + 'eris',
      stemmaPerfecti + 'erit',
      stemmaPerfecti + 'erimus',
      stemmaPerfecti + 'eritis',
      stemmaPerfecti + 'erint'
    ], 'futperf', 'ind', 'act');

    addSeries([
      radixPraesentis + 'em',
      radixPraesentis + 'ēs',
      radixPraesentis + 'et',
      radixPraesentis + 'ēmus',
      radixPraesentis + 'ētis',
      radixPraesentis + 'ent'
    ], 'praes', 'coni', 'act');

    addSeries([
      infinitivusActiuus + 'm',
      infinitivusActiuusLongoE + 's',
      infinitivusActiuus + 't',
      infinitivusActiuusLongoE + 'mus',
      infinitivusActiuusLongoE + 'tis',
      infinitivusActiuus + 'nt'
    ], 'imperf', 'coni', 'act');
    
    addSeries([
      stemmaPerfecti + 'erim',
      stemmaPerfecti + 'erīs',
      stemmaPerfecti + 'erit',
      stemmaPerfecti + 'erīmus',
      stemmaPerfecti + 'erītis',
      stemmaPerfecti + 'erint'
    ], 'perf', 'coni', 'act');

    addSeries([
      stemmaPerfecti + 'issem',
      stemmaPerfecti + 'issēs',
      stemmaPerfecti + 'isset',
      stemmaPerfecti + 'issēmus',
      stemmaPerfecti + 'issētis',
      stemmaPerfecti + 'issent'
    ], 'plqpf', 'coni', 'act');

    addSeries([
      null,
      stemmaPraesentis,
      null,
      null,
      stemmaPraesentis + 'te',
      null
    ], 'praes', 'imp', 'act');

    addSeries([
      null,
      stemmaPraesentis + 'tō',
      stemmaPraesentis + 'tō',
      null,
      stemmaPraesentis + 'tōte',
      radixPraesentis + 'antō'
    ], 'fut', 'imp', 'act');

    add({
      formaMacris: infinitivusActiuus,
      pars: 'infinitivus',
      tempus: 'praes',
      vox: 'act'
    });

    add({
      formaMacris: stemmaPerfecti + 'isse',
      pars: 'infinitivus',
      tempus: 'perf',
      vox: 'act'
    });

    add({
      formaMacris: stemmaSupini + 'ūrus esse',
      pars: 'infinitivus',
      tempus: 'fut',
      vox: 'act'
    });

    add({
      formaMacris: stemmaPraesentis + 'ns',
      pars: 'participium',
      tempus: 'praes',
      vox: 'act'
    });

    add({
      formaMacris: stemmaSupini + 'ūrus',
      pars: 'participium',
      tempus: 'fut',
      vox: 'act'
    });
  }

  if (habetPassiuum) {
    addSeries([
      radixPraesentis + 'or',
      stemmaPraesentis + 'ris',
      stemmaPraesentis + 'tur',
      stemmaPraesentis + 'mur',
      stemmaPraesentis + 'minī',
      radixPraesentis + 'antur'
    ], 'praes', 'ind', 'pass');

    addSeries([
      stemmaPraesentis + 'bar',
      stemmaPraesentis + 'bāris',
      stemmaPraesentis + 'bātur',
      stemmaPraesentis + 'bāmur',
      stemmaPraesentis + 'bāminī',
      stemmaPraesentis + 'bantur'
    ], 'imperf', 'ind', 'pass');

    addSeries([
      stemmaPraesentis + 'bor',
      stemmaPraesentis + 'beris',
      stemmaPraesentis + 'bitur',
      stemmaPraesentis + 'bimur',
      stemmaPraesentis + 'biminī',
      stemmaPraesentis + 'buntur'
    ], 'fut', 'ind', 'pass');

    const auxiliaPerfecti = [
      ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
      ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
      ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erunt']
    ];

    auxiliaPerfecti.forEach((auxilia, index) => {
      const tempora = ['perf', 'plqpf', 'futperf'];

      addSeries(
        auxilia.map((auxilium, i) =>
          stemmaSupini + (i < 3 ? 'us ' : 'ī ') + auxilium
        ),
        tempora[index],
        'ind',
        'pass'
      );
    });

    addSeries([
      radixPraesentis + 'er',
      radixPraesentis + 'ēris',
      radixPraesentis + 'ētur',
      radixPraesentis + 'ēmur',
      radixPraesentis + 'ēminī',
      radixPraesentis + 'entur'
    ], 'praes', 'coni', 'pass');

    addSeries([
      stemmaPraesentis + 'rer',
      stemmaPraesentis + 'rēris',
      stemmaPraesentis + 'rētur',
      stemmaPraesentis + 'rēmur',
      stemmaPraesentis + 'rēminī',
      stemmaPraesentis + 'rentur'
    ], 'imperf', 'coni', 'pass');

    addSeries([
      stemmaSupini + 'us sim',
      stemmaSupini + 'us sīs',
      stemmaSupini + 'us sit',
      stemmaSupini + 'ī sīmus',
      stemmaSupini + 'ī sītis',
      stemmaSupini + 'ī sint'
    ], 'perf', 'coni', 'pass');

    addSeries([
      stemmaSupini + 'us essem',
      stemmaSupini + 'us essēs',
      stemmaSupini + 'us esset',
      stemmaSupini + 'ī essēmus',
      stemmaSupini + 'ī essētis',
      stemmaSupini + 'ī essent'
    ], 'plqpf', 'coni', 'pass');

    addSeries([
      null,
      stemmaPraesentis + 're',
      null,
      null,
      stemmaPraesentis + 'minī',
      null
    ], 'praes', 'imp', 'pass');

    addSeries([
      null,
      stemmaPraesentis + 'tor',
      stemmaPraesentis + 'tor',
      null,
      null,
      radixPraesentis + 'antor'
    ], 'fut', 'imp', 'pass');

    add({
      formaMacris: infinitivusPassiuus,
      pars: 'infinitivus',
      tempus: 'praes',
      vox: 'pass'
    });

    add({
      formaMacris: stemmaSupini + 'us esse',
      pars: 'infinitivus',
      tempus: 'perf',
      vox: 'pass'
    });

    add({
      formaMacris: stemmaSupini + 'um īrī',
      pars: 'infinitivus',
      tempus: 'fut',
      vox: 'pass'
    });

    add({
      formaMacris: stemmaSupini + 'us',
      pars: 'participium',
      tempus: 'perf',
      vox: 'pass'
    });

    add({
      formaMacris: radixPraesentis + 'andus',
      pars: 'gerundivum',
      vox: 'pass'
    });
  }

  add({
    formaMacris: supinum,
    pars: 'supinum_i'
  });

  add({
    formaMacris: stemmaSupini + 'ū',
    pars: 'supinum_ii'
  });

  return {
    lemmaNudum,
    lexemeId,
    formae
  };
}

function syncDeclinationesSubstantivi() {
  const genus = document.getElementById('addeGenus')?.value;
  const declinatio = document.getElementById('addeDeclinatio');
  const optioA = declinatio?.querySelector('option[value="a"]');
  if (!declinatio || !optioA) return;
  const aIncompatibilis = genus === 'n';
  optioA.disabled = aIncompatibilis;
  optioA.hidden = aIncompatibilis;
  if (aIncompatibilis && declinatio.value === 'a') declinatio.value = '';
}

function aperiLemma(lemma, lexemeId = '') {
  if (lexemeId) {
    window.location.href = `lemma.html?lexeme_id=${encodeURIComponent(lexemeId)}`;
    return;
  }
  if (lemma) {
    window.location.href = `lemma.html?lemma=${encodeURIComponent(lemma)}`;
  } 
}

function statusAdde(textus) {
  const p = document.getElementById('addeStatus');
  if (p) p.textContent = textus || '';
}

function syncAddeForm() {
  const lemma = document.getElementById('addeLemma')?.value.trim() || '';
  const pars = document.getElementById('addePars')?.value || '';
  const genus = document.getElementById('addeGenus')?.value || '';
  const declinatio = document.getElementById('addeDeclinatio')?.value || '';
  const numerusTyp = document.getElementById('addeNumerusTyp')?.value || '';

  document.getElementById('addeParsCard').hidden = lemma.length === 0;
  document.getElementById('addeGenusCard').hidden = pars !== 'substantivum';
  document.getElementById('addeDeclinatioCard').hidden = pars !== 'substantivum' || !genus;

  document.getElementById('addeNumerusTypCard').hidden =
    pars !== 'substantivum' || !genus || !declinatio;

  document.getElementById('addeGenitivCard').hidden =
    pars !== 'substantivum' ||
    !genus ||
    !declinatio ||
    !['consonantica', 'i', 'mixta', 'u', 'e', 'graeca', 'irregularis'].includes(declinatio);

  document.getElementById('addeAdiectivumCard').hidden = pars !== 'adiectivum';

    const coniugatio = document.getElementById('addeConiugatio')?.value || '';
  const typusVerbi = document.getElementById('addeVerbumTypus')?.value || '';
  const voxTypus = document.getElementById('addeVoxTypus')?.value || '';
  const infinitivus = document.getElementById('addeInfinitivus')?.value.trim() || '';
  const perfectum = document.getElementById('addePerfectum')?.value.trim() || '';

  document.getElementById('addeConiugatioCard').hidden =
    pars !== 'verbum';

  document.getElementById('addeVerbumTypusCard').hidden =
    pars !== 'verbum' || !coniugatio;

  document.getElementById('addeVoxTypusCard').hidden =
    pars !== 'verbum' || !coniugatio || !typusVerbi;

  document.getElementById('addeInfinitivusCard').hidden =
    pars !== 'verbum' || !coniugatio || !typusVerbi || !voxTypus;

  document.getElementById('addePerfectumCard').hidden =
    pars !== 'verbum' || !coniugatio || !typusVerbi || !voxTypus || !infinitivus;

  document.getElementById('addeSupinumCard').hidden =
    pars !== 'verbum' || !coniugatio || !typusVerbi || !voxTypus || !infinitivus || !perfectum;

  syncDeclinationesSubstantivi();

  let potestServari = Boolean(lemma && pars);

  if (pars === 'substantivum') {
    potestServari = Boolean(lemma && genus && declinatio && numerusTyp);
  }

    if (pars === 'verbum') {
      const supinum = document.getElementById('addeSupinum')?.value.trim() || '';
  
      potestServari = Boolean(
        lemma &&
        coniugatio &&
        typusVerbi &&
        voxTypus &&
        infinitivus &&
        perfectum &&
        supinum
      );
    }

  document.getElementById('addeSave').disabled = !potestServari;
}
function resetDependentiaSubstantivi() {
  const declinatio = document.getElementById('addeDeclinatio');
  const numerusTyp = document.getElementById('addeNumerusTyp');
  if (declinatio) declinatio.value = '';
  if (numerusTyp) numerusTyp.value = '';
}
function aperiAddeUerbum(lemmaPraeplenum = '') {
  leereSuggestiones();

  if (row) row.style.display = 'none';
  if (eventus) eventus.style.display = 'none';
  if (status) status.style.display = 'none';
  if (lemmaListaRahmen) lemmaListaRahmen.style.display = 'none';

  addePanel.hidden = false;

  document.getElementById('addeLemma').value = lemmaPraeplenum || '';
  document.getElementById('addePars').value = '';
  document.getElementById('addeGenus').value = '';
  document.getElementById('addeDeclinatio').value = '';
  document.getElementById('addeGenitivus').value = '';
  document.getElementById('addeNumerusTyp').value = '';

  document.getElementById('addeAdiectivumDeclinatio').value = 'a_o';

  document.getElementById('addeConiugatio').value = '';
  document.getElementById('addeVerbumTypus').value = '';
  document.getElementById('addeVoxTypus').value = '';
  document.getElementById('addeInfinitivus').value = '';
  document.getElementById('addePerfectum').value = '';
  document.getElementById('addeSupinum').value = '';

  syncAddeForm();
  statusAdde('');
  document.getElementById('addeLemma').focus();
}

function schliesseAddeUerbum() {
  addePanel.hidden = true;

  if (row) row.style.display = 'flex';
  if (eventus) eventus.style.display = '';
  if (status) status.style.display = '';
  if (lemmaListaRahmen) lemmaListaRahmen.style.display = '';

  reddeLemmaListam();

  input?.focus();
}

function erzeugeAddeSuggestio(lemmaNeu) { const b = document.createElement('button'); b.type='button'; b.className='vocabularium-suggestio is-selected'; b.dataset.action='adde'; b.dataset.lemma=lemmaNeu; b.style.cssText='display:block;width:100%;text-align:left;padding:14px 18px;border:none;background:white;cursor:pointer;border-bottom:1px solid #eee'; b.innerHTML=`<strong>${lemmaNeu}</strong> <span style="color:#6b7280">adde ut nouum headword</span>`; b.addEventListener('mousedown', e => { e.preventDefault(); aperiAddeUerbum(lemmaNeu); }); suggestiones.appendChild(b); suggestiones.style.display='block'; suggestioSelectaIndex=0; }
function oeffneSuggestioSelecta() {
  const b = suggestioButtons()[suggestioSelectaIndex];
  const lemma = b?.dataset?.lemma;
  const lexemeId = b?.dataset?.lexemeId || '';

  if (!lemma) return;

  b.dataset.action === 'adde'
    ? aperiAddeUerbum(lemma)
    : aperiLemma(lemma, lexemeId);
}
async function quaereSuggestiones() {
  if (!window.whatseposSupabase || !input) return;
  const qOriginal = input.value.trim(); const q = normalisiere(qOriginal); leereSuggestiones(); if (q.length < 2) return;
  const { data, error } = await window.whatseposSupabase.from('formae').select('forma, lemma, pars_orationis, syllabae, longae, lexeme_id').ilike('lemma', `${q}%`).limit(10);
  if (error) return;
  if (!data || !data.length) { nullusEventusLemma = qOriginal; erzeugeAddeSuggestio(qOriginal); return; }
  const visa = new Set();
  data.forEach(item => { if (!item.lemma || visa.has(item.lemma)) return; 
                        visa.add(item.lemma); 
                        const b = document.createElement('button'); 
                        b.type='button'; b.className='vocabularium-suggestio'; 
                        b.dataset.lemma=item.lemma;
                        b.dataset.lexemeId = item.lexeme_id || '';
                        b.setAttribute('role','option'); 
                        b.style.cssText='display:block;width:100%;text-align:left;padding:14px 18px;border:none;background:white;cursor:pointer;border-bottom:1px solid #eee'; 
                        const strong=document.createElement('strong'); 
                        strong.textContent=formaSupabaseSignata({ ...item, forma:item.lemma }) || item.lemma;
                        const span=document.createElement('span'); 
                        span.style.color='#6b7280'; 
                        span.textContent=` ${item.pars_orationis || ''}`; 
                        b.appendChild(strong); 
                        b.appendChild(span); 
                        b.addEventListener('mouseenter', () => { 
                          const i=suggestioButtons().indexOf(b); 
                          if (i >= 0) setzeSuggestioSelecta(i);
                        });
                        b.addEventListener('mousedown', e => { 
                          e.preventDefault(); 
                          aperiLemma(item.lemma, item.lexeme_id);
                          }); 
                        suggestiones.appendChild(b); });
  if (suggestiones.children.length > 0) { suggestiones.style.display='block'; setzeSuggestioSelecta(0); }
}
function aperiNouumLemma(lemmaNudum) {
  window.location.href = `lemma.html?lemma=${encodeURIComponent(lemmaNudum)}`;
}

async function speichereAddeFormular() {
  if (!window.whatseposSupabase) return;
  const lemmaInput = document.getElementById('addeLemma')?.value.trim();
  const pars = document.getElementById('addePars')?.value;
  if (!lemmaInput || !pars) { statusAdde('Lemma et pars orationis necessaria sunt.'); return; }
    if (pars === 'verbum') {
    const coniugatio =
      document.getElementById('addeConiugatio')?.value || '';

    const typus =
      document.getElementById('addeVerbumTypus')?.value || '';

    const uoces =
      document.getElementById('addeVoxTypus')?.value || '';

    const infinitivus =
      document.getElementById('addeInfinitivus')?.value.trim() || '';

    const perfectum =
      document.getElementById('addePerfectum')?.value.trim() || '';

    const supinum =
      document.getElementById('addeSupinum')?.value.trim() || '';

    if (coniugatio !== 'a') {
      statusAdde('Nunc tantum uerba a-coniugationis servari possunt.');
      return;
    }

    if (typus !== 'normale') {
      statusAdde('Nunc tantum uerba normalia servari possunt.');
      return;
    }

    let paradigma;

    try {
      paradigma = generaVerbumA({
        lemmaInput,
        infinitivusInput: infinitivus,
        perfectumInput: perfectum,
        supinumInput: supinum,
        uoces
      });
    } catch (error) {
      statusAdde(error.message);
      return;
    }

    const { lemmaNudum, lexemeId, formae } = paradigma;

    const { error } =
      await window.whatseposSupabase
        .from('formae')
        .insert(formae);

    if (error) {
      statusAdde(error.message);
      return;
    }

    window.location.href =
    `lemma.html?lexeme_id=${encodeURIComponent(lexemeId)}`;

    return;
  }
  
  if (pars === 'substantivum') {
    const declinatio = document.getElementById('addeDeclinatio')?.value;
    if (declinatio === 'a') {
      const { lemmaNudum, formae } = generaSubstantivumA({ lemmaInput, genus: document.getElementById('addeGenus')?.value || null, numerusTyp: document.getElementById('addeNumerusTyp')?.value || 'sg_pl' });
      const { error } = await window.whatseposSupabase.from('formae').insert(formae);
      if (error) { statusAdde(error.message); return; }
      aperiNouumLemma(lemmaNudum);
      return;
    }
  }
  const lemmaMacris = exColonibusMacra(lemmaInput);
  const lemmaNudum = sineMacris(lemmaMacris).toLowerCase();
  const record = recordumFormae({ formaMacris: lemmaMacris, lemmaNudum, pars, genus:null, numerus:null, casus:null });
  const { error } = await window.whatseposSupabase.from('formae').insert([record]);
  if (error) { statusAdde(error.message); return; }
  aperiNouumLemma(lemmaNudum);
}

const zeigeTabOriginal = window.zeigeTab;
const scriptoriumTitulus = document.querySelector('.container > h1');
window.zeigeTab = async function(tabName) {
  if (typeof zeigeTabOriginal === 'function') {
    await zeigeTabOriginal(tabName);
  }

  if (tabName === 'vocabularium') {
    if (row && addePanel.hidden) row.style.display = 'flex';

    if (lemmaListaRahmen && addePanel.hidden) {
      lemmaListaRahmen.style.display = '';
    }

    await ladeLemmataOmnia();
    reddeLemmaListam();

    if (scriptoriumTitulus) {
      scriptoriumTitulus.textContent = 'Uocabularium';
    }
  } else {
    if (row) row.style.display = 'none';
    if (lemmaListaRahmen) lemmaListaRahmen.style.display = 'none';

    addePanel.hidden = true;

    if (scriptoriumTitulus) {
      scriptoriumTitulus.textContent = 'Scriptorium';
    }
  }
};

if (input) {
  let timer = null;
  input.addEventListener('input', () => {
  reddeLemmaListam();

  clearTimeout(timer);
  timer = setTimeout(quaereSuggestiones, 150);
});
input.addEventListener('keydown', e => {
  const buttons = suggestioButtons();
  if (e.key === 'ArrowDown' && buttons.length) {
    e.preventDefault();
    setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? 0 : suggestioSelectaIndex + 1);
    return;
  } 
  if (e.key === 'ArrowUp' && buttons.length) {
    e.preventDefault(); setzeSuggestioSelecta(suggestioSelectaIndex < 0 ? buttons.length - 1 : suggestioSelectaIndex - 1);
    return; 
  } 
  if (e.key === 'Enter') {
    e.preventDefault();
    if (buttons.length) {
      if (suggestioSelectaIndex < 0) setzeSuggestioSelecta(0); oeffneSuggestioSelecta();
    } else if (input.value.trim()) aperiAddeUerbum(input.value.trim()); 
  } 
}); 
  input.addEventListener('blur', () => setTimeout(() => {
    if (addePanel.hidden) leereSuggestiones();
  }, 120)); 
}

document.getElementById('novumVerbumKnopf')?.addEventListener('click', () => aperiAddeUerbum(nullusEventusLemma || input?.value.trim() || ''));
document.getElementById('addeLemma')?.addEventListener('input', syncAddeForm);
document.getElementById('addePars')?.addEventListener('change', syncAddeForm);
document.getElementById('addeGenus')?.addEventListener('change', () => { resetDependentiaSubstantivi(); syncAddeForm(); });
document.getElementById('addeDeclinatio')?.addEventListener('change', () => { const numerusTyp = document.getElementById('addeNumerusTyp'); if (numerusTyp) numerusTyp.value = ''; syncAddeForm(); });
document.getElementById('addeNumerusTyp')?.addEventListener('change', syncAddeForm);
document.getElementById('addeConiugatio')?.addEventListener('change', syncAddeForm);
document.getElementById('addeVerbumTypus')?.addEventListener('change', syncAddeForm);
document.getElementById('addeVoxTypus')?.addEventListener('change', syncAddeForm);
document.getElementById('addeInfinitivus')?.addEventListener('input', syncAddeForm);
document.getElementById('addePerfectum')?.addEventListener('input', syncAddeForm);
document.getElementById('addeSupinum')?.addEventListener('input', syncAddeForm);
document.getElementById('addeCancel')?.addEventListener('click', schliesseAddeUerbum);
document.getElementById('addeSave')?.addEventListener('click', speichereAddeFormular);
ladeLemmataOmnia().then(() => {
  reddeLemmaListam();
});
