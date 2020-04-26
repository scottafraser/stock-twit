require("dotenv").config();

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get tweets with matching symbol
const getSymbol = async (symbol) => {
  try {
    let res = await axios.get(
      `https://api.stocktwits.com/api/2/streams/${symbol}.json`
    );
    return res.json;
  } catch (error) {
    console.error(error);
  }
};

app.use(express.static(path.join(__dirname, "build")));

app.get("/trending", async function (req, res) {
  await axios
    .get(`https://api.stocktwits.com/api/2/streams/trending.json`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/symbol/:id", async function (req, res) {
  var id = req.params.id;
  await axios
    .get(`https://api.stocktwits.com/api/2/streams/symbol/${id}.json`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send({ error: error });
    });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8080);
console.log("Server running at 8080");
