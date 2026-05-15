import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

window.toggleMenu = function () {
  document.getElementById("sideMenu").classList.toggle("open");
};

async function legeGedichtMitTitelAn() {
  const titulus = titelEingabe.value.trim();

  if (!aktuellerUser) {
    setStatus("Bitte zuerst einloggen.");
    return;
  }

  if (titulus === "") {
    setStatus("Bitte einen Titel eingeben.");
    return;
  }

  const { data, error } = await supabase
    .from("poemata")
    .insert({
      user_id: aktuellerUser.id,
      titulus,
      textus: ""
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      setStatus("Du hast bereits ein Gedicht mit diesem Titel.");
    } else {
      setStatus(error.message);
    }
    return;
  }

  aktuellesGedicht = data;
  aktuellerTitel.textContent = data.titulus;
  nuntii.innerHTML = "";

  titelEingabeBereich.style.display = "none";
  arbeitsbereich.style.display = "block";

  setStatus("");
  campus.focus();
}

const supabase = createClient(
  "https://sdjhpovsechtfdwwakmm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamhwb3ZzZWNodGZkd3dha21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjIyNTIsImV4cCI6MjA5NDMzODI1Mn0.cyWJGEdA84bGAKyBcNYAXtJBLcf9Lo12oYn5CEAPhf4"
);

window.whatseposSupabase = supabase;

const campus = document.getElementById("campus");
const nuntii = document.getElementById("nuntii");
const meineTexteListe = document.getElementById("meineTexteListe");
const scriptoriumStart = document.getElementById("scriptoriumStart");
const titelEingabeBereich = document.getElementById("titelEingabeBereich");
const titelEingabe = document.getElementById("titelEingabe");
const arbeitsbereich = document.getElementById("arbeitsbereich");
const aktuellerTitel = document.getElementById("aktuellerTitel");

window.starteNeuesGedicht = function () {
  scriptoriumStart.style.display = "none";
  titelEingabeBereich.style.display = "block";
  arbeitsbereich.style.display = "none";

  titelEingabe.value = "";
  titelEingabe.focus();
};

titelEingabe.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    await legeGedichtMitTitelAn();
  }
});

let aktuellerUser = null;
let aktuellesGedicht = null;
let ausgewaehlteVerse = new Set();

const versWerkzeuge = document.createElement("div");
versWerkzeuge.id = "versWerkzeuge";
versWerkzeuge.style.display = "none";

const versLoeschenKnopf = document.createElement("button");
versLoeschenKnopf.id = "versLoeschenKnopf";
versLoeschenKnopf.type = "button";
versLoeschenKnopf.textContent = "🗑";
versLoeschenKnopf.title = "Ausgewählte Verse löschen";
versLoeschenKnopf.onclick = loescheAusgewaehlteVerse;

versWerkzeuge.appendChild(versLoeschenKnopf);
document.body.appendChild(versWerkzeuge);

window.zeigeTab = function(tabName) {
  ["login", "register", "hexameter", "meineTexte", "veroeffentlichungen", "profil"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(tabName).style.display = "block";
  document.getElementById("sideMenu").classList.remove("open");

  if (tabName === "meineTexte") {
    ladeGedichtsliste();
  }

  if (tabName === "veroeffentlichungen") {
    ladeVeroeffentlichungen();
  }

  if (tabName === "profil") {
    ladeProfil();
  }
};

campus.addEventListener("keydown", async function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    await fuegeVersHinzu();
  }
});

function zeigeGedicht(textus) {
  nuntii.innerHTML = "";

  if (!textus) {
    aktualisiereVersWerkzeuge();
    return;
  }

  const verse = textus.split("\n");

  verse.forEach((vers, index) => {
    const div = document.createElement("div");
    div.className = "vers-zeile";
    div.dataset.index = String(index);

    if (ausgewaehlteVerse.has(index)) {
      div.classList.add("ausgewaehlt");
    }

    const span = document.createElement("span");
    span.textContent = vers;

    div.onclick = function () {
      if (ausgewaehlteVerse.has(index)) {
        ausgewaehlteVerse.delete(index);
      } else {
        ausgewaehlteVerse.add(index);
      }

      zeigeGedicht(aktuellesGedicht.textus);
      aktualisiereVersWerkzeuge();
    };

    div.ondblclick = function (event) {
      event.stopPropagation();
      bearbeiteVers(index, vers);
    };

    div.appendChild(span);
    nuntii.appendChild(div);
  });

  nuntii.scrollTop = nuntii.scrollHeight;
  aktualisiereVersWerkzeuge();
}

function aktualisiereVersWerkzeuge() {
  if (ausgewaehlteVerse.size > 0) {
    versWerkzeuge.style.display = "flex";
    versLoeschenKnopf.title = ausgewaehlteVerse.size + " Vers(e) löschen";
  } else {
    versWerkzeuge.style.display = "none";
  }
}

async function loescheAusgewaehlteVerse() {
  if (!aktuellesGedicht || ausgewaehlteVerse.size === 0) return;

  const verse = aktuellesGedicht.textus.split("\n");

  const neueVerse = verse.filter(function (_vers, index) {
    return !ausgewaehlteVerse.has(index);
  });

  ausgewaehlteVerse.clear();
  await speichereGedichtText(neueVerse.join("\n"));
  setStatus("");
}

async function speichereGedichtText(neuerText) {
  if (!aktuellesGedicht || !aktuellerUser) return;

  const { error } = await supabase
    .from("poemata")
    .update({
      textus: neuerText,
      updated_at: new Date().toISOString()
    })
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht.textus = neuerText;
  zeigeGedicht(neuerText);
}

function bearbeiteVers(index, alterVers) {
  const zeilen = document.querySelectorAll(".vers-zeile");
  const zeile = zeilen[index];

  zeile.innerHTML = "";

  const input = document.createElement("input");
  input.className = "vers-editor";
  input.value = alterVers;

  zeile.appendChild(input);
  input.focus();

  input.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      const verse = aktuellesGedicht.textus.split("\n");
      verse[index] = input.value.trim();

      await speichereGedichtText(verse.join("\n"));
      setStatus("Vers bearbeitet.");
    }

    if (event.key === "Escape") {
      zeigeGedicht(aktuellesGedicht.textus);
    }
  });
}

async function fuegeVersHinzu() {
  const vers = campus.value.trim();
  if (vers === "") return;

  if (!aktuellesGedicht) {
    setStatus("Bitte zuerst ein Gedicht anlegen oder öffnen.");
    return;
  }

  const neuerText = aktuellesGedicht.textus
    ? aktuellesGedicht.textus + "\n" + vers
    : vers;

  const { error } = await supabase
    .from("poemata")
    .update({
      textus: neuerText,
      updated_at: new Date().toISOString()
    })
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht.textus = neuerText;
  zeigeGedicht(neuerText);
  campus.value = "";
  setStatus("");
}

window.ladeGedichtsliste = async function() {
  meineTexteListe.innerHTML = "";
  if (!aktuellerUser) return;

  const { data, error } = await supabase
    .from("poemata")
    .select("id, titulus, textus, created_at, updated_at, publicatum")
    .eq("user_id", aktuellerUser.id)
    .order("updated_at", { ascending: false });

  if (error) {
    setStatus(error.message);
    return;
  }

  data.forEach(gedicht => {
    const div = document.createElement("div");
    div.className = "titel-zeile";

    const titelSpan = document.createElement("span");
    titelSpan.textContent = gedicht.titulus;
    titelSpan.onclick = function () {
      oeffneGedicht(gedicht);
    };

    const erstelltSpan = document.createElement("span");
    erstelltSpan.className = "datum-spalte";
    erstelltSpan.textContent = formatiereDatum(gedicht.created_at);

    const geaendertSpan = document.createElement("span");
    geaendertSpan.className = "datum-spalte";
    geaendertSpan.textContent = formatiereDatum(gedicht.updated_at);

    const publishButton = document.createElement("button");
    publishButton.className = "veroeffentlichen-knopf";

    if (gedicht.publicatum) {
      publishButton.textContent = "publicatum";
      publishButton.disabled = true;
      publishButton.style.opacity = "0.6";
      publishButton.style.cursor = "default";
    } else {
      publishButton.textContent = "diuulgo";
      publishButton.onclick = async function (event) {
        event.stopPropagation();
        await veroeffentlicheGedicht(gedicht.id);
      };
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "loesch-knopf";
    deleteButton.textContent = "×";

    deleteButton.onclick = async function (event) {
      event.stopPropagation();

      const bestaetigt = confirm(
        `Das Gedicht "${gedicht.titulus}" wirklich löschen?`
      );

      if (!bestaetigt) return;

      const { error } = await supabase
        .from("poemata")
        .delete()
        .eq("id", gedicht.id)
        .eq("user_id", aktuellerUser.id);

      if (error) {
        setStatus(error.message);
        return;
      }

      if (aktuellesGedicht && aktuellesGedicht.id === gedicht.id) {
        aktuellesGedicht = null;
        nuntii.innerHTML = "";
      }

      await ladeGedichtsliste();
      setStatus("Gedicht gelöscht.");
    };

    div.appendChild(publishButton);
    div.appendChild(titelSpan);
    div.appendChild(erstelltSpan);
    div.appendChild(geaendertSpan);
    div.appendChild(deleteButton);
    meineTexteListe.appendChild(div);
  });
};

function oeffneGedicht(gedicht) {
  aktuellesGedicht = gedicht;
  aktuellerTitel.textContent = gedicht.titulus;

  scriptoriumStart.style.display = "none";
  titelEingabeBereich.style.display = "none";
  arbeitsbereich.style.display = "block";

  zeigeGedicht(gedicht.textus);
  zeigeTab("hexameter");
  setStatus("Gedicht geöffnet.");
  campus.focus();
}

window.loescheAktuellesGedicht = async function() {
  if (!aktuellesGedicht) {
    setStatus("Kein Gedicht ausgewählt.");
    return;
  }

  const bestaetigt = confirm("Dieses Gedicht wirklich löschen?");
  if (!bestaetigt) return;

  const { error } = await supabase
    .from("poemata")
    .delete()
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht = null;
  nuntii.innerHTML = "";

  await ladeGedichtsliste();
  setStatus("Gedicht gelöscht.");
};

window.registrieren = async function() {
  const username = document.getElementById("register_username").value.trim();
  const email = document.getElementById("register_email").value.trim();
  const password = document.getElementById("register_password").value;

  if (username === "") {
    document.getElementById("register_status").textContent =
      "Bitte Benutzernamen eingeben.";
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    document.getElementById("register_status").textContent = error.message;
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username
    });
  }

  document.getElementById("register_status").textContent =
    "Konto erfolgreich erstellt.";
};

window.einloggen = async function() {
  const email = document.getElementById("login_identifier").value.trim();
  const password = document.getElementById("login_password").value;

  if (!email.includes("@")) {
    document.getElementById("login_status").textContent =
      "Bitte vorerst mit E-Mail-Adresse anmelden.";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("login_status").textContent = error.message;
    return;
  }

  aktuellerUser = data.user;
  aktualisiereAuthMenu();
  await aktualisiereMenuButton();
  document.getElementById("login_status").textContent = "Eingeloggt.";

  await ladeGedichtsliste();
  zeigeTab("hexameter");
};

window.ausloggen = async function() {
  await supabase.auth.signOut();

  aktuellerUser = null;
  aktualisiereAuthMenu();
  await aktualisiereMenuButton();
  aktuellesGedicht = null;

  campus.value = "";
  nuntii.innerHTML = "";
  meineTexteListe.innerHTML = "";

  zeigeTab("login");
  setStatus("Ausgeloggt.");
};

async function aktualisiereMenuButton() {
  const button = document.getElementById("menuButton");

  if (!aktuellerUser) {
    button.textContent = "☰ Menü";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", aktuellerUser.id)
    .single();

  if (error || !data) {
    button.textContent = "☰ Menü";
    return;
  }

  button.textContent = "☰ " + data.username;
}

async function pruefeSitzung() {
  const { data } = await supabase.auth.getSession();

  if (data.session?.user) {
    aktuellerUser = data.session.user;
    aktualisiereAuthMenu();
    await ladeGedichtsliste();
    await aktualisiereMenuButton();
    zeigeTab("hexameter");
  } else {
    aktuellerUser = null;
    aktualisiereAuthMenu();
    await aktualisiereMenuButton();
    zeigeTab("login");
  }
}

function setStatus(text) {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = text;
  }
}

function aktualisiereAuthMenu() {
  const loggedOut = document.getElementById("authLoggedOut");
  const loggedIn = document.getElementById("authLoggedIn");

  if (aktuellerUser) {
    loggedOut.style.display = "none";
    loggedIn.style.display = "block";
  } else {
    loggedOut.style.display = "flex";
    loggedIn.style.display = "none";
  }
}

async function ladeProfil() {
  if (!aktuellerUser) {
    document.getElementById("profil_status").textContent =
      "Bitte zuerst einloggen.";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", aktuellerUser.id)
    .single();

  if (error) {
    document.getElementById("profil_status").textContent = error.message;
    return;
  }

  document.getElementById("profilUsername").value = data.username;
}

window.speichereProfil = async function () {
  if (!aktuellerUser) {
    document.getElementById("profil_status").textContent =
      "Bitte zuerst einloggen.";
    return;
  }

  const username = document
    .getElementById("profilUsername")
    .value
    .trim();

  if (username === "") {
    document.getElementById("profil_status").textContent =
      "Der Benutzername darf nicht leer sein.";
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", aktuellerUser.id);

  if (error) {
    document.getElementById("profil_status").textContent = error.message;
    return;
  }

  document.getElementById("profil_status").textContent =
    "Benutzername gespeichert.";

  await aktualisiereMenuButton();
};

window.veroeffentlicheGedicht = async function (gedichtId) {
  const bestaetigt = confirm(
    "Visne hoc carmen omnibus patefacere?"
  );

  if (!bestaetigt) return;

  const { error } = await supabase
    .from("poemata")
    .update({
      publicatum: true,
      publicatum_at: new Date().toISOString()
    })
    .eq("id", gedichtId)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  setStatus("Carmen divulgatum est.");
  await ladeGedichtsliste();
};

function formatiereDatum(isoString) {
  if (!isoString) return "";

  const datum = new Date(isoString);

  return datum.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

pruefeSitzung();
