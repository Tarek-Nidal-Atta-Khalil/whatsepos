const input = document.getElementById('vocabulariumQuaere');
const status = document.getElementById('vocabulariumStatus');
const eventus = document.getElementById('vocabulariumEventus');
const vocabulariumTab = document.getElementById('vocabularium');

/* file content unchanged except following replacements:
- added helper normalisiereQuaestionem
- preserve original capitalization for saved lemmata/forms
*/

function normalisiereQuaestionem(textus) {
  return String(textus || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

function normalisiere(textus) {
  return String(textus || '').trim().replace(/j/g, 'i').replace(/v/g, 'u');
}
