export const coniugationesUerbi = [
  {
    valor: "a",
    titulus: "a-coniugatio"
  },
  {
    valor: "e",
    titulus: "e-coniugatio"
  },
  {
    valor: "i",
    titulus: "i-coniugatio"
  },
  {
    valor: "consonantica",
    titulus: "coniugatio consonantica"
  },
  {
    valor: "mixta",
    titulus: "coniugatio mixta"
  },
  {
    valor: "irregularis",
    titulus: "irregularis"
  }
];

export const schemataUocis = [
  {
    valor: "utraque",
    titulus: "actiuum et passiuum"
  },
  {
    valor: "activum_tantum",
    titulus: "actiuum tantum"
  },
  {
    valor: "passivum_tantum",
    titulus: "passiuum tantum"
  },
  {
    valor: "deponens",
    titulus: "deponens"
  },
  {
    valor: "semideponens_act_pass",
    titulus:
      "semideponens: praesens actiuum → perfectum passiuum"
  },
  {
    valor: "semideponens_pass_act",
    titulus:
      "semideponens: praesens passiuum → perfectum actiuum"
  }
];

export function reddeElectionem({
  nomen,
  optiones,
  valorInitialis = ""
}) {
  const campus =
    document.createElement("fieldset");

  campus.className =
    "uerbum-electio";

  optiones.forEach(optio => {
    const label =
      document.createElement("label");

    label.className =
      "uerbum-electio-optio";

    const input =
      document.createElement("input");

    input.type =
      "radio";

    input.name =
      nomen;

    input.value =
      optio.valor;

    input.checked =
      optio.valor ===
      valorInitialis;

    label.appendChild(input);

    label.appendChild(
      document.createTextNode(
        optio.titulus
      )
    );

    campus.appendChild(label);
  });

  return campus;
}

export function legeElectionem(
  nomen,
  radix = document
) {
  return (
    radix.querySelector(
      `input[name="${nomen}"]:checked`
    )?.value ||
    ""
  );
}
