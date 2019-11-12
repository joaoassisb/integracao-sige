"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const axios = require("axios");

const router = express.Router();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.xml());

const blingBaseUrl = "https://bling.com.br/Api/v2";
const apikey =
  "6ff8a552e9bf16d28044047db9bf215be0c1c9e0b9005d5da697bf09cd659f623c44e674";

router.get("/api/pedidos", function(req, res, next) {
  const urlPedidos = `${blingBaseUrl}/produtos/json?apikey=${apikey}`;
  axios
    .get(urlPedidos)
    .then(({ data }) => {
      res.setHeader("Content-Type", "application/json");
      res.send(data.retorno.produtos);
    })
    .catch(next);
});

router.get("/api/formaspagamento", function(req, res, next) {
  const urlFormasPagamento = `${blingBaseUrl}/formaspagamento/json?apikey=${apikey}`;
  axios
    .get(urlFormasPagamento)
    .then(({ data }) => {
      res.setHeader("Content-Type", "application/json");
      res.send(data.retorno.formaspagamento);
    })
    .catch(next);
});

router.post("/api/propostacomercial", function(req, res, next) {
  const urlProposta = `${blingBaseUrl}/propostacomercial?apikey=${apikey}&xml=${req.body.xml}`;
  const config = {
    method: "post",
    url: urlProposta,
    headers: {
      ContentType: "application/x-www-form-urlencoded"
    }
  };

  axios(config)
    .then(({ data }) => {
      console.log(data);
      res.send(200);
    })
    .catch(err => {
      console.log("Erro");
      console.log(err);
    });
});

router.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use("/", router);
app.use(express.static(__dirname + "/public"));

app.listen(3000, function() {
  console.log("Servidor escutando na porta 3000 e CORS habilitado na porta 80");
});

function replaceAll(str, find, replace) {
  return str.replace(
    new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
    replace
  );
}
