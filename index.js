require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

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

// app.get("/", function (req, res) {
//   res.sendFile(path.join("client", "build", "index.html"));
// });

var port_number = app.listen(process.env.PORT || 8080);
app.listen(port_number);
