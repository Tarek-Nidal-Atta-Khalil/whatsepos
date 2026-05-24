const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-admin {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin-top:1.3rem;
  margin-bottom:1.7rem;
}

.vox-button {
  height:62px;
  padding:0 24px;
  border:none;
  border-radius:18px;
  background:#1faa4b;
  color:white;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:1rem;
  letter-spacing:0.01em;
  box-shadow:0 10px 24px rgba(0,0,0,0.16);
  transition:all 0.18s ease;
  white-space:nowrap;
}

.vox-button:hover {
  transform:translateY(-1px);
  box-shadow:0 14px 30px rgba(0,0,0,0.22);
}
` + style.textContent;
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
  <button id="novumVerbumKnopf" type="button" class="vox-button" aria-label="Novum verbum addere">
    adde nouum
  </button>
`;

if (input && input.parentNode) {
  input.parentNode.insertBefore(adminBox, input.nextSibling);
}

const novumVerbumKnopf = document.getElementById('novumVerbumKnopf');
if (novumVerbumKnopf) {
  novumVerbumKnopf.addEventListener('click', function () {
    const formular = document.getElementById('novumVerbumForm');
    if (formular) formular.style.display = 'block';
    if (input) input.style.display = 'none';
    adminBox.style.display = 'none';
  });
}
