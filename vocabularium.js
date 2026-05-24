const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-admin {
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:1.3rem;
  margin-bottom:1.7rem;
  gap:1rem;
}

.vox-button {
  width:88px;
  height:88px;
  border:none;
  border-radius:30px;
  background:#1faa4b;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 10px 24px rgba(0,0,0,0.16);
  transition:all 0.18s ease;
}

.vox-button:hover {
  transform:scale(1.06);
  box-shadow:0 14px 30px rgba(0,0,0,0.22);
}

.vox-inner {
  width:56px;
  height:56px;
  border-radius:999px;
  background:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  color:#1faa4b;
  font-size:1.15rem;
  letter-spacing:0.03em;
  font-family:sans-serif;
}

.novum-verbum-form {
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:0.8rem;
}

.novum-verbum-form input,
.novum-verbum-form select {
  padding:0.75rem 1rem;
  border-radius:14px;
  border:1px solid #d6d6d6;
  font-size:1rem;
}

.novum-verbum-form button {
  border:none;
  border-radius:14px;
  background:#7c3aed;
  color:white;
  font-weight:700;
  padding:0.8rem 1.2rem;
  cursor:pointer;
}
`;
document.head.appendChild(style);

const suggestiones = document.createElement('div');
suggestiones.id = 'vocabulariumSuggestiones';
suggestiones.style.display = 'none';
if (input && input.parentNode) {
  input.insertAdjacentElement('afterend', suggestiones);
}

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `
  <button id="novumVerbumKnopf" type="button" class="vox-button">
    <span class="vox-inner">VOX</span>
  </button>

  <form id="novumVerbumForm" class="novum-verbum-form" style="display:none;">
    <input id="novumLemma" type="text" placeholder="lemma, e.g. puella">

    <select id="novumFlexio">
      <option value="ao_adiectivum">a/o-adiectivum</option>
      <option value="a_declinatio_substantivum">substantivum: a-declinatio</option>
      <option value="o_declinatio_substantivum">substantivum: o-declinatio</option>
    </select>

    <select id="novumGenus">
      <option value="">genus auto</option>
      <option value="m">masculinum</option>
      <option value="f">femininum</option>
      <option value="n">neutrum</option>
    </select>

    <button type="submit">Servare</button>
  </form>

  <p id="novumVerbumStatus" class="status"></p>
`;

if (input) {
  input.insertAdjacentElement('afterend', adminBox);
}
