const litteraeLatinae =
  "A-Za-zĀĒĪŌŪȲāēīōūȳ";

const lectoriumStatus =
  document.getElementById("lectoriumStatus");

const lectoriumVersus =
  document.getElementById("lectoriumVersus");

let lectoriumIamLectum = false;
let lectoriumPromissum = null;

function statusLectorii(textus) {
  if (!lectoriumStatus) return;

  lectoriumStatus.textContent =
    textus || "";
}

function exspectaSupabase() {
  if (window.whatseposSupabase) {
    return Promise.resolve(
      window.whatseposSupabase
    );
  }

  return new Promise(resolve => {
    let tentamina = 0;

    const timer = setInterval(() => {
      tentamina += 1;

      if (
        window.whatseposSupabase ||
        tentamina >= 60
      ) {
        clearInterval(timer);

        resolve(
          window.whatseposSupabase ||
          null
        );
      }
    }, 50);
  });
}

function tokeniza(textus) {
  return (
    String(textus || "").match(
      new RegExp(
        `[${litteraeLatinae}]+|[^${litteraeLatinae}]+`,
        "g"
      )
    ) || []
  );
}

function estVerbum(token) {
  return new RegExp(
    `^[${litteraeLatinae}]+$`
  ).test(token);
}

function orthographiaLectorii(
  textus
) {
  return String(
    textus || ""
  )
    .replace(/v/g, "u")
    .replace(/[UV]/g, "V");
}

function aperiInVocabulario(verbum) {
  window.location.href =
    `index.html?tab=vocabularium&q=${
      encodeURIComponent(verbum)
    }`;
}

function reddeVersum({
  id,
  numerus,
  textus
}) {
  const linea =
    document.createElement("div");

  linea.className =
    "lectorium-versus-linea";

  linea.id =
    `aen-1-${numerus}`;

  const numerusElementum =
    document.createElement("span");

  numerusElementum.className =
    "lectorium-versus-numerus";

  numerusElementum.textContent =
    numerus;

  const textusElementum =
    document.createElement("p");

  textusElementum.className =
    "lectorium-versus-textus";

  let ordoVerbi = 0;

  tokeniza(textus).forEach(token => {
    if (!estVerbum(token)) {
      textusElementum.appendChild(
        document.createTextNode(token)
      );

      return;
    }

    ordoVerbi += 1;

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "lectorium-verbum";

    button.textContent =
      orthographiaLectorii(
        token
      );

    button.dataset.versusId =
      id || "";

    button.dataset.ordoVerbi =
      String(ordoVerbi);

    button.dataset.forma =
      token;

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        if (
          window
            .monstraLectoriumSprechbulam
        ) {
          window
            .monstraLectoriumSprechbulam(
              button
            );

          return;
        }

        aperiInVocabulario(token);
      }
    );

    textusElementum.appendChild(
      button
    );
  });

  linea.appendChild(
    numerusElementum
  );

  linea.appendChild(
    textusElementum
  );

  return linea;
}

function reddeVersus(versus) {
  if (!lectoriumVersus) return;

  lectoriumVersus.innerHTML = "";

  if (!versus.length) {
    statusLectorii(
      "Nulli versus inventi sunt."
    );

    return;
  }

  versus.forEach(versusSingularis => {
    lectoriumVersus.appendChild(
      reddeVersum(
        versusSingularis
      )
    );
  });

  statusLectorii("");
}

async function legeVersusAeneidos() {
  const supabase =
    await exspectaSupabase();

  if (!supabase) {
    throw new Error(
      "Supabase nondum legi potest."
    );
  }

  const {
    data: opus,
    error: opusError
  } =
    await supabase
      .from("lectiones_opera")
      .select(
        "id, auctor, titulus, abbreviatio"
      )
      .eq("auctor", "Vergilius")
      .eq("titulus", "Aeneis")
      .maybeSingle();
  
  if (opusError) {
    throw opusError;
  }
  
  if (!opus) {
    throw new Error(
      "Opus non inventum est: Vergilius, Aeneis."
    );
  }
  const {
    data: liber,
    error: liberError
  } =
    await supabase
      .from("lectiones_libri")
      .select(
        "id, numerus, titulus"
      )
      .eq("opus_id", opus.id)
      .eq("numerus", 1)
      .maybeSingle();
  
  if (liberError) {
    throw liberError;
  }
  
  if (!liber) {
    throw new Error(
      "Liber non inventus est: Aeneis I."
    );
  }
  const {
    data: versus,
    error: versusError
  } =
    await supabase
      .from("lectiones_versus")
      .select(
        "id, numerus, textus"
      )
      .eq("liber_id", liber.id)
      .order(
        "numerus",
        { ascending: true }
      );

  if (versusError) {
    throw versusError;
  }

  return versus || [];
}

window.ladeLectorium =
  async function ladeLectorium(
    optiones = {}
  ) {
    const erzwingen =
      Boolean(
        optiones.erzwingen
      );

    if (
      lectoriumIamLectum &&
      !erzwingen
    ) {
      return;
    }

    if (
      lectoriumPromissum &&
      !erzwingen
    ) {
      return lectoriumPromissum;
    }

    lectoriumPromissum =
      (async function () {
        statusLectorii(
          "Textus oneratur..."
        );

        try {
          const versus =
            await legeVersusAeneidos();

          reddeVersus(versus);

          lectoriumIamLectum =
            true;
        } catch (error) {
          console.error(error);

          statusLectorii(
            error.message ||
            "Textus legi non potest."
          );
        }
      })();

    try {
      await lectoriumPromissum;
    } finally {
      lectoriumPromissum =
        null;
    }
  };

window.ladeLectorium();
