window.ladeVeroeffentlichungen = async function () {
  const liste = document.getElementById("veroeffentlichungenListe");
  liste.innerHTML = "";

  const bibliothecaTitel = document.querySelector("#veroeffentlichungen h2");
  if (bibliothecaTitel) {
    bibliothecaTitel.textContent = "Bibliotheca";
    bibliothecaTitel.style.display = "block";
  }

  const { data, error } = await window.whatseposSupabase
    .from("poemata")
    .select("id, user_id, titulus, textus, updated_at, publicatum_at")
    .eq("publicatum", true)
    .order("publicatum_at", { ascending: false });

  if (error) {
    liste.textContent = error.message;
    return;
  }

  if (!data || data.length === 0) {
    liste.textContent = "Nulla adhuc carmina divulgata sunt.";
    return;
  }

  const userIds = [...new Set(data.map(function (gedicht) { return gedicht.user_id; }))];

  const { data: profiles, error: profilesError } = await window.whatseposSupabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  if (profilesError) {
    liste.textContent = profilesError.message;
    return;
  }

  const usernameById = {};
  profiles.forEach(function (profile) {
    usernameById[profile.id] = profile.username;
  });

  const bibliotheca = document.createElement("div");
  bibliotheca.className = "bibliotheca";

  data.forEach(function (gedicht) {
    gedicht.auctor = usernameById[gedicht.user_id] || "ignotus";

    const card = document.createElement("article");
    card.className = "bibliotheca-card";

    const titel = document.createElement("h3");
    titel.textContent = gedicht.titulus;

    const auctor = document.createElement("p");
    auctor.className = "bibliotheca-auctor";
    auctor.textContent = "a " + gedicht.auctor;

    const meta = document.createElement("p");
    meta.className = "bibliotheca-meta";
    meta.textContent = "divulgatum: " + formatiereBibliotheksDatum(gedicht.publicatum_at || gedicht.updated_at);

    const preview = document.createElement("p");
    preview.className = "bibliotheca-preview";
    preview.textContent = erstelleVorschau(gedicht.textus);

    const button = document.createElement("button");
    button.className = "lesen-knopf";
    button.textContent = "legere";
    button.onclick = function (event) {
      event.stopPropagation();
      zeigeVeroeffentlichtesGedicht(gedicht);
    };

    card.onclick = function () {
      zeigeVeroeffentlichtesGedicht(gedicht);
    };

    card.appendChild(titel);
    card.appendChild(auctor);
    card.appendChild(meta);
    card.appendChild(preview);
    card.appendChild(button);
    bibliotheca.appendChild(card);
  });

  liste.appendChild(bibliotheca);
};

function zeigeVeroeffentlichtesGedicht(gedicht) {
  const liste = document.getElementById("veroeffentlichungenListe");
  liste.innerHTML = "";

  const bibliothecaTitel = document.querySelector("#veroeffentlichungen h2");
  if (bibliothecaTitel) {
    bibliothecaTitel.style.display = "none";
  }

  const ansicht = document.createElement("article");
  ansicht.className = "lektueremodus";

  const zurueck = document.createElement("button");
  zurueck.className = "zurueck-knopf";
  zurueck.textContent = "← ad bibliothecam";
  zurueck.onclick = function () {
    window.ladeVeroeffentlichungen();
  };

  const titel = document.createElement("h2");
  titel.textContent = gedicht.titulus;

  const auctor = document.createElement("p");
  auctor.className = "lektueremodus-auctor";
  auctor.textContent = "a " + (gedicht.auctor || "ignotus");

  const meta = document.createElement("p");
  meta.className = "lektueremodus-meta";
  meta.textContent = "divulgatum: " + formatiereBibliotheksDatum(gedicht.publicatum_at || gedicht.updated_at);

  const text = document.createElement("pre");
  text.className = "lektueremodus-text";
  text.textContent = gedicht.textus || "";

  const interaktion = document.createElement("section");
  interaktion.className = "interaktion";

  interaktion.appendChild(erstelleBewertungskarte());
  interaktion.appendChild(erstelleTextkarte("Commentarium", "Commentarium scribere...", "commentari", "Kommentare werden im nächsten Schritt gespeichert."));
  interaktion.appendChild(erstelleTextkarte("Correctio", "Correctionem uel emendationem proponere...", "correctionem proponere", "Korrekturvorschläge werden später gespeichert."));

  ansicht.appendChild(zurueck);
  ansicht.appendChild(titel);
  ansicht.appendChild(auctor);
  ansicht.appendChild(meta);
  ansicht.appendChild(text);
  ansicht.appendChild(interaktion);
  liste.appendChild(ansicht);
}

function erstelleBewertungskarte() {
  const karte = document.createElement("div");
  karte.className = "interaktionskarte";

  const sterne = document.createElement("div");
  sterne.className = "bewertung-sterne";

  for (let i = 0; i < 5; i++) {
    const stern = document.createElement("button");
    stern.type = "button";
    stern.textContent = "☆";
    sterne.appendChild(stern);
  }

  const hinweis = document.createElement("p");
  hinweis.className = "platzhalter";
  hinweis.textContent = "Bewertungen werden im nächsten Schritt gespeichert.";

  karte.appendChild(sterne);
  karte.appendChild(hinweis);

  return karte;
}

function erstelleTextkarte(titelText, platzhalterText, buttonText, hinweisText) {
  const karte = document.createElement("div");
  karte.className = "interaktionskarte";

  const titel = document.createElement("h4");
  titel.textContent = titelText;

  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.placeholder = platzhalterText;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = buttonText;

  const hinweis = document.createElement("p");
  hinweis.className = "platzhalter";
  hinweis.textContent = hinweisText;

  karte.appendChild(titel);
  karte.appendChild(textarea);
  karte.appendChild(button);
  karte.appendChild(hinweis);

  return karte;
}

function erstelleVorschau(textus) {
  if (!textus) return "";

  const zeilen = textus
    .split("\n")
    .map(function (zeile) { return zeile.trim(); })
    .filter(function (zeile) { return zeile !== ""; });

  return zeilen.slice(0, 3).join(" / ");
}

function formatiereBibliotheksDatum(isoString) {
  if (!isoString) return "";

  const datum = new Date(isoString);

  return datum.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
