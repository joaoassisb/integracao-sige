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

function getFormasPagamento() {
  fetch("/api/formaspagamento")
    .then(res => res.json())
    .then(data => {
      data.forEach(element => {
        $("#SelectForma").append(`
          
            <option value="${element.formapagamento.id}" >${element.formapagamento.descricao}</option>`);
      });
    });
}

function getProdutos() {
  fetch("/api/pedidos")
    .then(res => res.json())
    .then(data => {
      data.forEach(element => {
        $("#TableItens tbody").append(`
        <tr>
          <td><input value="${element.produto.codigo}" class="produto" desc="${
          element.produto.descricao
        }" valor="${element.produto.preco}" onchange="Valor(this,${parseFloat(
          element.produto.preco
        )})" type="checkbox"/></td>
          <td>${element.produto.descricao}</td>
          <td>${parseFloat(element.produto.preco).toFixed(2)}</td>
          </tr>`);
      });
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

function Valor(input, valor) {
  var prop = $(input).prop("checked");
  var ValorTotal =
    $("#ValorTotal").val() == "" ? 0 : parseFloat($("#ValorTotal").val());

  if (prop == true) {
    $("#ValorTotal").val(ValorTotal + parseFloat(valor));
  } else {
    $("#ValorTotal").val(ValorTotal - valor);
  }
}
function getItensProposta() {
  var ProdutoSelecionado = $(".produto:checked");

  var itens = ``;

  for (i = 0; i < ProdutoSelecionado.length; i++) {
    itens += `
      <item>
        <codigo>${$(ProdutoSelecionado[i]).val()}</codigo>
        <descricao>${$(ProdutoSelecionado[i]).attr("desc")}</descricao>
        <un>"un"</un>
        <qtde>1</qtde>
        <valorUnidade>${parseFloat(
          $(ProdutoSelecionado[i]).attr("valor")
        )}</valorUnidade>
      </item>
    `;
  }

  return itens;
}

function GerarJson() {
  var data = new Date();

  var proxContato = new Date();
  proxContato.setDate(data.getDate() + 3);

  const items = getItensProposta();

  if (items.length === 0) {
    alert("Selecione pelo menos um item");
    return;
  }

  var obj = {
    xml: `
  <?xml version="1.0" encoding="UTF-8"?>
   <propostacomercial>                  
    <data>${data.toLocaleDateString("en-US")}</data>
    <dataProximoContato>${proxContato.toLocaleDateString(
      "en-US"
    )}</dataProximoContato>
    <cliente>
      <nome>${$("#nomeCliente").val()}</nome>
      <tipoPessoa>${$("#tipoPessoaCliente").val()}</tipoPessoa>
      <cpfCnpj>${$("#identificadorCliente").val()}</cpfCnpj>
      <ie>${$("#inscricaoEstadual").val()}</ie>            
      <rg>${$("#rg").val()}</rg>
      <endereco>${$("#logradouro").val()}</endereco>
      <numero>${$("#numero").val()}</numero>
      <complemento>${$("#complemente").val()}</complemento>
      <bairro>${$("#bairro").val()}</bairro>
      <cep>${$("#cep").val()}</cep>
      <uf>${$("#uf").val()}</uf>
      <fone>${$("#telefone").val()}</fone>
      <celular>${$("#celular").val()}</celular>
      <email>${$("#email").val()}</email>
    </cliente>
    <itens>
      ${items}
    </itens>
      <parcelas> 
        <parcela>
          <nrDias> ${$("#nrDias").val()}</nrDias>
          <valor>${$("#ValorTotal").val()}</valor>
          <obs>${$("#obs").val()}</obs>
          <formaPagamento> 
            <id>${$("#SelectForma").val()}</id>
          </formaPagamento>
       </parcela> 
      </parcelas>
    </propostacomercial>
    `
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  };

  fetch("/api/propostacomercial", options).then(res => {
    alert("Proposta criada com sucesso", res.data);
  });
}
