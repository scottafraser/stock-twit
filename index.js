require("dotenv").config();

const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));

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

app.get("/symbol/:id/count/:max", async function (req, res) {
  var id = req.params.id;
  var max = req.params.max;
  await axios
    .get(
      `https://api.stocktwits.com/api/2/streams/symbol/${id}.json?max=${max}`
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send({ error: error });
    });
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log("App is listening on port " + port);
