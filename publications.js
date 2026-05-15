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

  const bewertung = erstelleSternebewertung();

  const seitenleisteKnopf = document.createElement("button");
  seitenleisteKnopf.className = "kommentar-toggle";
  seitenleisteKnopf.textContent = "commentarii";

  const kommentarLeiste = erstelleKommentarLeiste(gedicht.id);

  seitenleisteKnopf.onclick = function () {
    kommentarLeiste.classList.add("offen");
    ladeKommentare(gedicht.id, kommentarLeiste);
  };

  ansicht.appendChild(zurueck);
  ansicht.appendChild(titel);
  ansicht.appendChild(auctor);
  ansicht.appendChild(meta);
  ansicht.appendChild(text);
  ansicht.appendChild(bewertung);
  ansicht.appendChild(seitenleisteKnopf);
  ansicht.appendChild(kommentarLeiste);
  liste.appendChild(ansicht);
}

function erstelleSternebewertung() {
  const sterne = document.createElement("div");
  sterne.className = "bewertung-sterne";

  for (let i = 1; i <= 5; i++) {
    const stern = document.createElement("button");
    stern.type = "button";
    stern.textContent = "★";
    stern.dataset.wert = String(i);

    stern.addEventListener("mouseenter", function () {
      markiereSterne(sterne, i);
    });

    stern.addEventListener("click", function () {
      sterne.dataset.gewaehlt = String(i);
      markiereSterne(sterne, i);
    });

    sterne.appendChild(stern);
  }

  sterne.addEventListener("mouseleave", function () {
    const gewaehlt = Number(sterne.dataset.gewaehlt || 0);
    markiereSterne(sterne, gewaehlt);
  });

  return sterne;
}

function markiereSterne(container, wert) {
  const sterne = container.querySelectorAll("button");
  sterne.forEach(function (stern) {
    const sternWert = Number(stern.dataset.wert);
    stern.classList.toggle("gewaehlt", sternWert <= wert);
  });
}

function erstelleKommentarLeiste(poemId) {
  const leiste = document.createElement("aside");
  leiste.className = "kommentar-leiste";

  const kopf = document.createElement("div");
  kopf.className = "kommentar-leiste-kopf";

  const titel = document.createElement("h3");
  titel.textContent = "Commentarii";

  const schliessen = document.createElement("button");
  schliessen.type = "button";
  schliessen.textContent = "×";
  schliessen.onclick = function () {
    leiste.classList.remove("offen");
  };

  kopf.appendChild(titel);
  kopf.appendChild(schliessen);

  const inhalt = document.createElement("div");
  inhalt.className = "kommentar-leiste-inhalt";
  inhalt.textContent = "Commentarii onerantur...";

  const formular = document.createElement("div");
  formular.className = "kommentar-formular";

  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.placeholder = "Commentarium scribere...";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "commentari";
  button.onclick = async function () {
    await speichereKommentar(poemId, null, textarea, leiste);
  };

  formular.appendChild(textarea);
  formular.appendChild(button);

  leiste.appendChild(kopf);
  leiste.appendChild(inhalt);
  leiste.appendChild(formular);

  return leiste;
}

async function ladeKommentare(poemId, leiste) {
  const inhalt = leiste.querySelector(".kommentar-leiste-inhalt");
  inhalt.innerHTML = "";

  const { data, error } = await window.whatseposSupabase
    .from("commentarii")
    .select("id, user_id, parent_id, textus, created_at")
    .eq("poem_id", poemId)
    .order("created_at", { ascending: true });

  if (error) {
    inhalt.textContent = error.message;
    return;
  }

  if (!data || data.length === 0) {
    const leer = document.createElement("p");
    leer.className = "platzhalter";
    leer.textContent = "Nulli adhuc commentarii.";
    inhalt.appendChild(leer);
    return;
  }

  const userIds = [...new Set(data.map(function (kommentar) { return kommentar.user_id; }))];
  const { data: profiles } = await window.whatseposSupabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  const usernameById = {};
  (profiles || []).forEach(function (profile) {
    usernameById[profile.id] = profile.username;
  });

  const kommentareByParent = {};
  data.forEach(function (kommentar) {
    const parent = kommentar.parent_id || "radix";
    if (!kommentareByParent[parent]) kommentareByParent[parent] = [];
    kommentareByParent[parent].push(kommentar);
  });

  (kommentareByParent.radix || []).forEach(function (kommentar) {
    inhalt.appendChild(erstelleKommentarElement(kommentar, kommentareByParent, usernameById, poemId, leiste, 0));
  });
}

function erstelleKommentarElement(kommentar, kommentareByParent, usernameById, poemId, leiste, ebene) {
  const artikel = document.createElement("article");
  artikel.className = "kommentar";
  if (ebene > 0) artikel.classList.add("antwort");

  const kopf = document.createElement("div");
  kopf.className = "kommentar-kopf";

  const auctor = document.createElement("strong");
  auctor.textContent = usernameById[kommentar.user_id] || "ignotus";

  const zeit = document.createElement("span");
  zeit.textContent = formatiereKommentarZeit(kommentar.created_at);

  kopf.appendChild(auctor);
  kopf.appendChild(zeit);

  const text = document.createElement("p");
  text.className = "kommentar-text";
  text.textContent = kommentar.textus;

  const antwortKnopf = document.createElement("button");
  antwortKnopf.type = "button";
  antwortKnopf.className = "antwort-knopf";
  antwortKnopf.textContent = "respondere";

  const antwortBereich = document.createElement("div");
  antwortBereich.className = "antwort-bereich";

  antwortKnopf.onclick = function () {
    antwortBereich.innerHTML = "";

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.placeholder = "Responsum scribere...";

    const senden = document.createElement("button");
    senden.type = "button";
    senden.textContent = "respondere";
    senden.onclick = async function () {
      await speichereKommentar(poemId, kommentar.id, textarea, leiste);
    };

    antwortBereich.appendChild(textarea);
    antwortBereich.appendChild(senden);
    textarea.focus();
  };

  artikel.appendChild(kopf);
  artikel.appendChild(text);
  artikel.appendChild(antwortKnopf);
  artikel.appendChild(antwortBereich);

  const antworten = kommentareByParent[kommentar.id] || [];
  antworten.forEach(function (antwort) {
    artikel.appendChild(erstelleKommentarElement(antwort, kommentareByParent, usernameById, poemId, leiste, ebene + 1));
  });

  return artikel;
}

async function speichereKommentar(poemId, parentId, textarea, leiste) {
  const textus = textarea.value.trim();
  if (textus === "") return;

  const { data: sessionData } = await window.whatseposSupabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    alert("Bitte zuerst einloggen.");
    return;
  }

  const { error } = await window.whatseposSupabase
    .from("commentarii")
    .insert({
      poem_id: poemId,
      user_id: user.id,
      parent_id: parentId,
      textus: textus
    });

  if (error) {
    alert(error.message);
    return;
  }

  textarea.value = "";
  await ladeKommentare(poemId, leiste);
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

function formatiereKommentarZeit(isoString) {
  if (!isoString) return "";

  const datum = new Date(isoString);

  return datum.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
