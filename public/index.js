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
          
            <option value="${element.formapagamento.id}" >${element.formapagamento.descricao}</option>`
            
          );
  
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
          <td><input value="${element.produto.codigo}" class="produto" desc="${element.produto.descricao}" valor="${element.produto.preco}" onchange="Valor(this,${parseFloat(element.produto.preco)})" type="checkbox"/></td>
          <td>${element.produto.descricao}</td>
          <td>${parseFloat(element.produto.preco).toFixed(2)}</td>
          </tr>`
        );

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

function Valor(input,valor){
  var prop =$(input).prop("checked");
  var ValorTotal = $("#ValorTotal").val() =="" ? 0 : parseFloat($("#ValorTotal").val());

  if(prop == true){
    $("#ValorTotal").val(ValorTotal + parseFloat(valor));
  }else{
    $("#ValorTotal").val(ValorTotal-valor);
  }
}

function getItensProposta(){
  var ProdutoSelecionado = $(".produto:checked");


 var item ="";

  for(i=0;i<ProdutoSelecionado.length; i++){

   item +=` "item": {
        "codigo": "${$(ProdutoSelecionado[i]).val()}",
        "descricao": "${$(ProdutoSelecionado[i]).attr("desc")}",
        "un": "un",
        "qtde": 1,
        "valorUnidade": ${$(ProdutoSelecionado[i]).attr("valor")}
        },`;
    
    
  }

  return item;
}

function GerarJson(){
var data = new Date();

var proxContato = new Date();
proxContato.setDate(data.getDate() + 3);

var ObjJson = `
       {
        "propostacomercial": [
            {
                "propostacomercial": {                  
                    "data": "${data.toLocaleDateString('en-US')}",
                    "dataProximoContato": "${proxContato.toLocaleDateString('en-US')}",
                    "contatoAc": ""//STRING - op,
                    "loja": //INTEGER - op,
                    "numero": //INTEGER - op,
                    "vendedor": "" //STRING - op,
                    "desconto": "" //STRING - op,
                    "validade": //INTEGER - op,
                    "prazoEntrega": "" //STRING(100) - op,
                    "garantia": //INT - op,
                    "obs": "" //STRING - op,
                    "obsInternas": "" //STRING - op,
                    "assinaturaSaudacao": "" //STRING - op,
                    "assinaturaResponsavel": "0" //STRING- op,                    
                    "cliente": {
                        "id": "" //VARCHAR - op,
                        "nome": "${$("#nomeCliente").val()}",
                        "tipoPessoa":"${$("#tipoPessoaCliente").val()}",
                        "cpfCnpj": "${$("#identificadorCliente").val()}",
                        "ie": "${$("#inscricaoEstadual").val()}",
                        "rg": "${$("#rg").val()}",
                        "contribuinte":"" //STRING - op,
                        "endereco": "${$("#logradouro").val()}",
                        "numero": "${$("#numero").val()}",
                        "complemento": "${$("#complemente").val()}",
                        "bairro": "${$("#bairro").val()}",                        
                        "cep": "${$("#cep").val()}",
                        "cidade": "${$("#cidade").val()}s",                       
                        "uf": "${$("#uf").val()}",                       
                        "fone": "${$("#telefone").val()}",
                        "celular": "${$("#celular").val()}",
                        "email": "${$("#email").val()}"                       
                    },
                    "itens": [
                        {
                            ${getItensProposta()}
                        },                      
                    ],
                    "transporte": {
                        "transportadora": ""//STRING - op,
                        "tipoFrete": //STRING - op,
                        "frete": //DECIMAL - op
                    },
                    "parcelas": [
                        {
                            "parcela": {
                                "nrDias": ${$("#nrDias").val()},
                                "valor": "${$("#ValorTotal").val()}",                                
                                "obs": "${$("#obs").val()}",
                                "formaPagamento": {
                                    "id":${$("#SelectForma").val()}
                                }
                            }
                        }
                       
                    ]
                   
                }
            }
        ]
    }`;

   console.log(ObjJson);
}
