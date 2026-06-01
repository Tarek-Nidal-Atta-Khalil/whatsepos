const versusAeneidos = [
  {
    numerus: 1,
    textus: "Arma virumque cano, Troiae qui primus ab oris"
  },
  {
    numerus: 2,
    textus: "Italiam, fato profugus, Laviniaque venit"
  },
  {
    numerus: 3,
    textus: "litora, multum ille et terris iactatus et alto"
  },
  {
    numerus: 4,
    textus: "vi superum saevae memorem Iunonis ob iram;"
  },
  {
    numerus: 5,
    textus: "multa quoque et bello passus, dum conderet urbem,"
  },
  {
    numerus: 6,
    textus: "inferretque deos Latio, genus unde Latinum,"
  },
  {
    numerus: 7,
    textus: "Albanique patres, atque altae moenia Romae."
  },
  {
    numerus: 8,
    textus: "Musa, mihi causas memora, quo numine laeso,"
  },
  {
    numerus: 9,
    textus: "quidve dolens, regina deum tot volvere casus"
  },
  {
    numerus: 10,
    textus: "insignem pietate virum, tot adire labores"
  },
  {
    numerus: 11,
    textus: "impulerit. Tantaene animis caelestibus irae?"
  }
];

const litteraeLatinae =
  "A-Za-zĀĒĪŌŪȲāēīōūȳ";

function tokeniza(textus) {
  return (
    String(textus || "").match(
      new RegExp(`[${litteraeLatinae}]+|[^${litteraeLatinae}]+`, "g")
    ) || []
  );
}

function estVerbum(token) {
  return new RegExp(`^[${litteraeLatinae}]+$`).test(token);
}

function aperiInVocabulario(verbum) {
  window.location.href =
    `index.html?tab=vocabularium&q=${encodeURIComponent(verbum)}`;
}

function reddeVersum({ numerus, textus }) {
  const linea = document.createElement("div");
  linea.className = "lectorium-versus-linea";
  linea.id = `aen-1-${numerus}`;

  const numerusElementum = document.createElement("span");
  numerusElementum.className = "lectorium-versus-numerus";
  numerusElementum.textContent = numerus;

  const textusElementum = document.createElement("p");
  textusElementum.className = "lectorium-versus-textus";

  tokeniza(textus).forEach(token => {
    if (!estVerbum(token)) {
      textusElementum.appendChild(
        document.createTextNode(token)
      );

      return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "lectorium-verbum";
    button.textContent = token;

    button.addEventListener("click", () => {
      aperiInVocabulario(token);
    });

    textusElementum.appendChild(button);
  });

  linea.appendChild(numerusElementum);
  linea.appendChild(textusElementum);

  return linea;
}

function reddeAeneida() {
  const continens =
    document.getElementById("lectoriumVersus");

  if (!continens) return;

  continens.innerHTML = "";

  versusAeneidos.forEach(versus => {
    continens.appendChild(
      reddeVersum(versus)
    );
  });
}

reddeAeneida();
