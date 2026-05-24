const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

const style = document.createElement('style');
style.textContent = `
.vocabularium-search-row {
  display:flex;
  align-items:flex-start;
  justify-content:center;
  gap:16px;
  width:min(100%, 980px);
  margin:0 auto;
}

.vocabularium-search-column {
  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
}

.vocabularium-search-column #vocabulariumQuaere {
  width:100%;
  margin:0;
}

.vocabularium-admin {
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0;
  flex-shrink:0;
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

const adminBox = document.createElement('div');
adminBox.className = 'vocabularium-admin';
adminBox.innerHTML = `
  <button id="novumVerbumKnopf" type="button" class="vox-button" aria-label="Novum verbum addere">adde nouum</button>
`;

if (input && vocabulariumTab) {
  const row = document.createElement('div');
  row.className = 'vocabularium-search-row';

  const column = document.createElement('div');
  column.className = 'vocabularium-search-column';

  input.parentNode.insertBefore(row, input);

  row.appendChild(column);
  column.appendChild(input);
  column.appendChild(suggestiones);

  row.appendChild(adminBox);
}
