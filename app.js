"use strict";

const url = "https://bling.com.br/Api/v2/produtos/json?apikey=6ff8a552e9bf16d28044047db9bf215be0c1c9e0b9005d5da697bf09cd659f623c44e674";

const urlpag = "https://bling.com.br/Api/v2/formaspagamento/json?apikey=6ff8a552e9bf16d28044047db9bf215be0c1c9e0b9005d5da697bf09cd659f623c44e674";

const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const router = express.Router();
const app = express();

app.use(cors());

router.get("/api/pedidos", function(req, res, next) {
  axios.get(url).then(({ data }) => {
    res.setHeader("Content-Type", "application/json");
    res.send(data.retorno.produtos);
  });
});


router.get("/api/formaspagamento", function(req, res, next) {
  axios.get(urlpag).then(({ data }) => {
    res.setHeader("Content-Type", "application/json");
    res.send(data.retorno.formaspagamento);
  });
});

router.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use("/", router);
app.use(express.static(__dirname + "/public"));

app.listen(3000, function() {
  console.log("CORS-enabled web server listening on port 80");
});
