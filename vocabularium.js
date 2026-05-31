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

.adde-adpositio-casus{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px 20px;
  margin-top:8px
}

.adde-adpositio-casus label{
  display:flex;
  align-items:center;
  gap:10px;
  margin:0;
  font-weight:400;
  cursor:pointer
}

.adde-adpositio-casus input{
  width:auto;
  margin:0
}

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
  display:grid;
  grid-template-columns:minmax(150px,220px) minmax(0,1fr) auto;
  align-items:baseline;
  column-gap:22px;
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

.vocabularium-lemma-principale{
  min-width:0
}

.vocabularium-lemma-info{
  min-width:0;
  font-weight:400
}

.vocabularium-lemma-genus{
  font-style:italic
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

@media(max-width:900px){
  .vocabularium-search-row{flex-direction:column}
  .vocabularium-admin{width:100%}
  .vox-button{width:100%}
  .adde-detail-grid{grid-template-columns:1fr}

  .vocabularium-lemma-item{
    grid-template-columns:minmax(110px,150px) minmax(0,1fr) auto;
    column-gap:14px
  }
}

@media(max-width:620px){
  .vocabularium-lemma-item{
    grid-template-columns:minmax(100px,135px) minmax(0,1fr);
    row-gap:4px
  }

  .vocabularium-lemma-pars{
    grid-column:2;
    font-size:.78rem
  }
}
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
        <option value="coniunctio">coniunctio</option>
        <option value="adpositio">adpositio</option>
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
  <div class="adde-form-card" id="addeAdiectivumFemininumCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeAdiectivumFemininum">
      Nominativus singularis feminini
    </label>
    <input
      id="addeAdiectivumFemininum"
      type="text"
      placeholder="alta, pulchra, libera, celeris"
    >
  </div>
</div>

<div class="adde-form-card" id="addeAdiectivumNeutrumCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeAdiectivumNeutrum">
      Nominativus singularis neutri
    </label>
    <input
      id="addeAdiectivumNeutrum"
      type="text"
      placeholder="altum, pulchrum, liberum, celere"
    >
  </div>
</div>

<div class="adde-form-card" id="addeAdiectivumCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeAdiectivumDeclinatio">
      Declinatio adiectivi
    </label>

    <select id="addeAdiectivumDeclinatio">
      <option value="">elige...</option>
      <option value="a_o">a-/o-Deklination</option>
      <option value="i">i-Deklination</option>
      <option value="consonantica">konsonantische Deklination</option>
      <option value="indeclinabile">indeclinabile</option>
    </select>

    <div class="adde-card-help">
      Nunc adiectiua a-/o-declinationis et adiectiua i-declinationis trium terminationum generari possunt.
    </div>
  </div>
</div>

<div class="adde-form-card" id="addeConiunctioTypusCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeConiunctioTypus">
      Typus coniunctionis
    </label>

    <select id="addeConiunctioTypus">
      <option value="">elige...</option>
      <option value="paratactica">coniunctio paratactica</option>
      <option value="hypotactica">subiunctio hypotactica</option>
    </select>

    <div class="adde-card-help">
      Elige utrum coniunctio membra paratactice an hypotactice conectat.
    </div>
  </div>
</div>

<div class="adde-form-card" id="addeConiunctioEncliticaCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeConiunctioEnclitica">
      Estne enclitica?
    </label>

    <select id="addeConiunctioEnclitica">
      <option value="">elige...</option>
      <option value="false">non</option>
      <option value="true">ita</option>
    </select>

    <div class="adde-card-help">
      Exemplum: -que enclitica est. Hyphen initiale inseri potest, sed non servabitur.
    </div>
  </div>
</div>

<div class="adde-form-card" id="addeAdpositioTypusCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeAdpositioTypus">Typus adpositionis</label>

    <select id="addeAdpositioTypus">
      <option value="">elige...</option>
      <option value="praepositio">praepositio</option>
      <option value="postpositio">postpositio</option>
    </select>

    <div class="adde-card-help">
      Elige utrum adpositio ante an post nomen ponatur.
    </div>
  </div>
</div>

<div class="adde-form-card" id="addeAdpositioCasusCard" hidden>
  <div class="adde-uerbum-field">
    <label>Quem casum regit?</label>

    <div class="adde-adpositio-casus">
      <label>
        <input
          type="checkbox"
          name="addeAdpositioCasus"
          value="gen"
        >
        genetivus
      </label>

      <label>
        <input
          type="checkbox"
          name="addeAdpositioCasus"
          value="dat"
        >
        dativus
      </label>

      <label>
        <input
          type="checkbox"
          name="addeAdpositioCasus"
          value="acc"
        >
        accusativus
      </label>

      <label>
        <input
          type="checkbox"
          name="addeAdpositioCasus"
          value="abl"
        >
        ablativus
      </label>
    </div>

    <div class="adde-card-help">
      Plures casus simul eligi possunt.
    </div>
  </div>
</div>

<div class="adde-form-card" id="addeAdpositioFormaeVariaeCard" hidden>
  <div class="adde-uerbum-field">
    <label for="addeAdpositioFormaeVariae">
      Formae variae
    </label>

    <input
      id="addeAdpositioFormaeVariae"
      type="text"
      placeholder="a:, abs"
    >

    <div class="adde-card-help">
      Formas varias commatibus separa. Campus omitti potest.
    </div>
  </div>
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

function sineHyphenoInitiali(textus) {
  return String(textus || '')
    .trim()
    .replace(/^-+/, '');
}

function clavisQuaestionis(textus) {
  return normalisiere(
    sineMacris(
      sineHyphenoInitiali(textus)
    )
  );
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

function estParsOrationis(recordum, pars) {
  return clavisQuaestionis(recordum?.pars_orationis || '') ===
    clavisQuaestionis(pars);
}

function idemCampus(recordum, campus, valor) {
  return clavisQuaestionis(recordum?.[campus] || '') ===
    clavisQuaestionis(valor);
}

function formaeLemmae(item) {
  return Array.isArray(item?.formae)
    ? item.formae
    : [item];
}

function indicesLongarumRecordi(recordum) {
  if (Array.isArray(recordum?.longae)) {
    return recordum.longae
      .map(Number)
      .filter(index => Number.isInteger(index));
  }

  return String(recordum?.longae || '')
    .toUpperCase()
    .replace(/[.\s-]/g, '')
    .split('')
    .map((siglum, index) => siglum === 'L' ? index : null)
    .filter(index => index !== null);
}

function syllabaCumMacron(syllaba) {
  const nuclei = nucleiVocalici(syllaba);
  const nucleus = nuclei[0];

  if (!nucleus) return syllaba;

  /*
   * Ein Diphthong ist bereits von Natur aus lang.
   * Wir wollen also beispielsweise ae nicht als āe darstellen.
   */
  if (nucleus.end > nucleus.start) return syllaba;

  const index = nucleus.start;
  const vocalis = syllaba[index];

  return (
    syllaba.slice(0, index) +
    (MACRA[vocalis] || vocalis) +
    syllaba.slice(index + 1)
  );
}

function formaCumMacris(recordum) {
  const syllabae = String(recordum?.syllabae || '')
    .split('.')
    .filter(Boolean);

  /*
   * Ältere Datensätze können Makra noch unmittelbar in forma enthalten.
   * Ohne syllabae verwenden wir daher die gespeicherte Form unverändert.
   */
  if (!syllabae.length) {
    return recordum?.forma || '';
  }

  const longae = new Set(
    indicesLongarumRecordi(recordum)
  );

  return syllabae
    .map((syllaba, index) =>
      longae.has(index)
        ? syllabaCumMacron(syllaba)
        : syllaba
    )
    .join('');

  function formaCumPraefixoEnclitico(recordum) {
  const forma =
    formaCumMacris(recordum) ||
    recordum?.lemma ||
    '';

  if (recordum?.enclitica !== true) {
    return forma;
  }

  return '-' + sineHyphenoInitiali(forma);
}
  
}

function primaForma(formae, condicio) {
  const recordum = formae.find(condicio);

  return recordum
    ? formaCumMacris(recordum)
    : '';
}

function notaeSubstantivi(item) {
  const formae = formaeLemmae(item);

  const formaeSubstantivi = formae.filter(forma =>
    estParsOrationis(forma, 'substantivum')
  );

  const habetSingularem = formaeSubstantivi.some(forma =>
    idemCampus(forma, 'numerus', 'sg')
  );

  const habetPluralem = formaeSubstantivi.some(forma =>
    idemCampus(forma, 'numerus', 'pl')
  );

  const estPluraleTantum =
    !habetSingularem &&
    habetPluralem;

  const genitivusSingularis = primaForma(formaeSubstantivi, forma =>
    idemCampus(forma, 'casus', 'gen') &&
    idemCampus(forma, 'numerus', 'sg')
  );

  const genitivusPluralis = primaForma(formaeSubstantivi, forma =>
    idemCampus(forma, 'casus', 'gen') &&
    idemCampus(forma, 'numerus', 'pl')
  );

  const genitivus =
    genitivusSingularis ||
    genitivusPluralis;

  const genus =
    formaeSubstantivi.find(forma =>
      forma.genus
    )?.genus || '';

  const notaGeneris =
    genus
      ? genus + (estPluraleTantum ? 'pl' : '')
      : '';

  return {
    textus: genitivus,
    genus: notaGeneris
  };
}

function notaeGenerum(item, pars) {
  const formae = formaeLemmae(item);

  const nominatiui = ['m', 'f', 'n']
    .map(genus =>
      primaForma(formae, forma =>
        estParsOrationis(forma, pars) &&
        idemCampus(forma, 'casus', 'nom') &&
        idemCampus(forma, 'numerus', 'sg') &&
        idemCampus(forma, 'genus', genus)
      )
    )
    .filter(Boolean);

  const indexLemmae = nominatiui.findIndex(forma =>
    clavisQuaestionis(forma) === clavisQuaestionis(item?.lemma || '')
  );

  if (indexLemmae >= 0) {
    nominatiui.splice(indexLemmae, 1);
  }

  return nominatiui.join(', ');
}

function notaeVerbi(item) {
  const formae = formaeLemmae(item);

  const infinitivus =
    primaForma(formae, forma =>
      estParsOrationis(forma, 'infinitivus') &&
      idemCampus(forma, 'tempus', 'praes') &&
      idemCampus(forma, 'vox', 'act')
    ) ||
    primaForma(formae, forma =>
      estParsOrationis(forma, 'infinitivus') &&
      idemCampus(forma, 'tempus', 'praes') &&
      idemCampus(forma, 'vox', 'pass')
    );

  const perfectum = primaForma(formae, forma =>
    estParsOrationis(forma, 'verbum') &&
    idemCampus(forma, 'tempus', 'perf') &&
    idemCampus(forma, 'modus', 'ind') &&
    idemCampus(forma, 'vox', 'act') &&
    idemCampus(forma, 'persona', '1') &&
    idemCampus(forma, 'numerus', 'sg')
  );

  const supinum = primaForma(formae, forma =>
    estParsOrationis(forma, 'supinum_i')
  );

  return [
    infinitivus,
    perfectum,
    supinum
  ]
    .filter(Boolean)
    .join(', ');
}

function notaeAdpositionis(item) {
  const formae = formaeLemmae(item);

  const casusNomina = {
    gen: 'gen',
    dat: 'dat',
    abl: 'abl',
    acc: 'acc'
  };

  const ordoCasuum = [
    'gen',
    'dat',
    'acc',
    'abl'
  ];

  const casus = [
    ...new Set(
      formae
        .map(forma =>
          normalisiere(forma?.casus || '')
        )
        .filter(Boolean)
    )
  ]
    .sort(
      (a, b) =>
        ordoCasuum.indexOf(a) -
        ordoCasuum.indexOf(b)
    )
    .map(casusSingularis =>
      casusNomina[casusSingularis] ||
      casusSingularis
    );
  
  const notaCasuum =
    casus.length
      ? `[+${casus.join('/')}]`
      : '';

  const lemma =
    clavisQuaestionis(item?.lemma || '');

  const formaeVariae = [
    ...new Map(
      formae
        .map(forma => {
          const formaSignata =
            formaCumMacris(forma);

          return [
            clavisQuaestionis(formaSignata),
            formaSignata
          ];
        })
        .filter(([clavis, formaSignata]) =>
          clavis &&
          formaSignata &&
          clavis !== lemma
        )
    ).values()
  ];

  return {
    textus: [
      formaeVariae.join(', '),
      notaCasuum
    ]
      .filter(Boolean)
      .join(' '),
  
    genus: ''
  };
}

function notaeConiunctionis(item) {
  const typus =
    normalisiere(item?.typus_coniunctionis || '');

  const notaTypi =
    typus === 'paratactica'
      ? 'paratactica'
      : typus === 'hypotactica'
        ? 'hypotactica'
        : '';

  return {
    textus: [
      notaTypi,
      item?.enclitica === true
        ? 'enclitica'
        : ''
    ]
      .filter(Boolean)
      .join(' · '),

    genus: ''
  };
}

function parsOrationisVisibilis(item) {
  if (
    estParsOrationis(item, 'coniunctio') &&
    normalisiere(item?.typus_coniunctionis || '') === 'hypotactica'
  ) {
    return 'subiunctio';
  }

  return item?.pars_orationis || '';
}

function notaeLemmae(item) {
  if (estParsOrationis(item, 'coniunctio')) {
    return notaeConiunctionis(item);
  }

  if (estParsOrationis(item, 'substantivum')) {
    return notaeSubstantivi(item);
  }

  if (estParsOrationis(item, 'adiectivum')) {
    return {
      textus: notaeGenerum(item, 'adiectivum'),
      genus: ''
    };
  }
  
  if (estParsOrationis(item, 'pronomen')) {
    return {
      textus: notaeGenerum(item, 'pronomen'),
      genus: ''
    };
  }

  if (estParsOrationis(item, 'verbum')) {
    return {
      textus: notaeVerbi(item),
      genus: ''
    };
  }

  if (
    estParsOrationis(item, 'praepositio') ||
    estParsOrationis(item, 'postpositio')
  ) {
    return notaeAdpositionis(item);
  }

  return {
    textus: '',
    genus: ''
  };
}

function eligeRecordumPrincipale(formae) {
  return (
    formae.find(forma =>
      clavisQuaestionis(forma?.forma || '') ===
        clavisQuaestionis(forma?.lemma || '') &&
      (
        estParsOrationis(forma, 'verbum') ||
        estParsOrationis(forma, 'substantivum') ||
        estParsOrationis(forma, 'adiectivum') ||
        estParsOrationis(forma, 'pronomen') ||
        estParsOrationis(forma, 'coniunctio') ||
        estParsOrationis(forma, 'praepositio') ||
        estParsOrationis(forma, 'postpositio')
      )
    ) ||
    formae.find(forma => estParsOrationis(forma, 'verbum')) ||
    formae.find(forma => estParsOrationis(forma, 'substantivum')) ||
    formae.find(forma => estParsOrationis(forma, 'adiectivum')) ||
    formae.find(forma => estParsOrationis(forma, 'pronomen')) ||
    formae.find(forma => estParsOrationis(forma, 'coniunctio')) ||
    formae.find(forma =>
      estParsOrationis(forma, 'praepositio')
    ) ||
    formae.find(forma =>
      estParsOrationis(forma, 'postpositio')
    ) ||
    formae[0]
  );
}

function reddeLemmaListam() {
  if (!lemmaLista) return;

  const q = clavisQuaestionis(input?.value || '');

  const formaeQuaeribiles = item => [
    item?.lemma || '',
    ...formaeLemmae(item)
      .map(forma => forma?.forma || '')
  ];
  
  const congruentiaExacta = lemmataOmnia.filter(item =>
    formaeQuaeribiles(item)
      .some(forma =>
        clavisQuaestionis(forma) === q
      )
  );
  
  const congruentiaPartialia = lemmataOmnia.filter(item =>
    formaeQuaeribiles(item)
      .some(forma =>
        clavisQuaestionis(forma).includes(q)
      )
  );
  
  const visibilia = [
    ...congruentiaExacta,
    ...congruentiaPartialia.filter(item =>
      !congruentiaExacta.includes(item)
    )
  ];
  
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

    const principale = document.createElement('span');
    principale.className = 'vocabularium-lemma-principale';

    strong.textContent =
    formaCumPraefixoEnclitico(item) ||
    item.lemma ||
    '—';

    const notae = notaeLemmae(item);

    const info = document.createElement('span');
    info.className = 'vocabularium-lemma-info';

    if (notae.textus) {
      info.appendChild(
        document.createTextNode(notae.textus)
      );
    }

    if (notae.genus) {
      if (notae.textus) {
        info.appendChild(
          document.createTextNode(' ')
        );
      }

      const genus = document.createElement('em');
      genus.className = 'vocabularium-lemma-genus';
      genus.textContent = notae.genus;

      info.appendChild(genus);
    }
    
    const span = document.createElement('span');
    span.className = 'vocabularium-lemma-pars';
    span.textContent = parsOrationisVisibilis(item);

    principale.appendChild(strong);

    button.appendChild(principale);
    button.appendChild(info);
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
          .select('lemma, lexeme_id, pars_orationis, forma, genus, numerus, casus, persona, tempus, modus, vox, syllabae, longae, typus_coniunctionis, enclitica')
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

        const greges = new Map();

    resultata.forEach(item => {
      if (!item?.lemma) return;

      const clavis = clavisLemmae(item);

      if (!greges.has(clavis)) {
        greges.set(clavis, []);
      }

      greges.get(clavis).push(item);
    });

    lemmataOmnia = [...greges.values()]
      .map(formae => {
        const principale =
          eligeRecordumPrincipale(formae) ||
          formae[0];

        return {
          ...principale,
          formae
        };
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

function estVocalis(c) {
  const littera = String(c || '');
  return littera.length === 1 && VOCALES.includes(littera);
}

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
    forma: sineMacris(formaMacris),
    lemma: lemmaNudum,
    pars_orationis: pars,
    genus,
    numerus,
    casus,
    syllabae: syllabaeMacris
      .map(s => sineMacris(s))
      .join('.'),
    longae: indicesLongarum(syllabaeMacris)
  };
}

function generaAdiectivumAO({
  lemmaInput,
  femininumInput,
  neutrumInput
}) {
  const masculinum =
    exColonibusMacra(lemmaInput).trim();

  const femininum =
    exColonibusMacra(femininumInput).trim();

  const neutrum =
    exColonibusMacra(neutrumInput).trim();

  if (!/a$/i.test(femininum)) {
    throw new Error(
      'Femininum adiectivi a-/o-declinationis in -a desinere debet.'
    );
  }

  const stemma =
    femininum.replace(/a$/i, '');

  if (
    clavisQuaestionis(neutrum) !==
    clavisQuaestionis(stemma + 'um')
  ) {
    throw new Error(
      'Neutrum adiectivi a-/o-declinationis eodem stemmate et -um formari debet.'
    );
  }

  const lemmaNudum =
    sineMacris(masculinum).toLowerCase();

  const formae = [];

  const add = (genus, numerus, casus, formaMacris) => {
    formae.push(
      recordumFormae({
        formaMacris,
        lemmaNudum,
        pars: 'adiectivum',
        genus,
        numerus,
        casus
      })
    );
  };

  const vocativusMasculinus = (() => {
    if (/ius$/i.test(masculinum)) {
      return stemma.slice(0, -1) + 'ī';
    }

    if (/us$/i.test(masculinum)) {
      return stemma + 'e';
    }

    return masculinum;
  })();

  // Masculinum singularis
  add('m', 'sg', 'nom', masculinum);
  add('m', 'sg', 'gen', stemma + 'ī');
  add('m', 'sg', 'dat', stemma + 'ō');
  add('m', 'sg', 'acc', stemma + 'um');
  add('m', 'sg', 'abl', stemma + 'ō');
  add('m', 'sg', 'voc', vocativusMasculinus);

  // Femininum singularis
  add('f', 'sg', 'nom', femininum);
  add('f', 'sg', 'gen', stemma + 'ae');
  add('f', 'sg', 'dat', stemma + 'ae');
  add('f', 'sg', 'acc', stemma + 'am');
  add('f', 'sg', 'abl', stemma + 'ā');
  add('f', 'sg', 'voc', femininum);

  // Neutrum singularis
  add('n', 'sg', 'nom', neutrum);
  add('n', 'sg', 'gen', stemma + 'ī');
  add('n', 'sg', 'dat', stemma + 'ō');
  add('n', 'sg', 'acc', neutrum);
  add('n', 'sg', 'abl', stemma + 'ō');
  add('n', 'sg', 'voc', neutrum);

  // Masculinum pluralis
  add('m', 'pl', 'nom', stemma + 'ī');
  add('m', 'pl', 'gen', stemma + 'ōrum');
  add('m', 'pl', 'dat', stemma + 'īs');
  add('m', 'pl', 'acc', stemma + 'ōs');
  add('m', 'pl', 'abl', stemma + 'īs');
  add('m', 'pl', 'voc', stemma + 'ī');

  // Femininum pluralis
  add('f', 'pl', 'nom', stemma + 'ae');
  add('f', 'pl', 'gen', stemma + 'ārum');
  add('f', 'pl', 'dat', stemma + 'īs');
  add('f', 'pl', 'acc', stemma + 'ās');
  add('f', 'pl', 'abl', stemma + 'īs');
  add('f', 'pl', 'voc', stemma + 'ae');

  // Neutrum pluralis
  add('n', 'pl', 'nom', stemma + 'a');
  add('n', 'pl', 'gen', stemma + 'ōrum');
  add('n', 'pl', 'dat', stemma + 'īs');
  add('n', 'pl', 'acc', stemma + 'a');
  add('n', 'pl', 'abl', stemma + 'īs');
  add('n', 'pl', 'voc', stemma + 'a');

  return {
    lemmaNudum,
    formae
  };
}

function generaAdiectivumI({
  lemmaInput,
  femininumInput,
  neutrumInput
}) {
  const masculinum =
    exColonibusMacra(lemmaInput).trim();

  const femininum =
    exColonibusMacra(femininumInput).trim();

  const neutrum =
    exColonibusMacra(neutrumInput).trim();

  if (!/is$/i.test(femininum)) {
    throw new Error(
      'Femininum adiectivi i-declinationis trium terminationum in -is desinere debet.'
    );
  }

  const stemma =
    femininum.replace(/is$/i, '');

  if (
    clavisQuaestionis(neutrum) !==
    clavisQuaestionis(stemma + 'e')
  ) {
    throw new Error(
      'Neutrum adiectivi i-declinationis trium terminationum eodem stemmate et -e formari debet.'
    );
  }

  const lemmaNudum =
    sineMacris(masculinum).toLowerCase();

  const formae = [];

  const add = (genus, numerus, casus, formaMacris) => {
    formae.push(
      recordumFormae({
        formaMacris,
        lemmaNudum,
        pars: 'adiectivum',
        genus,
        numerus,
        casus
      })
    );
  };

  // Masculinum singularis
  add('m', 'sg', 'nom', masculinum);
  add('m', 'sg', 'gen', stemma + 'is');
  add('m', 'sg', 'dat', stemma + 'ī');
  add('m', 'sg', 'acc', stemma + 'em');
  add('m', 'sg', 'abl', stemma + 'ī');
  add('m', 'sg', 'voc', masculinum);

  // Femininum singularis
  add('f', 'sg', 'nom', femininum);
  add('f', 'sg', 'gen', stemma + 'is');
  add('f', 'sg', 'dat', stemma + 'ī');
  add('f', 'sg', 'acc', stemma + 'em');
  add('f', 'sg', 'abl', stemma + 'ī');
  add('f', 'sg', 'voc', femininum);

  // Neutrum singularis
  add('n', 'sg', 'nom', neutrum);
  add('n', 'sg', 'gen', stemma + 'is');
  add('n', 'sg', 'dat', stemma + 'ī');
  add('n', 'sg', 'acc', neutrum);
  add('n', 'sg', 'abl', stemma + 'ī');
  add('n', 'sg', 'voc', neutrum);

  // Masculinum pluralis
  add('m', 'pl', 'nom', stemma + 'ēs');
  add('m', 'pl', 'gen', stemma + 'ium');
  add('m', 'pl', 'dat', stemma + 'ibus');
  add('m', 'pl', 'acc', stemma + 'ēs');
  add('m', 'pl', 'abl', stemma + 'ibus');
  add('m', 'pl', 'voc', stemma + 'ēs');

  // Femininum pluralis
  add('f', 'pl', 'nom', stemma + 'ēs');
  add('f', 'pl', 'gen', stemma + 'ium');
  add('f', 'pl', 'dat', stemma + 'ibus');
  add('f', 'pl', 'acc', stemma + 'ēs');
  add('f', 'pl', 'abl', stemma + 'ibus');
  add('f', 'pl', 'voc', stemma + 'ēs');

  // Neutrum pluralis
  add('n', 'pl', 'nom', stemma + 'ia');
  add('n', 'pl', 'gen', stemma + 'ium');
  add('n', 'pl', 'dat', stemma + 'ibus');
  add('n', 'pl', 'acc', stemma + 'ia');
  add('n', 'pl', 'abl', stemma + 'ibus');
  add('n', 'pl', 'voc', stemma + 'ia');

  return {
    lemmaNudum,
    formae
  };
}

function generaSubstantivumA({ lemmaInput, genus, numerusTyp }) {
  const lemmaMacris = exColonibusMacra(lemmaInput).trim();
  const lemmaNudum = sineMacris(lemmaMacris);
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
    forma: sineMacris(forma),
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
      .map(s => sineMacris(s))
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
  const lemmaNudum = sineMacris(lemmaMacris);
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

function casusAdpositionisSelecti() {
  return [
    ...document.querySelectorAll(
      'input[name="addeAdpositioCasus"]:checked'
    )
  ].map(input => input.value);
}

function syncAddeForm() {
  const lemma = document.getElementById('addeLemma')?.value.trim() || '';
  const pars = document.getElementById('addePars')?.value || '';
  const genus = document.getElementById('addeGenus')?.value || '';
  const declinatio = document.getElementById('addeDeclinatio')?.value || '';
  const numerusTyp = document.getElementById('addeNumerusTyp')?.value || '';
    const coniunctioTypus =
    document.getElementById('addeConiunctioTypus')?.value || '';

  const coniunctioEnclitica =
    document.getElementById('addeConiunctioEnclitica')?.value || '';

  const adpositioTypus =
    document.getElementById('addeAdpositioTypus')?.value || '';
  
  const casusAdpositionis =
    casusAdpositionisSelecti();

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

    const femininumAdiectivi =
    document.getElementById('addeAdiectivumFemininum')?.value.trim() || '';

  const neutrumAdiectivi =
    document.getElementById('addeAdiectivumNeutrum')?.value.trim() || '';

  document.getElementById('addeAdiectivumFemininumCard').hidden =
    pars !== 'adiectivum';

  document.getElementById('addeAdiectivumNeutrumCard').hidden =
    pars !== 'adiectivum' ||
    !femininumAdiectivi;

  document.getElementById('addeAdiectivumCard').hidden =
    pars !== 'adiectivum' ||
    !femininumAdiectivi ||
    !neutrumAdiectivi;

  document.getElementById('addeConiunctioTypusCard').hidden =
    pars !== 'coniunctio';

  document.getElementById('addeConiunctioEncliticaCard').hidden =
    pars !== 'coniunctio' ||
    !coniunctioTypus;

  document.getElementById('addeAdpositioTypusCard').hidden =
    pars !== 'adpositio';
  
  document.getElementById('addeAdpositioCasusCard').hidden =
    pars !== 'adpositio' ||
    !adpositioTypus;

  document.getElementById('addeAdpositioFormaeVariaeCard').hidden =
    pars !== 'adpositio' ||
    !adpositioTypus;

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

    if (pars === 'adiectivum') {
    const adiectivumDeclinatio =
      document.getElementById('addeAdiectivumDeclinatio')?.value || '';

    potestServari = Boolean(
      lemma &&
      femininumAdiectivi &&
      neutrumAdiectivi &&
      adiectivumDeclinatio
    );
  }

  if (pars === 'coniunctio') {
    potestServari = Boolean(
      lemma &&
      coniunctioTypus &&
      coniunctioEnclitica !== ''
    );
  }

  if (pars === 'adpositio') {
    potestServari = Boolean(
      lemma &&
      adpositioTypus &&
      casusAdpositionis.length > 0
    );
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

  document.getElementById('addeAdiectivumFemininum').value = '';
  document.getElementById('addeAdiectivumNeutrum').value = '';
  document.getElementById('addeAdiectivumDeclinatio').value = '';

  document.getElementById('addeConiunctioTypus').value = '';
  document.getElementById('addeConiunctioEnclitica').value = '';

  document.getElementById('addeAdpositioTypus').value = '';
  document.getElementById('addeAdpositioFormaeVariae').value = '';
  
  document
    .querySelectorAll('input[name="addeAdpositioCasus"]')
    .forEach(input => {
      input.checked = false;
    });
  
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

function generaConiunctionem({
  lemmaInput,
  typus,
  enclitica
}) {
  const lemmaMacris =
    exColonibusMacra(
      sineHyphenoInitiali(lemmaInput)
    ).trim();

  if (!lemmaMacris) {
    throw new Error(
      'Lemma coniunctionis vacuum esse non potest.'
    );
  }

  const lemmaNudum =
    sineMacris(lemmaMacris);

  const lexemeId =
    crypto.randomUUID();

  const recordum = {
    ...recordumFormae({
      formaMacris: lemmaMacris,
      lemmaNudum,
      pars: 'coniunctio',
      genus: null,
      numerus: null,
      casus: null
    }),

    lexeme_id: lexemeId,
    typus_coniunctionis: typus,
    enclitica: enclitica === true
  };

  return {
    lemmaNudum,
    lexemeId,
    formae: [recordum]
  };
}

function generaAdpositionem({
  lemmaInput,
  typus,
  casus,
  formaeVariaeInput = ''
}) {
  const lemmaMacris =
    exColonibusMacra(lemmaInput).trim();

  const lemmaNudum =
    sineMacris(lemmaMacris);

  const lexemeId =
    crypto.randomUUID();

  const formaeMacris = [
    lemmaMacris,
    ...formaeVariaeInput
      .split(',')
      .map(forma =>
        exColonibusMacra(forma).trim()
      )
      .filter(Boolean)
  ];

  const formaeUnicae = [
    ...new Map(
      formaeMacris.map(forma => [
        clavisQuaestionis(forma),
        forma
      ])
    ).values()
  ];

  const formae = [];

  formaeUnicae.forEach(formaMacris => {
    casus.forEach(casusSingularis => {
      formae.push({
        ...recordumFormae({
          formaMacris,
          lemmaNudum,
          pars: typus,
          genus: null,
          numerus: null,
          casus: casusSingularis
        }),
        lexeme_id: lexemeId
      });
    });
  });

  return {
    lemmaNudum,
    lexemeId,
    formae
  };
}

async function speichereAddeFormular() {
  if (!window.whatseposSupabase) return;
  const lemmaInput = document.getElementById('addeLemma')?.value.trim();
  const pars = document.getElementById('addePars')?.value;
  if (!lemmaInput || !pars) { statusAdde('Lemma et pars orationis necessaria sunt.'); return; }

  if (pars === 'coniunctio') {
    const typus =
      document.getElementById('addeConiunctioTypus')?.value || '';

    const encliticaValor =
      document.getElementById('addeConiunctioEnclitica')?.value || '';

    if (!typus) {
      statusAdde('Typus coniunctionis eligendus est.');
      return;
    }

    if (!['true', 'false'].includes(encliticaValor)) {
      statusAdde('Dic utrum coniunctio enclitica sit.');
      return;
    }

    let paradigma;

    try {
      paradigma = generaConiunctionem({
        lemmaInput,
        typus,
        enclitica: encliticaValor === 'true'
      });
    } catch (error) {
      statusAdde(error.message);
      return;
    }

    const {
      lexemeId,
      formae
    } = paradigma;

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
  
  if (pars === 'adpositio') {
  const typus =
    document.getElementById('addeAdpositioTypus')?.value || '';

  const casus =
    casusAdpositionisSelecti();

  const formaeVariaeInput =
    document
      .getElementById('addeAdpositioFormaeVariae')
      ?.value
      .trim() || '';

  if (!typus) {
    statusAdde('Typus adpositionis eligendus est.');
    return;
  }

  if (!casus.length) {
    statusAdde('Saltem unus casus eligendus est.');
    return;
  }

  const {
    lemmaNudum,
    lexemeId,
    formae
  } = generaAdpositionem({
    lemmaInput,
    typus,
    casus,
    formaeVariaeInput
  });

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
    const declinatio =
      document.getElementById('addeDeclinatio')?.value;

    if (declinatio === 'a') {
      const { lemmaNudum, formae } =
        generaSubstantivumA({
          lemmaInput,
          genus:
            document.getElementById('addeGenus')?.value || null,
          numerusTyp:
            document.getElementById('addeNumerusTyp')?.value || 'sg_pl'
        });

      const { error } =
        await window.whatseposSupabase
          .from('formae')
          .insert(formae);

      if (error) {
        statusAdde(error.message);
        return;
      }

      aperiNouumLemma(lemmaNudum);
      return;
    }
  }

    if (pars === 'adiectivum') {
    const declinatio =
      document.getElementById('addeAdiectivumDeclinatio')?.value || '';

    const femininumInput =
      document.getElementById('addeAdiectivumFemininum')?.value.trim() || '';

    const neutrumInput =
      document.getElementById('addeAdiectivumNeutrum')?.value.trim() || '';

    let paradigma;

    try {
      if (declinatio === 'a_o') {
        paradigma = generaAdiectivumAO({
          lemmaInput,
          femininumInput,
          neutrumInput
        });
      } else if (declinatio === 'i') {
        paradigma = generaAdiectivumI({
          lemmaInput,
          femininumInput,
          neutrumInput
        });
      } else {
        statusAdde(
          'Nunc tantum adiectiua a-/o-declinationis et i-declinationis trium terminationum servari possunt.'
        );
        return;
      }
    } catch (error) {
      statusAdde(error.message);
      return;
    }

    const { lemmaNudum, formae } = paradigma;

    const { error } =
      await window.whatseposSupabase
        .from('formae')
        .insert(formae);

    if (error) {
      statusAdde(error.message);
      return;
    }

    aperiNouumLemma(lemmaNudum);
    return;
  }

  const lemmaMacris = exColonibusMacra(lemmaInput);
  const lemmaNudum = sineMacris(lemmaMacris);
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
  input.addEventListener('input', () => {
    reddeLemmaListam();
  });
}

document.getElementById('novumVerbumKnopf')?.addEventListener(
  'click',
  () => aperiAddeUerbum(input?.value.trim() || '')
);

document.getElementById('addeLemma')?.addEventListener('input', syncAddeForm);
document.getElementById('addePars')?.addEventListener('change', syncAddeForm);
document.getElementById('addeGenus')?.addEventListener('change', () => { resetDependentiaSubstantivi(); syncAddeForm(); });
document.getElementById('addeDeclinatio')?.addEventListener('change', () => { const numerusTyp = document.getElementById('addeNumerusTyp'); if (numerusTyp) numerusTyp.value = ''; syncAddeForm(); });
document.getElementById('addeNumerusTyp')?.addEventListener('change', syncAddeForm);
document.getElementById('addeAdiectivumFemininum')?.addEventListener('input', syncAddeForm);
document.getElementById('addeAdiectivumNeutrum')?.addEventListener('input', syncAddeForm);
document.getElementById('addeAdiectivumDeclinatio')?.addEventListener('change', syncAddeForm);
document.getElementById('addeConiunctioTypus')?.addEventListener('change', syncAddeForm);
document.getElementById('addeConiunctioEnclitica')?.addEventListener('change', syncAddeForm);
document.getElementById('addeConiugatio')?.addEventListener('change', syncAddeForm);
document.getElementById('addeVerbumTypus')?.addEventListener('change', syncAddeForm);
document.getElementById('addeVoxTypus')?.addEventListener('change', syncAddeForm);
document.getElementById('addeInfinitivus')?.addEventListener('input', syncAddeForm);
document.getElementById('addePerfectum')?.addEventListener('input', syncAddeForm);
document.getElementById('addeSupinum')?.addEventListener('input', syncAddeForm);

document
  .getElementById('addeAdpositioTypus')
  ?.addEventListener(
    'change',
    syncAddeForm
  );

document
  .querySelectorAll(
    'input[name="addeAdpositioCasus"]'
  )
  .forEach(input => {
    input.addEventListener(
      'change',
      syncAddeForm
    );
  });

document.getElementById('addeCancel')?.addEventListener('click', schliesseAddeUerbum);
document.getElementById('addeSave')?.addEventListener('click', speichereAddeFormular);
ladeLemmataOmnia().then(() => {
  reddeLemmaListam();
});
