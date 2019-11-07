function buildSelectUF() {
  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MS",
    "MT",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ];

  $.each(ufs, function(index, uf) {
    $("#uf").append(`<option>${uf}</option>`);
  });
}

function getProdutos() {
  fetch("/api/pedidos")
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}

function limpa_formulário_cep() {
  $("#cep").val("");
  $("#rua").val("");
  $("#bairro").val("");
  $("#cidade").val("");
  $("#uf").val("");
}

function buscaCep() {
  $("#cep").blur(function() {
    var cep = $(this)
      .val()
      .replace(/\D/g, "");

    if (cep != "") {
      var validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        $("#logradouro").prop("disabled", true);
        $("#bairro").prop("disabled", true);
        $("#cidade").prop("disabled", true);
        $("#uf").prop("disabled", true);

        fetch("https://viacep.com.br/ws/" + cep + "/json")
          .then(response => response.json())
          .then(({ logradouro, bairro, localidade, uf }) => {
            if (!logradouro) {
              throw new Error("Endereço não encontrado");
            }

            $("#logradouro").val(logradouro);
            $("#bairro").val(bairro);
            $("#cidade").val(localidade);
            $("#uf").val(uf);
          })
          .catch(() => {
            alert("Não foi possível recuperar o endereço.");
            $("#logradouro").prop("disabled", false);
            $("#bairro").prop("disabled", false);
            $("#cidade").prop("disabled", false);
            $("#uf").prop("disabled", false);
            limpa_formulário_cep();
          });
      } else {
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
      }
    }
  });
}
